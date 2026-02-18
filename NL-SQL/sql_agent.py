from os import environ
from langchain_groq import ChatGroq
from langchain.agents import create_agent
from dotenv import load_dotenv

#Custom module
from agent_toolkit import tools


load_dotenv()


model = ChatGroq(model="openai/gpt-oss-120b")

agent = create_agent(
    model = model,
    tools=tools
)


question = "How many departments are present in department table?"

for step in agent.stream(
    {"messages":[{"role":"user","content":question}]},
    stream_mode="values"
    ):
    step['messages'][-1].pretty_print()


