import spacy
from spacy.language import Language
# from transformers import pipeline
from multiprocessing.managers import SharedMemoryManager
import numpy as np

# classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

# Disabling components not needed (optional, but useful if run on a large dataset)
nlp = spacy.load(
    "en_core_web_lg",
    disable=["parser"]
)
nlp.enable_pipe("senter")
nlp.add_pipe("merge_noun_chunks")
nlp.add_pipe("merge_entities")

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


def countWordsInText(text):
    wordCount = {}
    document = nlp(text)
    for j in range(len(list(document))):
        token = document[j]
        if token.text in wordCount.keys():
            wordCount[token.text]["amount"] = wordCount[token.text]["amount"] + 1
        elif not token.is_stop and not token.is_punct:
            wordCount[token.text] = {}
            wordCount[token.text]["amount"] = 1

    return wordCount


def parseArticle(doc):
    # Count word inside the article
    text = extractText(doc)
    wordCount = countWordsInText(text)
    # Create article object with wordCount attached
    topics = getTopics(doc)

    return {
        "href": doc["web_url"],
        "date": doc["pub_date"],
        "topics": topics,
        "wordCount": wordCount
    }
