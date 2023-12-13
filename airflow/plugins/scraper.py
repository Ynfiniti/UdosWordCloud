import sys
import os

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# import variables from project_secrets and modules
from project_secrets import db_secrets,nyt_secrets
from db_utils import create_article_in_db, DatabaseDateStates, set_date_state
from lang_utils import parseArticle

# import libraries
import mysql.connector
import requests
import json
from datetime import datetime, timedelta
from multiprocessing import Pool, Manager

def fetch_month(year:int,month:int,api_key:str)->dict:
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

def scrape(date:datetime,state:DatabaseDateStates):
    year = date.year
    month = date.month
    day = date.month

    # get documents
    docs = fetch_month(
        year=year,
        month=month,
        api_key=nyt_secrets["API_KEY"])

    docs = [item for item in docs if datetime.strptime(item["publish_date"], "%Y-%m-%dT%H:%M:%S%z").date() == date.date()]
    # parse docs
    article_word_count = parse_docs(docs)
    # create database connnection
    mydb = mysql.connector.connect(
        host=db_secrets["HOST"],
        user=db_secrets["USER"],
        password=db_secrets["PASSWORD"],
        database=db_secrets["DATABASE"]
    )
    # upload to database
    for article in article_word_count:
        create_article_in_db(article,mydb)
    # set state to finished
    set_date_state(
        date=f"{year}-{month}-{day}",
        state=state,
        db_connection=mydb
    )
    mydb.close()

def daily_scrape():
    '''
    Function that will be executed every day to scrape the data of the last day
    '''
    date = datetime.today().date() - timedelta(days=1) # yesterday
    scrape(
        date=date,
        state=DatabaseDateStates.FINISHED
    )

def hourly_scrape():
    '''
    Function that will be executed every hour to scrape the data of the same day
    '''
    date = datetime.today().date() # today
    scrape(
        date=date,
        state=DatabaseDateStates.IN_PROGRESS
    )

  