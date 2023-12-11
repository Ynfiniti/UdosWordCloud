import datetime
from mysql.connector import Error as mysql_error
from enum import Enum

class DatabaseDateStates(Enum):
    OPEN = 0
    IN_PROGRESS = 1
    FINISHED = 2


def parse_params_for_database(article:dict)->list:
    params = [
        formate_article_date(article["date"]),
        article["href"],
        ",".join(article["topics"]),
        ",".join(f"{key}:{value['amount']}" for key, value in article["wordCount"].items())
    ]
    return params

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
    except mysql_error as err:
        print(err)

def formate_article_date(date:str)->datetime:
    '''
    date formate: "%Y-%m-%dT%H:%M:%S%z
    '''
    date = date.split("T")[0]
    splitted_date = date.split("-")
    year = int(splitted_date[0])
    month = int(splitted_date[1].lstrip("0"))
    day = int(splitted_date[2].lstrip("0"))
    date_ = datetime(year,month,day)
    return date_

def first_and_last_day_of_month(year, month):
    # Create a datetime object for the first day of the month
    first_day = datetime(year, month, 1)

    # Calculate the number of days in the month
    if month == 12:
        next_month = datetime(year + 1, 1, 1)
    else:
        next_month = datetime(year, month + 1, 1)

    # Subtract one day to get the last day of the current month
    last_day = next_month - datetime.timedelta(days=1)

    return first_day, last_day

def set_date_state(date:str,state:DatabaseDateStates,db_connection):
    statement = "UPDATE date SET state = %s WHERE publish_date = Date(%s);"
    values = (state,date)
    cursor = db_connection.cursor()
    cursor.execute(statement,values)
    db_connection.commit()

def set_date_state_month(year:int,month:int,state:DatabaseDateStates,db_connection):
    first_day, last_day = first_and_last_day_of_month(year, month)
    statement = "UPDATE date SET state %s WHERE publish_date >= DATE(%s) AND publish_date <= DATE(%s)"
    values = (state,first_day,last_day)
    cursor = db_connection.cursor()
    cursor.execute(statement,values)
    db_connection.commit()