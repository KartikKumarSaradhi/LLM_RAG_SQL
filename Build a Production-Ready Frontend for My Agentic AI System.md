# Build a Production-Ready Frontend for My Agentic AI System

I have an existing Python-based Agentic AI backend called **RAG_LLM_SQL**. I want you to build a polished, modern, production-ready frontend for it that I can deploy on **Render**.

## 1. First: Understand the Existing Architecture

Before writing frontend code, inspect the existing project and understand how the backend works.

The existing backend is based on:

- Python
- LangGraph / LangChain
- Groq LLM
- ChromaDB
- PostgreSQL
- Tavily Web Search
- Gradio (currently used as the UI)

The LangGraph agent dynamically decides which tool to use based on the user's question.

Current agent capabilities:

1. **Swiss Airline Policy RAG**
   - Tool: `lookup_swiss_airline_policy`
   - Searches the Swiss Airline policy vector database.

2. **Stories RAG**
   - Tool: `lookup_stories`
   - Searches the fictional stories vector database.

3. **Natural Language → SQL**
   - Tool: `query_sqldb`
   - Converts natural-language questions into SQL.
   - Executes the query against PostgreSQL.
   - Returns the result.

4. **Real-Time Web Search**
   - Tavily Search.
   - Used when current web information is required.

5. **Conversation Memory**
   - LangGraph `MemorySaver`
   - Session/thread based conversation state.
   - Existing backend also logs conversations to daily CSV files.

Do NOT rewrite or replace the existing LangGraph agent unless absolutely necessary.

The frontend must sit cleanly on top of the existing agent.

---

# 2. Main Goal

Create a **premium AI assistant web application** that feels like a modern production AI product rather than a basic Gradio interface.

The application should have:

- Modern responsive UI
- AI chat interface
- Conversation history
- New conversation functionality
- Streaming assistant responses if the backend supports it
- Markdown rendering
- Code block rendering
- Tables
- Tool execution indicators
- Source/result cards
- Error states
- Loading states
- Mobile responsiveness
- Dark/light theme support
- Clean animations
- Professional typography
- Accessible components

The UI should communicate that this is an **Agentic AI system**, not just a chatbot.

---

# 3. Recommended Technology Stack

Use:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui or an equivalent high-quality component system
- Lucide icons
- React Markdown
- Syntax highlighting for code
- TanStack Query where useful
- Fetch/Axios for API communication

Do NOT introduce unnecessary libraries.

Keep the application lightweight and easy to deploy on Render.

---

# 4. Visual Design

Design the application like a modern AI developer/productivity platform.

Avoid:

- Generic Bootstrap-looking UI
- Excessive gradients
- Huge colorful hero sections
- Clutter
- Excessive rounded cards
- Fake AI animations
- Unnecessary dashboards
- Stock images

Use a clean professional interface with:

- Strong typography
- Subtle borders
- Good spacing
- Minimal shadows
- Elegant dark mode
- Subtle animations
- Excellent information hierarchy

The interface should look credible enough to be shown in:

- Resume projects
- LinkedIn posts
- Technical interviews
- Portfolio
- Job applications

---

# 5. Application Layout

Create the following structure.

## Left Sidebar

The sidebar should contain:

### Branding

Display:

**Agentic AI**

Subtitle:

**RAG • SQL • Web Search**

Use a simple professional AI/agent icon.

### New Chat

Prominent button:

`+ New Conversation`

### Conversation History

Display previous conversations grouped by:

- Today
- Yesterday
- Previous 7 Days
- Older

Each conversation should have:

- Conversation title
- Timestamp
- More menu

Allow:

- Open conversation
- Rename conversation
- Delete conversation

If the current backend does not expose persistent conversation history through an API, design the frontend so this feature can be connected later without restructuring the UI.

### Sidebar Footer

Include:

- Settings
- About
- Backend/API status

---

# 6. Main Chat Area

The main content area should contain:

## Header

Show:

**Agentic AI Assistant**

Small status indicator:

`● Online`

Also display:

`LangGraph Agent`

Optional model/tool information in a subtle dropdown or badge.

---

# 7. Welcome Screen

