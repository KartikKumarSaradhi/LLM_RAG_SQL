# System Architecture & Functionalities Specification

**Project:** Agentic RAG, LLM & SQL System (`RAG_LLM_SQL`)

---

## 1. Executive Summary

The **RAG_LLM_SQL** repository implements an enterprise-grade, multi-tool **Agentic AI System** using **LangGraph**, **LangChain**, **Groq LLMs**, **ChromaDB**, **PostgreSQL**, and **Gradio**.

The system acts as a conversational assistant capable of dynamically routing user queries to specialized tools:

- **Retrieval-Augmented Generation (RAG)** over structured/unstructured domain documents (e.g., Swiss Airline Policies, Fictional Stories).
- **Natural Language to SQL (NL-SQL)** agentic queries over a PostgreSQL relational database.
- **Real-time Web Search** using the Tavily API.
- **Stateful Conversation Management** with checkpointing and daily CSV interaction memory logging.

---

## 2. High-Level System Architecture

```
                    +----------------------------------+
                    |          User / Web UI           |
                    |     (Gradio Interface in app.py) |
                    +----------------------------------+
                                     |
                                     v
                    +----------------------------------+
                    |          ChatBot Backend         |
                    |    (chatbot/chatbot_backend.py)  |
                    +----------------------------------+
                                     |
                                     v
+-----------------------------------------------------------------------------------+
|                            LangGraph State Machine                                |
|                        (agent_graph/builld_full_graph.py)                         |
|                                                                                   |
|      +---------------------+        route_tools        +---------------------+    |
|  --->|    Chatbot Node     | ------------------------> |     Tools Node      |    |
|      | (ChatGroq LLM)      | <------------------------ | (BasicToolNode)     |    |
|      +---------------------+      (Tool Results)       +---------------------+    |
|                 |                                                 |               |
|                 | (Final Answer)                                  |               |
|                 v                                                 |               |
|              [ END ]                                              v               |
+-----------------------------------------------------------------------------------+
                                                                    |
                               +------------------------------------+------------------------------------+
                               |                                    |                                    |
                               v                                    v                                    v
                 +--------------------------+          +--------------------------+          +--------------------------+
                 |       RAG Tools          |          |     PostgreSQL Tool      |          |     Web Search Tool      |
                 |  (ChromaDB + HuggingFace)|          |   (Agentic SQL Engine)   |          |      (Tavily API)        |
                 +--------------------------+          +--------------------------+          +--------------------------+
                               |                                    |                                    |
            +------------------+------------------+                 v                                    v
            |                                     |         PostgreSQL Database                      Live Web
            v                                     v
   Swiss Airline Policy                    Stories VectorDB
        VectorDB
```

---

## 3. Core Components & Functionalities

### 3.1. Agent Graph & Orchestration Engine

- **Files**: [`src/agent_graph/builld_full_graph.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/agent_graph/builld_full_graph.py), [`src/agent_graph/agent_backend.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/agent_graph/agent_backend.py)
- **Functionality**:
  - Built on **LangGraph (`StateGraph`)** for cyclical tool-calling decision loops.
  - Utilizes **MemorySaver** for session state checkpointing and conversation persistence across graph steps.
  - Implements **System Prompt Guidance** instructing the LLM to invoke tools strictly when required, prevent infinite loops, and avoid redundant schema checks.
  - **Tool Routing Logic (`route_tools`)**: Dynamically routes execution between the primary LLM (`ChatGroq`) and the tool node depending on whether `tool_calls` are emitted or a final text response is produced.

### 3.2. Vector DB & RAG Pipeline

- **Files**: [`src/prepare_vector_db.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/prepare_vector_db.py), [`src/agent_graph/tool_lookup_policy_rag.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/agent_graph/tool_lookup_policy_rag.py), [`src/agent_graph/tool_stories_rag.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/agent_graph/tool_stories_rag.py)
- **Functionality**:
  - **Ingestion Engine (`PrepareVectorDB`)**:
    - Processes raw PDF documents using `PyPDFLoader`.
    - Splits text recursively using `RecursiveCharacterTextSplitter` (configurable chunk size & overlap, default: 500 characters, 100 overlap).
    - Embeds text using HuggingFace embeddings (`sentence-transformers/all-MiniLM-L6-v2`).
    - Stores and persists vector collections in **ChromaDB**.
  - **Domain RAG Tools**:
    1. **`lookup_swiss_airline_policy`**: Performs similarity search over company policy documents stored in `data/airline_policy_vectordb`.
    2. **`lookup_stories`**: Performs similarity search over fictional narrative datasets stored in `data/stories_vectordb`.

### 3.3. Natural Language to SQL (NL-SQL) Engine

- **Files**: [`src/agent_graph/tool_postgres_sqlagent.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/agent_graph/tool_postgres_sqlagent.py), [`NL-SQL/sql_agent.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/NL-SQL/sql_agent.py), [`NL-SQL/postgres_connection.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/NL-SQL/postgres_connection.py)
- **Functionality**:
  - Establishes a secure connection to PostgreSQL database engines via `SQLAlchemy` and `psycopg2` with URL password encoding (`quote_plus`).
  - Utilizes `SQLDatabaseToolkit` to provide the LLM with schema inspection and query generation tools.
  - Exposes the **`query_sqldb`** tool to convert natural language queries (e.g. "How many departments are present?") into SQL queries, execute them safely against the database, and return formatted answers.

### 3.4. Real-Time Web Search Tool

