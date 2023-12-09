from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python_operator import PythonOperator
from scraper import scrape

# Define default_args for the DAG
default_args = {
    'start_date': datetime.utcnow(),
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

# Define the DAG with the desired schedule_interval
dag = DAG(
    'hourly_scraper_dag',
    default_args=default_args,
    description='DAG to scrape every hour',
    schedule_interval=timedelta(hours=1),  # Set the interval to 1 hour
)

# Define the PythonOperator to execute scrape
run_scrape = PythonOperator(
    task_id='run_scrape',
    python_callable=scrape,
    dag=dag,
)

# Set the task dependencies
run_scrape

if __name__ == "__main__":
    dag.cli()
