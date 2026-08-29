import os
from pyprojroot import here
from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.tools import tool
from agent_graph.load_tools_config import LoadToolsConfig

TOOLS_CFG = LoadToolsConfig()
USER_VECTORDB_BASE = str(here("data/user_vectordb"))
USER_UPLOADS_BASE = str(here("data/user_uploads"))


def process_and_embed_user_document(file_bytes: bytes, filename: str, thread_id: str) -> dict:
    """
    Saves an uploaded user file, parses its contents, splits into chunks,
    and stores vector embeddings in a thread-specific ChromaDB vector store.
    """
    upload_dir = os.path.join(USER_UPLOADS_BASE, thread_id)
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, filename)
    with open(file_path, "wb") as f:
        f.write(file_bytes)

    # Load document based on file type
    if filename.lower().endswith(".pdf"):
        loader = PyPDFLoader(file_path)
        docs = loader.load_and_split()
    else:
        loader = TextLoader(file_path, encoding="utf-8")
        docs = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=500,
        chunk_overlap=100
    )
    doc_splits = text_splitter.split_documents(docs)

    vectordb_dir = os.path.join(USER_VECTORDB_BASE, thread_id)
    os.makedirs(vectordb_dir, exist_ok=True)

    collection_name = f"user-doc-{thread_id}"
    embedding_model = TOOLS_CFG.policy_rag_embedding_model

    # Store vectors in thread-specific ChromaDB
    vectordb = Chroma.from_documents(
        documents=doc_splits,
        collection_name=collection_name,
        embedding=HuggingFaceEmbeddings(model=embedding_model),
        persist_directory=vectordb_dir
    )

    return {
        "status": "success",
        "filename": filename,
        "chunks": len(doc_splits),
        "total_vectors": vectordb._collection.count()
    }


@tool
def lookup_user_document(query: str) -> str:
    """
    Consult this tool to search information from documents uploaded directly by the user.
    Input should be the user query string.
    """
    # Look for any created user document vector DBs
    if not os.path.exists(USER_VECTORDB_BASE):
        return "No custom user documents have been uploaded yet."

    thread_dirs = os.listdir(USER_VECTORDB_BASE)
    if not thread_dirs:
        return "No custom user documents have been uploaded yet."

    all_passages = []
    embedding_model = TOOLS_CFG.policy_rag_embedding_model

    for t_id in thread_dirs:
        v_dir = os.path.join(USER_VECTORDB_BASE, t_id)
        if os.path.isdir(v_dir):
            try:
                vectordb = Chroma(
                    collection_name=f"user-doc-{t_id}",
                    persist_directory=v_dir,
                    embedding_function=HuggingFaceEmbeddings(model=embedding_model)
                )
                docs = vectordb.similarity_search(query, k=3)
                for d in docs:
                    all_passages.append(d.page_content)
            except Exception as e:
                print(f"Error querying user doc vector DB for {t_id}: {e}")

    if not all_passages:
        return "No matching information found in the uploaded user documents."

    return "\n\n".join(all_passages)