- **File**: [`src/agent_graph/tool_tavily_search.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/agent_graph/tool_tavily_search.py)
- **Functionality**:
  - Configures **Tavily Search API** to fetch up-to-date real-time web results for queries outside vector DB or SQL domain coverage.

### 3.5. Web UI & Frontend Interface

- **Files**: [`src/app.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/app.py), [`src/utils/ui_settings.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/utils/ui_settings.py)
- **Functionality**:
  - Provides a web chat application built with **Gradio (`gr.Blocks`)**.
  - Features a styled chat window with custom avatars, clear button, text submit triggers, and feedback like/dislike callbacks.

### 3.6. Memory Tracking & Logging

- **Files**: [`src/chatbot/memory.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/chatbot/memory.py), [`src/chatbot/chatbot_backend.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/chatbot/chatbot_backend.py)
- **Functionality**:
  - Tracks user prompts, bot responses, session `thread_id`, and timestamps.
  - Automatically writes and appends daily chat transcripts to CSV log files (`memory/YYYY-MM-DD.csv`).

### 3.7. Configuration Management

- **Files**: [`configs/tools_config.yml`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/configs/tools_config.yml), [`configs/project_config.yml`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/configs/project_config.yml), [`src/agent_graph/load_tools_config.py`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/src/agent_graph/load_tools_config.py), [`.env`](file:///d:/WorkStation/Python/Agentic-AI/RAG_LLM_SQL/.env)
- **Functionality**:
  - Centralizes vector DB paths, chunk settings, model parameters, top-k retrieval bounds, search limits, and session IDs in YAML files.
  - Secret credentials (Groq API, Tavily API, PostgreSQL host/user/password/database) are securely loaded via `.env` environment variables.

---

## 4. Technology Stack & Key Dependencies

| Layer                          | Component                    | Technology / Library                                                                                 |
| :----------------------------- | :--------------------------- | :--------------------------------------------------------------------------------------------------- |
| **Orchestration**        | Graph State Machine          | `langgraph` (StateGraph, MemorySaver)                                                              |
| **LLM Provider**         | Inference Backend            | Groq (`openai/gpt-oss-120b`) via `langchain_groq`                                                |
| **RAG / Vector Store**   | Vector Database & Embeddings | ChromaDB (`langchain_chroma`), HuggingFace Embeddings (`sentence-transformers/all-MiniLM-L6-v2`) |
| **Database Integration** | Relational Database Engine   | PostgreSQL via SQLAlchemy (`postgresql+psycopg2`) & `SQLDatabaseToolkit`                         |
| **External Tools**       | Web Search API               | Tavily Search (`langchain_tavily`)                                                                 |
| **User Interface**       | Web Application Framework    | Gradio (`gradio`)                                                                                  |
| **Configuration & Data** | Environment & File Storage   | PyYAML, Pandas, PyPDFLoader,`python-dotenv`, `pyprojroot`                                        |

---

## 5. End-to-End Data & Query Flow

1. **User Request**: The user submits a query through the Gradio frontend (`src/app.py`).
2. **ChatBot Delegation**: `ChatBot.respond()` forwards the query state with thread configuration to the compiled LangGraph instance.
3. **LLM Evaluation**: The system prompt and message history are passed to `ChatGroq`. The model determines whether to call a tool or directly answer.
4. **Tool Execution**:
   - **Policy Question**: Invokes `lookup_swiss_airline_policy` -> ChromaDB similarity search -> Returns document text snippets.
   - **Stories Query**: Invokes `lookup_stories` -> ChromaDB similarity search -> Returns story passages.
   - **Database Query**: Invokes `query_sqldb` -> Agentic SQL Toolkit -> Generates SQL query -> Executes on PostgreSQL -> Returns formatted SQL output.
   - **General Search**: Invokes `load_tavily_search_tool` -> Fetches web search results.
5. **Synthesis & Response**: The LLM synthesizes tool outputs into a natural language response.
6. **Logging & Persistence**: Memory module logs `(thread_id, timestamp, user_query, response)` into a daily CSV file in `memory/`.
7. **Display**: Gradio UI updates the conversation log for the user.

---

## 6. Directory Structure Summary

```
RAG_LLM_SQL/
│
├── .env                              # Environment secrets (API keys, DB credentials)
├── configs/
│   ├── project_config.yml            # Project level settings (tracing, memory dir)
│   └── tools_config.yml              # Detailed tool parameters (RAG, SQL, Tavily, Graph)
├── data/
│   ├── airline_policy_vectordb/      # ChromaDB storage for Swiss Airline policies
│   ├── stories_vectordb/             # ChromaDB storage for fictional stories
│   └── unstructured_docs/            # Source PDF files for RAG ingestion
├── memory/                           # Daily CSV log files (created at runtime)
├── NL-SQL/                           # Standalone SQL agent sandbox scripts
│   ├── agent_toolkit.py
│   ├── postgres_connection.py
│   └── sql_agent.py
└── src/
    ├── app.py                        # Gradio Web UI entry point
    ├── prepare_vector_db.py          # Vector database creation script
    ├── agent_graph/
    │   ├── agent_backend.py          # Custom ToolNode & State definitions
    │   ├── builld_full_graph.py       # LangGraph graph builder & compiler
    │   ├── load_tools_config.py      # Config YAML loader class
    │   ├── tool_lookup_policy_rag.py # Swiss Airline policy RAG tool
    │   ├── tool_stories_rag.py       # Stories RAG tool
    │   ├── tool_postgres_sqlagent.py # PostgreSQL NL-SQL query tool
    │   └── tool_tavily_search.py     # Tavily web search tool
    ├── chatbot/
    │   ├── chatbot_backend.py        # Stream handler & graph connection
    │   ├── load_config.py            # Project config loader
    │   └── memory.py                 # Chat history CSV persistence
    └── utils/
        ├── app_utils.py              # Directory helper utilities
        └── ui_settings.py            # Gradio UI settings & feedback handlers
```
