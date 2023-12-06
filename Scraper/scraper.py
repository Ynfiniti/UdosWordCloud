from datetime import datetime
import requests
import json
from multiprocessing import Pool, Manager
from tqdm import tqdm
from utils import parseArticle
import mysql.connector

apiKey = ""
db_host = ""
db_user = ""
db_password = ""
db_database = ""

def fetch_month(year:int,month:int)->dict:
    global apiKey
    archive_url = f"https://api.nytimes.com/svc/archive/v1/{year}/{month}.json?api-key={apiKey}"
    request_url = archive_url.replace("#1", f"{year}").replace("#2", f"{month}")
    print("Fetching from",request_url)
    res = requests.get(request_url)
    obj = json.loads(res.text)

    docs = obj["response"]["docs"]
    return docs

def parse_docs(docs):
    print("parsing...")
    article_word_count = []
    with Manager() as smm:
        sl = smm.list()
        sl.extend(docs)
        with Pool(processes=10) as p:
            for res in p.imap_unordered(parseArticle, sl, chunksize=10):
                article_word_count.append(res)
    return article_word_count

if __name__ == '__main__':
    import time
    start_time = time.time()
    
    docs = fetch_month(1963,11)

    article_word_count = parse_docs(docs)

    print("---- parsed in %s seconds ----" % (time.time() - start_time))

    mydb = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database
    )

    date_sql = "INSERT IGNORE INTO date (publish_date) VALUES (%s)"
    article_sql = "INSERT IGNORE INTO article (href, dateID) VALUES (%s, %s)"
    topic_sql = "INSERT IGNORE INTO topic (name) VALUES(%s)"
    article_to_topic_sql = "INSERT IGNORE INTO article_to_topic (topicID, articleID) VALUES(%s, %s)"
    token_sql = "INSERT IGNORE INTO token (name, amount, articleID) VALUES(%s, %s, %s)"

    print("uploading....")
    # update via select before running
    prevDates = {}
    prevTopics = {}
    dbCursor = mydb.cursor()
    for article in article_word_count:
        date = article["date"].split("T")[0]
        # print(date)
        if date not in prevDates:
            # date_ = datetime.strptime(date, '%Y-%m-%d')#.isoformat()
            year = int(date.split("-")[0])
            month = int(date.split("-")[1].lstrip("0"))
            day = int(date.split("-")[2].lstrip("0"))
            date_ = datetime(year,month,day)
            print(date_)
            dbCursor.execute(date_sql, (date_,))
            mydb.commit()
            prevDates[date] = dbCursor.lastrowid
        
        dbCursor.execute(article_sql, (article["href"], prevDates[date]))
        mydb.commit()
        articleID = int("" + str(dbCursor.lastrowid))
        for topic in article["topics"]:
            if topic not in prevTopics:
                dbCursor.execute(topic_sql, (topic,))
                mydb.commit()
                prevTopics[topic] = dbCursor.lastrowid
        # print(articleID)
        article_to_topics = [(prevTopics[t], articleID) for t in article["topics"]]
        # print(article_to_topics)
        dbCursor.executemany(article_to_topic_sql, article_to_topics)

        tokens = [(k, article["wordCount"][k]["amount"], articleID) for k in article["wordCount"]]
        dbCursor.executemany(token_sql, tokens)
        
        mydb.commit()

    dbCursor.close()

    print("---- total execution time: %s seconds ----" % (time.time() - start_time))