When there are no messages, show a professional welcome screen.

Example:

**What can I help you investigate?**

Subtitle:

**Ask questions across your knowledge bases, database, or the live web.**

Then show capability cards.

### Card 1 — Policy Intelligence

Icon: document/search

Description:

`Search Swiss Airline policy documents using RAG.`

Example:

`What is the baggage allowance?`

### Card 2 — Knowledge Retrieval

Icon: database/book

Description:

`Retrieve information from the story knowledge base.`

Example:

`What happened to the main character?`

### Card 3 — Database Intelligence

Icon: database/chart

Description:

`Ask questions about PostgreSQL using natural language.`

Example:

`How many departments are present?`

### Card 4 — Live Web

Icon: globe/search

Description:

`Search the live web for current information.`

Example:

`What are the latest developments in AI?`

Clicking an example should populate the chat input.

---

# 8. Chat Messages

User messages:

- Right aligned
- Visually distinct
- Compact
- Clear timestamp if appropriate

Assistant messages:

- Left aligned
- AI icon/avatar
- Markdown support
- Code blocks
- Tables
- Lists
- Links
- Copy button
- Regenerate button where possible

Do NOT make assistant messages giant cards.

Use a clean ChatGPT/Claude-style conversation layout.

---

# 9. Agent Tool Execution UI

This is one of the most important parts.

Because the backend is an **agentic system**, the frontend should visually communicate when the agent is using tools.

For example:

### While processing:

`Thinking...`

Then:

`Searching Swiss Airline policies...`

or:

`Querying PostgreSQL...`

or:

`Searching the web...`

or:

`Retrieving from knowledge base...`

After completion, collapse the activity into something like:

**Agent activity**
✓ Swiss Airline Policy RAG

or

**Agent activity**
✓ PostgreSQL SQL Agent

or

**Agent activity**
✓ Tavily Web Search

The user should NOT see raw internal LangGraph implementation details.

Do not expose chain-of-thought or private reasoning.

Only expose safe high-level tool activity/status.

---

# 10. RAG Source Cards

When the backend returns document/source metadata, display it elegantly.

Example:

**Sources**

`Swiss Airline Policy`

`Section: Baggage`

`Relevant document passage...`

Include:

- Document name
- Section/page if available
- Relevance information if available
- Expand/collapse

Do not fabricate source information.

Only display metadata actually returned by the backend.

---

# 11. Web Search Results

When Tavily is used and the backend returns web sources, display a collapsible:

**Web Sources**

Each source should show:

- Title
- Domain
- Short snippet
- Open link

Example:

`OpenAI announces ...`

`openai.com`

`Short description...`

Use safe external links.

Do not expose Tavily API keys.

---

# 12. SQL Result Presentation

This is extremely important.

When the NL-SQL agent returns structured/tabular data, do not display everything as plain text.

Create a beautiful SQL result component.

Example:

**Query Result**

| Department | Employees |
|------------|-----------|
| Engineering | 42 |
| HR | 12 |
| Finance | 18 |

Features:

- Responsive table
- Horizontal scrolling
- Column alignment
- Copy table
- Optional JSON/raw result view

If SQL text is returned by the backend, show it inside a collapsible:

**Generated SQL**

with syntax highlighting.

Do not automatically expose database credentials or sensitive connection information.

---

# 13. Chat Input

Create a large professional input area at the bottom.

Features:

- Auto-growing textarea
- Send button
- Enter = send
- Shift + Enter = newline
- Disabled state while appropriate
- Stop generation button if streaming exists
- Character handling
- Clear input

Placeholder:

`Ask anything about policies, stories, your database, or the web...`

Also support example prompts.

---

# 14. Agent Capability Indicator

Near the input, show subtle indicators such as:

`RAG`

`SQL`

`WEB`

These should NOT force a tool unless the backend explicitly supports tool selection.

They are primarily informational.

If the backend eventually supports explicit tool selection, structure the frontend so these can become selectable modes.

---

# 15. Backend API Architecture

Do not hardcode the backend URL.

Use an environment variable such as:

`VITE_API_BASE_URL`

Example:

Development:

`http://localhost:8000`

