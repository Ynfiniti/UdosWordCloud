from datetime import datetime
import requests
import json
from multiprocessing import Pool, Manager
from tqdm import tqdm
from utils import parseArticle
import mysql.connector
from project_secrets import db_secrets,nyt_secrets

api_key = nyt_secrets["API_KEY"]
db_host = db_secrets["HOST"]
db_user = db_secrets["USER"]
db_password = db_secrets["PASSWORD"]
db_database = "udocloud"

def fetch_month(year:int,month:int)->dict:
    global api_key
    request_url = f"https://api.nytimes.com/svc/archive/v1/{year}/{month}.json?api-key={api_key}"
    print(f"Fetching month {year}-{month}")
    res = requests.get(request_url)
    obj = json.loads(res.text)

    docs = obj["response"]["docs"]
    return docs

def parse_docs(docs):
    # print("parsing...")
    article_word_count = []
    with Manager() as smm:
        sl = smm.list()
        sl.extend(docs)
        with Pool(processes=10) as p:
            for res in p.imap_unordered(parseArticle, sl, chunksize=10):
                article_word_count.append(res)
    return article_word_count

def formate_article_date(date:str)->datetime:
    '''
    date formate: "yyyy-MM-ddThh:mm:ss+0000"
    '''
    date = date.split("T")[0]
    splitted_date = date.split("-")
    year = int(splitted_date[0])
    month = int(splitted_date[1].lstrip("0"))
    day = int(splitted_date[2].lstrip("0"))
    date_ = datetime(year,month,day)
    return date_

def create_article_in_db(article,db_connection):
    params = parse_params_for_database(article)
    # return params
    try:
        cursor = db_connection.cursor()
        cursor.callproc("CreateArticle",params)
        for result in cursor.stored_results():
            rows = result.fetchall()
            if rows:
                articel_id_found = rows[0][0]
                # print(f"Found articleID: {articel_id_found}")
                cursor.close()
                return articel_id_found
            else:
                print("Article not found")
    except mysql.connector.Error as err:
        print(err)

def parse_params_for_database(article:dict)->list:
    params = [
        formate_article_date(article["date"]),
        article["href"],
        ",".join(article["topics"]),
        ",".join(f"{key}:{value['amount']}" for key, value in article["wordCount"].items())
    ]
    return params

if __name__ == '__main__':
    import time
    start_time = time.time()
    
    docs = fetch_month(1963,7)

    article_word_count = parse_docs(docs)
    print("Number of articles: ",len(article_word_count))
    parse_time = (time.time() - start_time)
    print("Parse-time: " , parse_time)
    start_time = time.time()

    mydb = mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_password,
        database=db_database
    )
    ###################
    # UPDATED VERSION #
    ###################

    for article in article_word_count:
        create_article_in_db(article,mydb)
    
    ###############
    # OLD VERSION #
    ###############
    # date_sql = "INSERT IGNORE INTO date (publish_date) VALUES (%s)"
    # article_sql = "INSERT IGNORE INTO article (href, dateID) VALUES (%s, %s)"
    # topic_sql = "INSERT IGNORE INTO topic (name) VALUES(%s)"
    # article_to_topic_sql = "INSERT IGNORE INTO article_to_topic (topicID, articleID) VALUES(%s, %s)"
    # token_sql = "INSERT IGNORE INTO token (name, amount, articleID) VALUES(%s, %s, %s)"

    # # print("uploading....")
    # # update via select before running
    # prevDates = {}
    # prevTopics = {}
    # dbCursor = mydb.cursor()
    # for article in article_word_count:
    #     date = article["date"].split("T")[0]
    #     # print(date)
    #     if date not in prevDates:
    #         # date_ = datetime.strptime(date, '%Y-%m-%d')#.isoformat()
    #         year = int(date.split("-")[0])
    #         month = int(date.split("-")[1].lstrip("0"))
    #         day = int(date.split("-")[2].lstrip("0"))
    #         date_ = datetime(year,month,day)
    #         # print(date_)
    #         dbCursor.execute(date_sql, (date_,))
    #         mydb.commit()
    #         prevDates[date] = dbCursor.lastrowid
        
    #     dbCursor.execute(article_sql, (article["href"], prevDates[date]))
    #     mydb.commit()
    #     articleID = int("" + str(dbCursor.lastrowid))
    #     for topic in article["topics"]:
    #         if topic not in prevTopics:
    #             dbCursor.execute(topic_sql, (topic,))
    #             mydb.commit()
    #             prevTopics[topic] = dbCursor.lastrowid
    #     # print(articleID)
    #     article_to_topics = [(prevTopics[t], articleID) for t in article["topics"]]
    #     # print(article_to_topics)
    #     dbCursor.executemany(article_to_topic_sql, article_to_topics)

    #     tokens = [(k, article["wordCount"][k]["amount"], articleID) for k in article["wordCount"]]
    #     dbCursor.executemany(token_sql, tokens)
        
    #     mydb.commit()

    # dbCursor.close()

    upload_time = time.time() - start_time
    print("Total upload time:", upload_time)
    print("Average upload time per article: ", upload_time/len(article_word_count))
    print("Average upload time per 100 article: ", upload_time*100/len(article_word_count))
    print("Total execution time: ",(upload_time + parse_time))