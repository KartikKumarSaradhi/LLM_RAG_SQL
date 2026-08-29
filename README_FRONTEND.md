# Production Frontend & API Layer for RAG_LLM_SQL Agentic AI

This repository contains a modern, production-grade **React + TypeScript + Vite + Tailwind CSS** web application frontend and a **FastAPI** backend REST API service wrapping the **LangGraph Agentic AI backend**.

---

## 🌟 Features & Highlights

- **Multi-Tool Agentic Interface**: Dynamically displays tool execution indicators (`✓ PostgreSQL SQL Agent`, `✓ Swiss Airline Policy RAG`, `✓ Tavily Web Search`).
- **Interactive SQL Presentation**: Formatted data tables with column alignment, copy functionality, and collapsible generated SQL blocks.
- **RAG & Web Source Cards**: Formatted passage cards for vector search results and external clickable web link cards for Tavily search.
- **Persistent Conversation Memory**: Client-side session thread management with sidebar history grouping (Today, Yesterday, Previous 7 Days).
- **Responsive & Dark Mode**: Sleek developer-first dark mode with mobile drawer navigation and glassmorphism UI components.
- **Render Deployment Ready**: Preconfigured with `render.yaml` for 1-click cloud deployment.

---

## 🏗️ Architecture Overview

```
                      ┌──────────────────────────┐
                      │    User Browser / UI     │
                      │  (React + TypeScript)    │
                      └────────────┬─────────────┘
                                   │ HTTP API
                                   ▼
                      ┌──────────────────────────┐
                      │     FastAPI Backend      │
                      │       (src/api.py)       │
                      └────────────┬─────────────┘
                                   │
                                   ▼
                      ┌──────────────────────────┐
                      │     LangGraph Agent      │
                      │ (builld_full_graph.py)   │
                      └───────┬────┬────┬────────┘
                              │    │    │
            ┌─────────────────┘    │    └──────────────────┐
            ▼                      ▼                       ▼
     ChromaDB Vector        PostgreSQL DB             Tavily Web
   (Policy & Stories)       (NL-SQL Agent)            (Live Search)
            │
            ▼
        Groq LLM
```

---

## 🚀 Quick Start (Local Development)

### 1. Backend Service (FastAPI)

Ensure virtual environment dependencies are installed:

```bash
# From workspace root directory
pip install -r requirements.txt
```

Launch the FastAPI backend server:

```bash
uvicorn src.api:app --host 0.0.0.0 --port 8000 --reload
```

The backend server will run at: `http://localhost:8000`
Swagger API documentation available at: `http://localhost:8000/docs`

---

### 2. Frontend Web Application

Navigate to the `frontend/` directory and install dependencies:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open your browser at: `http://localhost:5173`

---

## 🔌 API Contract Specifications

### Health Check
- **`GET /health`**
- **Response**:
  ```json
  {
    "status": "ok",
    "service": "Agentic AI RAG-SQL-Web Backend",
    "version": "1.0.0"
  }
  ```

### Chat Endpoint
- **`POST /api/chat`**
- **Request Body**:
  ```json
  {
    "message": "How many departments are present in department table?",
    "thread_id": "thread-1724912300"
  }
  ```
- **Response Payload**:
  ```json
  {
    "thread_id": "thread-1724912300",
    "answer": "There are 8 departments present in the department table.",
    "tool_used": "sql",
    "tool_activities": [
      {
        "tool": "query_sqldb",
        "label": "PostgreSQL SQL Agent",
        "status": "completed"
      }
    ],
    "sql_query": "SELECT COUNT(*) FROM department;",
    "sql_data": [
      { "count": 8 }
    ],
    "rag_sources": [],
    "web_sources": []
  }
  ```

---

## ☁️ Deployment on Render

This project includes a `render.yaml` blueprint file for easy deployment on Render:

1. Connect your GitHub repository to **Render**.
2. Click **New +** -> **Blueprint**.
3. Render will auto-detect `render.yaml` and provision:
   - **Backend Web Service**: Python FastAPI service running `uvicorn src.api:app --host 0.0.0.0 --port $PORT`.
   - **Frontend Static Site**: React app compiled via `npm run build` publishing `frontend/dist`.
4. Configure environment variables in the Render dashboard:
   - `GROQ_API_KEY`
   - `TAVILY_API_KEY`
   - `HUGGINGFACEHUB_API_TOKEN`
   - `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DATABASE`, `POSTGRES_PORT`

---

## 🔑 Required Environment Variables (.env)

Create or update your `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
TAVILY_API_KEY=your_tavily_api_key
HUGGINGFACEHUB_API_TOKEN=your_huggingface_token

POSTGRES_HOST=localhost
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_PORT=5432
POSTGRES_DATABASE=MainDB
```
