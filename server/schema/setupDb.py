import os
import subprocess
# load login credentials from environment variabels
from dotenv import load_dotenv
load_dotenv()
# drop and re create the database chess_db
os.system(f'psql -c "DROP DATABASE chess_db"')
os.system(f'psql -c "CREATE DATABASE chess_db"')
os.system(f'psql -d chess_db -f {os.path.abspath("schema.sql")}')