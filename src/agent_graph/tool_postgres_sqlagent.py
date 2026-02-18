import os
from dotenv import load_dotenv
from operator import itemgetter

from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from langchain_groq import ChatGroq
from langchain_community.utilities import SQLDatabase
from langchain_community.tools import QuerySQLDataBaseTool
from langchain_community.agent_toolkits import SQLDatabaseToolkit
from langchain_classic.chains import create_sql_query_chain  # ⚠️ deprecated but kept as requested
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain.tools import tool
from sqlalchemy import create_engine
from langchain.agents import create_agent
from urllib.parse import quote_plus

load_dotenv()


sql_llm =  ChatGroq(model="openai/gpt-oss-120b")

# Read environment variables
host = os.getenv("POSTGRES_HOST")
user = os.getenv("POSTGRES_USER")
password = quote_plus(os.getenv("POSTGRES_PASSWORD"))  # ✅ ENCODE
port = os.getenv("POSTGRES_PORT")
database = os.getenv("POSTGRES_DATABASE")  # ✅ FIXED NAME

# Build connection string
connection_string = (
    f"postgresql+psycopg2://{user}:{password}"
    f"@{host}:{port}/{database}"
)

# Optional: debug once
print("Connecting to:", f"{user}@{host}:{port}/{database}")

# Build engine
engine = create_engine(connection_string)
# db = SQLDatabase(engine=engine)
db_object = SQLDatabase(engine=engine)
tool_kit = SQLDatabaseToolkit(db=db_object, llm=sql_llm)
tools = tool_kit.get_tools()

system_role = """Given the following user question, corresponding SQL query, and SQL result, answer the user question.

Question: {question}
SQL Query: {query}
SQL Result: {result}
Answer:
"""

agent = create_agent(
    model = sql_llm,
    tools=tools
)

@tool
def query_sqldb(question: str) -> str:
    """
    Use this tool when the user asks a question that requires querying
    the SQL database. The tool internally uses an agentic SQL reasoner.
    """
    for step in agent.stream(
        {"messages": [{"role": "user", "content": question}]}, stream_mode="values"
    ):
        step["messages"][-1].pretty_print()


# # from langchain_classic.agents import create_openai_tools_agent, AgentExecutor
# import os
# from dotenv import load_dotenv
# from urllib.parse import quote_plus

# from sqlalchemy import create_engine

# from langchain_groq import ChatGroq
# from langchain_community.utilities import SQLDatabase
# from langchain_community.agent_toolkits import SQLDatabaseToolkit
# from langchain_classic.agents import create_openai_tools_agent, AgentExecutor
# from langchain_core.prompts import ChatPromptTemplate
# from langchain.tools import tool

# # --------------------------------------------------
# # 1. Load environment variables
# # --------------------------------------------------
# load_dotenv()

# # --------------------------------------------------
# # 2. LLM (Groq)
# # --------------------------------------------------
# sql_llm = ChatGroq(
#     model="openai/gpt-oss-120b",
#     temperature=0
# )

# # --------------------------------------------------
# # 3. PostgreSQL connection
# # --------------------------------------------------
# host = os.getenv("POSTGRES_HOST")
# user = os.getenv("POSTGRES_USER")
# password = quote_plus(os.getenv("POSTGRES_PASSWORD"))
# port = os.getenv("POSTGRES_PORT")
# database = os.getenv("POSTGRES_DATABASE")

# connection_string = (
#     f"postgresql+psycopg2://{user}:{password}"
#     f"@{host}:{port}/{database}"
# )

# print("Connecting to:", f"{user}@{host}:{port}/{database}")

# engine = create_engine(connection_string)

# db = SQLDatabase(engine=engine)

# # --------------------------------------------------
# # 4. SQL Toolkit
# # --------------------------------------------------
# toolkit = SQLDatabaseToolkit(db=db, llm=sql_llm)
# sql_tools = toolkit.get_tools()

# # --------------------------------------------------
# # 5. SQL Agent Prompt
# # --------------------------------------------------
# system_role = """Given the following user question, corresponding SQL query, and SQL result, answer the user question.

# Question: {question}
# SQL Query: {query}
# SQL Result: {result}
# Answer:
# """

# agent = create_agent(
#     model = sql_llm,
#     tools=sql_tools
# )


# # --------------------------------------------------
# # 7. TOOL: Agentic Postgres SQL
# # --------------------------------------------------
# @tool
# def query_sqldb(question: str) -> str:
#     """
#     Query the PostgreSQL database using agentic NL→SQL reasoning.
#     Input should be a natural language question.
#     """
#     result = agent.invoke({"input": question})
#     return result["output"]

# # --------------------------------------------------
# # 8. Optional local test
# # --------------------------------------------------
# if __name__ == "__main__":
#     response = query_sqldb.invoke(
#         "How many departments are present in department table?"
#     )
#     print(response)
