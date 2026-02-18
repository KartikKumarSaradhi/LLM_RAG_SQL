from os import environ
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from postgres_connection import db_object
# import load_env_vars
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

# api_key=environ.get("GROQ_API_KEY")      

# model 
model = ChatGroq(model="openai/gpt-oss-120b")

# object 
toolkit=SQLDatabaseToolkit(db=db_object, llm = model)

#get tools
tools  = toolkit.get_tools()

# view diff tools 
for tool in tools:
    print(f"{tool.name}:{tool.description}\n")

