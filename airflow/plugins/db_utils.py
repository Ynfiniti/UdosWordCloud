import datetime
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
    except Exception as err:
        print(err)

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

def set_date_state(date:str,state:DatabaseDateStates,db_connection):
    statement = "UPDATE date SET state = %s WHERE publish_date = Date(%s);"
    values = (state,date)
    cursor = db_connection.cursor()
    cursor.execute(statement,values)
    db_connection.commit()