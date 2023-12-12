import os, pathlib, json
db_secrets_path = os.path.join(pathlib.Path(__file__).parent, "db.json")
nyt_secrets_path = os.path.join(pathlib.Path(__file__).parent, "nyt.json")

if not os.path.exists(db_secrets_path) \
    or not os.path.exists(nyt_secrets_path):
    raise Exception(f"Missing secrets: {db_secrets_path if not os.path.exists(db_secrets_path) else nyt_secrets_path}")

db_secrets = json.load(open(db_secrets_path,"r"))
nyt_secrets = json.load(open(nyt_secrets_path,"r"))