Production:

`https://your-backend.onrender.com`

Create a clean API client layer.

For example:

`src/services/api.ts`

or equivalent.

Keep all backend communication isolated from UI components.

---

# 16. Expected API Contract

First inspect the existing Python backend and determine what endpoints currently exist.

If an HTTP API does not exist, create the **minimum FastAPI wrapper** around the existing chatbot backend.

Do NOT rewrite the agent.

Expose clean endpoints such as:

### Health

`GET /health`

Response:

```json
{
  "status": "ok"
}
```

### Chat

`POST /api/chat`

Request:

```json
{
  "message": "How many departments are present?",
  "thread_id": "unique-session-id"
}
```

Response should ideally contain structured information such as:

```json
{
  "thread_id": "unique-session-id",
  "answer": "There are 8 departments.",
  "tool": "sql",
  "sources": [],
  "sql": "...",
  "data": []
}
```

The exact response schema MUST be adapted to the existing Python implementation.

Do not invent backend functionality that doesn't exist.

If streaming is feasible with the current architecture, implement:

`POST /api/chat/stream`

using SSE or another appropriate streaming mechanism.

If streaming requires substantial backend changes, first build a clean non-streaming API and structure the frontend so streaming can be added later.

---

# 17. Thread / Session Management

The backend already uses thread/session concepts.

The frontend must generate and persist a client session/thread ID.

For example:

```text
thread_id
```

Persist the current thread ID using appropriate browser storage.

Every request should send the relevant thread ID to the backend.

When the user clicks:

`New Conversation`

generate a new thread ID.

Do not accidentally mix conversations.

---

# 18. Error Handling

Create excellent error states.

Examples:

### Backend unavailable

`Unable to connect to the AI backend.`

Button:

`Retry`

### Agent error

`The agent could not complete this request.`

Provide:

`Try again`

### SQL error

Display a user-friendly message.

Do NOT expose:

- Database passwords
- Connection strings
- Internal stack traces
- Environment variables

Developer details can be logged to the backend only.

---

# 19. Backend Status

Create:

`GET /health`

and use it to display:

`● Backend Online`

or

`● Backend Unavailable`

Do not pretend the system is online.

The frontend must reflect the real health response.

---

# 20. Settings Panel

Create a lightweight settings modal.

Include:

- Theme: System / Light / Dark
- Backend status
- Current session/thread ID
- Clear current conversation
- About this system

About section:

**Agentic AI System**

Capabilities:

- Retrieval-Augmented Generation
- Natural Language SQL
- Real-Time Web Search
- Stateful Agentic Conversations

Technology:

- LangGraph
- LangChain
- Groq
- ChromaDB
- PostgreSQL
- Tavily

---

# 21. Responsive Design

The application MUST work properly on:

- Desktop
- Laptop
- Tablet
- Mobile

On mobile:

- Sidebar becomes a drawer
- Chat occupies full width
- Input remains accessible
- Tables become horizontally scrollable
- Source cards remain readable

Do not simply shrink the desktop UI.

Create a proper responsive layout.

---

# 22. Accessibility

Implement:

- Keyboard navigation
- Proper button labels
- ARIA labels where appropriate
- Visible focus states
- Good contrast
- Screen-reader-friendly structure

---

# 23. Security

NEVER put these in the frontend:

- Groq API key
- Tavily API key
- PostgreSQL credentials
- `.env` secrets
- Database connection strings

All secrets must remain on the backend.

The frontend only communicates with the backend API.

Configure CORS correctly on the backend for the deployed frontend.

---

# 24. Render Deployment

Make the frontend deployable to Render.

Use a production build:

```bash
npm run build
```

The final project should include appropriate Render deployment configuration if useful.

For a static frontend:

Build command:

```bash
npm install && npm run build
```

Publish directory:

```text
dist
```

If a backend API wrapper is required, keep it deployable as a separate Render Web Service.

Recommended architecture:

