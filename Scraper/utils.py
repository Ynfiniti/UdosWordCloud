import time
import spacy
from spacy.language import Language

# Disabling components not needed (optional, but useful if run on a large dataset)
nlp = spacy.load(
    "en_core_web_lg",
    disable=["parser"]
)
nlp.enable_pipe("senter")
nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")

def foo(my_number):
    square = my_number * my_number
    time.sleep(0.5)
    return square


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

def parseArticle(doc):
    # Count word inside the article
    text = extractText(doc)
    wordCount, matches = countWordsInText(text)
    wordCount = transferToWordCount(matches, wordCount)
    # Create article object with wordCount attached
    return {
        "href": doc["web_url"],
        "date": doc["pub_date"],
        "topics": doc["keywords"],
        "wordCount": wordCount
    }

def get(t):
    return nlp(t)