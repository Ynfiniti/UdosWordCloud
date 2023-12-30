FROM apache/airflow:latest

USER root

RUN apt-get update && \
    apt-get -y install git && \
    apt-get clean

USER airflow

RUN pip install -U scikit-learn

RUN pip install -U pip setuptools wheel

RUN pip install spacy

RUN pip install numpy

RUN python -m pip install mysql-connector-python

RUN python -m pip install mysql-connector

COPY requirements.txt /tmp/requirements.txt

RUN pip install -r /tmp/requirements.txt