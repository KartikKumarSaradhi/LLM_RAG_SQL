import os
from langchain_tavily import TavilySearch


def load_tavily_search_tool(tavily_search_max_results: int, api_key: str = None):
    """
    Initializes a Tavily search tool with max_results and optional custom API key override.
    """
    if api_key:
        return TavilySearch(max_results=tavily_search_max_results, tavily_api_key=api_key)
    return TavilySearch(max_results=tavily_search_max_results)