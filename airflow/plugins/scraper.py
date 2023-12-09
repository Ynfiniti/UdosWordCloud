import sys
import os

# Add the project root directory to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Now you can import variables from project_secrets/__init__.py
from project_secrets import db_secrets,nyt_secrets
from db_utils import create_article_in_db,get_name
from lang_utils import parseArticle,get_name2

def scrape():
    print("################")
    print("Found these secrets:", db_secrets)
    print(get_name())
    print(get_name2())
    print("################")

def daily_scrape():
    print("################")
    print("# DAILY SCRAPE #")
    print("################")

def hourly_scrape():
    print("#################")
    print("# HOURLY SCRAPE #")
    print("#################")
