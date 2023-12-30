# UdoCluster
py -3.11 -m venv UdoScraper  

UdoScraper/Scripts/activate

pip install ipykernel       

pip install ipywidgets

pip install transformers

pip install tensorflow

pip install -U scikit-learn

pip install -U pip setuptools wheel

pip install spacy

python -m spacy download en_core_web_lg

python -m pip install mysql-connector-python

ipython kernel install --user --name=UdoScraperVenv

**Select new kernel for jupyter to run inside the venv**

To check if it worked, following code should return ```True``` 
``` python
import sys
sys.prefix != sys.base_prefix
```
