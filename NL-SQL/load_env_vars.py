from os import getcwd
from dotenv import load_dotenv
import load_env_vars
import os

env_path = os.path.join(getcwd(), ".env")

load_dotenv(env_path)