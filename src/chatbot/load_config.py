
import os
import yaml
from dotenv import load_dotenv
from pyprojroot import here

load_dotenv()

with open(here("configs/project_config.yml")) as cfg:
    app_config = yaml.load(cfg, Loader=yaml.FullLoader)


class LoadProjectConfig:
    def __init__(self) -> None:

        # Load langsmith config
        api_key = os.getenv("LANGCHAIN_API_KEY")
        if api_key:
            os.environ["LANGCHAIN_API_KEY"] = api_key
        if "langsmith" in app_config:
            os.environ["LANGCHAIN_TRACING_V2"] = str(app_config["langsmith"].get("tracing", "false"))
            os.environ["LANGCHAIN_PROJECT"] = app_config["langsmith"].get("project_name", "rag_sql_project")

        # Load memory config
        self.memory_dir = here(app_config["memory"]["directory"])