```text
                 ┌──────────────────────┐
                 │      User Browser    │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ React + TypeScript   │
                 │ Frontend on Render   │
                 └──────────┬───────────┘
                            │ HTTPS
                            ▼
                 ┌──────────────────────┐
                 │ FastAPI Backend      │
                 │ Python / Render      │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ LangGraph Agent      │
                 └───────┬──┬──┬───────┘
                         │  │  │
                ┌────────┘  │  └─────────┐
                ▼           ▼            ▼
             ChromaDB   PostgreSQL     Tavily
                │
                ▼
             Groq LLM
```

---

# 25. Important: Do Not Fake Functionality

The frontend must reflect the actual backend.

Do NOT create fake:

- AI responses
- SQL results
- Search results
- RAG sources
- Tool execution
- Agent reasoning
- Conversation history

If a backend capability does not currently expose enough information for the UI, create a clean API response structure or clearly mark the UI capability as future-ready.

---

# 26. Developer Experience

Organize the project professionally.

Suggested structure:

```text
frontend/
│
├── src/
│   ├── components/
│   │   ├── chat/
│   │   ├── sidebar/
│   │   ├── sources/
│   │   ├── sql/
│   │   ├── agent/
│   │   └── common/
│   │
│   ├── pages/
│   ├── services/
│   │   └── api.ts
│   │
│   ├── hooks/
│   ├── types/
│   ├── lib/
│   ├── store/
│   ├── App.tsx
│   └── main.tsx
│
├── public/
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

Adapt this structure if the existing repository has a better organization.

---

# 27. Type Safety

Create TypeScript interfaces for:

- ChatMessage
- ChatRequest
- ChatResponse
- ToolActivity
- Source
- WebSource
- SQLResult
- Conversation
- AgentStatus

Avoid `any` unless absolutely necessary.

---

# 28. Loading / Agent Animation

Create subtle agent activity animations.

Example:

```text
● Thinking
```

then:

```text
● Searching knowledge base
```

then:

```text
● Synthesizing response
```

These are status indicators only.

Never expose hidden chain-of-thought.

---

# 29. Empty State Examples

Include useful example prompts:

**Policy**

`What is the baggage policy for Swiss Airlines?`

**Stories**

`Tell me what happened to the main character.`

**SQL**

`How many departments are present?`

**Web**

`What are the latest developments in AI?`

Clicking an example should put the text into the input.

---

# 30. Polish Requirements

Before considering the implementation complete:

- Remove all console errors.
- Remove unnecessary dependencies.
- Test all responsive breakpoints.
- Test API failure states.
- Test empty responses.
- Test long responses.
- Test Markdown.
- Test SQL tables.
- Test source cards.
- Test conversation switching.
- Test new conversation.
- Test backend offline state.
- Test Render production build.

The final UI should feel like a **real SaaS/AI product**, not a prototype.

---

# 31. Very Important Workflow

Follow this workflow:

### Step 1
Inspect the existing Python project.

### Step 2
Understand the current chatbot/backend entry points.

### Step 3
Determine whether an HTTP API already exists.

### Step 4
If needed, create a minimal FastAPI API layer around the existing agent.

### Step 5
Define a clean typed API contract.

### Step 6
Build the React frontend.

### Step 7
Connect the frontend to the actual backend.

### Step 8
Test the complete flow:

User:

`How many departments are present?`

↓

Frontend

↓

FastAPI

↓

LangGraph

↓

SQL Agent

↓

PostgreSQL

↓

LangGraph synthesis

↓

FastAPI response

↓

Frontend SQL/result presentation

### Step 9
Test a RAG query.

### Step 10
Test a web-search query.

### Step 11
Test conversation continuity using `thread_id`.

### Step 12
Prepare Render deployment.

---

# 32. Final Deliverables

At the end, provide:

1. Complete frontend source code.
2. Any minimal backend API changes required.
3. `.env.example`.
4. Render deployment instructions.
5. API documentation.
6. README.
7. Explanation of how frontend → API → LangGraph → tools works.
8. List of environment variables required.
9. Local development commands.
10. Production deployment commands.

Most importantly:

**Do not replace the existing Agentic AI architecture.**

Build a professional frontend around it.

The final result should make the project visually impressive while accurately representing the existing:

**LangGraph + RAG + NL-SQL + Web Search + Memory architecture.**