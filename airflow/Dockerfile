FROM apache/airflow:latest-python3.10

USER root

RUN apt-get update && \
    apt-get -y install git && \
    apt-get clean

USER airflow

RUN pip install ipykernel

RUN pip install ipywidgets

RUN pip install -U scikit-learn

RUN pip install -U pip setuptools wheel

RUN pip install spacy

RUN python -m spacy download en_core_web_lg

RUN python -m pip install mysql-connector-python==8.2.0

COPY requirements.txt /tmp/requirements.txt

RUN pip install -r /tmp/requirements.txt