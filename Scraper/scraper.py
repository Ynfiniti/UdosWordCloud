from datetime import datetime
import requests
import json
from multiprocessing import Pool, Manager
from tqdm import tqdm
from modules.lang_utils import parseArticle
from project_secrets import db_secrets,nyt_secrets
import mysql.connector
import time

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
    except Exception as err:
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
    start_time = time.time()

    year = 1963
    month = 6
    day = None
    
    docs = fetch_month(year,month)

    if day is not None:
        target_date = datetime(year,month,day)
        # filter by date
        docs = [item for item in docs if datetime.strptime(item["publish_date"], "%Y-%m-%dT%H:%M:%S%z").date() == target_date.date()]

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
    
    for article in article_word_count:
        create_article_in_db(article,mydb)

    upload_time = time.time() - start_time
    print("Total upload time:", upload_time)
    print("Average upload time per article: ", upload_time/len(article_word_count))
    print("Average upload time per 100 article: ", upload_time*100/len(article_word_count))
    print("Total execution time: ",(upload_time + parse_time))