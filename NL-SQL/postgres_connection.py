from os import environ
from dotenv import load_dotenv
from sqlalchemy import create_engine
from urllib.parse import quote_plus
from langchain_community.utilities import SQLDatabase

# Load .env file
load_dotenv()

# Read environment variables
host = environ.get("POSTGRES_HOST")
user = environ.get("POSTGRES_USER")
password = quote_plus(environ.get("POSTGRES_PASSWORD"))  # ✅ ENCODE
port = environ.get("POSTGRES_PORT")
database = environ.get("POSTGRES_DATABASE")  # ✅ FIXED NAME

# Build connection string
connection_string = (
    f"postgresql+psycopg2://{user}:{password}"
    f"@{host}:{port}/{database}"
)

# Optional: debug once
print("Connecting to:", f"{user}@{host}:{port}/{database}")

# Build engine
engine = create_engine(connection_string)

# Build LangChain SQLDatabase object
db_object = SQLDatabase(engine=engine)
