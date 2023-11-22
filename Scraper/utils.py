import spacy
from spacy.language import Language
from transformers import pipeline
from multiprocessing.managers import SharedMemoryManager
import numpy as np

classifier = pipeline("zero-shot-classification",
                    model="facebook/bart-large-mnli")

# Disabling components not needed (optional, but useful if run on a large dataset)
nlp = spacy.load(
    "en_core_web_lg",
    disable=["parser"]
)
nlp.enable_pipe("senter")
nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")


allTopics: set[str] = set()

def init(shared_array_base):
    global shared_array
    shared_array = np.ctypeslib.as_array(shared_array_base.get_obj())
    shared_array = shared_array.reshape(10, 10)

# Parallel processing
def my_func(i):
    shared_array[i, :] = i

def mult(x):
    print("lmao this wordking?")
    return x**2

def fillTopics(text):
    if len(text) == 0 or len(allTopics) == 0:
        return []
    res = classifier(text, list(allTopics))
    return [i for index, i in enumerate(res["labels"]) if res["scores"][index] >= .8]

def addToGlobalTopics(topics: list[str]):
    for t in topics:
        allTopics.add(t.lower())

def getTopics(doc):
    ks = list(map(lambda k: k["value"], doc["keywords"]))
    nd = doc["news_desk"]
    sn = doc["section_name"]
    topics = set([t.lower() for t in [*ks, 
            nd if nd and nd != "None" else "", 
            sn if (not nd or nd == "None") and sn != "Archives" else ""
    ] if t != ""])

    return list(topics)

def extractText(doc) -> str:
    headline = doc["headline"]["print_headline"] or doc["headline"]["main"]
    abstracts = [doc["lead_paragraph"], doc["abstract"], doc["snippet"]]
    abstracts.sort(key=len, reverse=True)
    return str(headline + (f" {abstracts[0]} " if abstracts[0] else "")).lower()


def checkMatches(token, relevant_words):
    for comp in relevant_words.keys():
        comp_lg = nlp(comp)
        similarity = token.similarity(comp_lg)
        if similarity >= 0.8:
            return (comp, similarity)
    return False


def countWordsInText(text):
    wordCount = {}
    matches: dict[str, dict] = {}
    document = nlp(text)
    for j in range(len(list(document))):
        token = document[j]
        if token.text in matches.keys():
            matches[token.text]["amount"] = matches[token.text]["amount"] + 1
        elif token.text in wordCount.keys():
            wordCount[token.text]["amount"] = wordCount[token.text]["amount"] + 1
        elif not token.is_stop and not token.is_punct:
            matched = False
            if not matched:
                wordCount[token.text] = {}
                wordCount[token.text]["amount"] = 1
            else:
                matches[token.text] = {
                    "match": matched[0],
                    "similarity": matched[1],
                    "amount": 1,
                }
    return [wordCount, matches]


def transferToWordCount(matches, wordCount):
    for m in matches.items():
        if "duplicates" not in wordCount[m[1]["match"]]:
            wordCount[m[1]["match"]]["duplicates"] = {}
        wordCount[m[1]["match"]]["duplicates"][m[0]] = {
            "amount": m[1]["amount"],
            "similarity": m[1]["similarity"],
        }
        wordCount[m[1]["match"]]["amount"] = (
            wordCount[m[1]["match"]]["amount"] + m[1]["amount"]
        )
    return wordCount

def test(doc):
    text = extractText(doc)
    topics = getTopics(doc)

    addToGlobalTopics(topics)
    
    return list(set(topics))

def parseArticle(doc):
    # Count word inside the article
    text = extractText(doc)
    wordCount, matches = countWordsInText(text)
    wordCount = transferToWordCount(matches, wordCount)
    # Create article object with wordCount attached
    topics = getTopics(doc)

    return {
        "href": doc["web_url"],
        "date": doc["pub_date"],
        "topics": topics,
        "wordCount": wordCount
    }

def get(t):
    return nlp(t)