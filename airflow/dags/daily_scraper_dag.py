from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from airflow.utils.dates import days_ago
from datetime import datetime, timedelta
import requests
from scraper import daily_scrape

default_args = {
    'start_date': days_ago(1),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

dag = DAG(
    'daily_scraper_dag',
    default_args=default_args,
    description='DAG to scrape every day for the past day',
    schedule_interval='0 1 * * *',
    catchup=False
)

print_random_quote = PythonOperator(
    task_id='run_daily_scrape',
    python_callable=daily_scrape,
    dag=dag
)

print_random_quote