# Smart PDF Chat AI

<p align="center">

AI-powered PDF Question Answering System built using React, FastAPI, Ollama, Qdrant and LangChain.

</p>

---

## Overview

Smart PDF Chat AI is a Retrieval-Augmented Generation (RAG) application that allows users to upload PDF documents and ask natural language questions about their contents.

Instead of answering from general knowledge, the application retrieves relevant information from the uploaded document and generates context-aware responses using a locally running Large Language Model.

All AI processing happens locally using Ollama, making the application private, secure, and cost-effective.

---

## Features

- Upload PDF documents
- AI-powered document question answering
- Local LLM using Ollama
- Vector search using Qdrant
- Nomic Embeddings
- Fast semantic retrieval
- Markdown formatted AI responses
- Light & Dark Mode
- Responsive React UI
- FastAPI backend
- REST API architecture
- Source-aware document retrieval
- Fully local AI (No OpenAI API required)

---

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Markdown
- Lucide React

### Backend

- FastAPI
- Python
- LangChain
- PyPDF

### AI

- Ollama
- Qwen 3.5
- Nomic Embed Text

### Vector Database

- Qdrant

---

# Project Architecture

```

                PDF Upload
                     │
                     ▼
              PDF Text Extraction
                     │
                     ▼
             Text Chunking
                     │
                     ▼
          Nomic Embeddings
                     │
                     ▼
              Qdrant Vector DB
                     │
                     ▼
        Semantic Similarity Search
                     │
                     ▼
             Qwen 3.5 (Ollama)
                     │
                     ▼
              AI Generated Answer

```

---

## Folder Structure

```

Smart-PDF-Chat/

│

├── backend/

│ ├── app/

│ ├── routers/

│ ├── services/

│ ├── models/

│ ├── utils/

│ └── main.py

│

├── frontend/

│ ├── src/

│ ├── components/

│ ├── hooks/

│ ├── App.jsx

│ └── main.jsx

│

├── README.md

└── .gitignore

```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/omkumar-chavan/Smart-PDF-Chat.git
```

```
cd Smart-PDF-Chat
```

---

## Backend Setup

```
cd backend
```

Create Virtual Environment

```bash
python -m venv .venv
```

Activate Virtual Environment

Windows

```bash
.venv\Scripts\activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Backend

```bash
uvicorn app.main:app --reload
```

---

## Frontend Setup

```
cd frontend
```

Install Packages

```bash
npm install
```

Run Frontend

```bash
npm run dev
```

---

## Ollama Setup

Install Ollama

https://ollama.com

Download Models

```bash
ollama pull qwen3.5:4b
```

```bash
ollama pull nomic-embed-text
```

Start Ollama

```bash
ollama serve
```

---

## Qdrant

Run using Docker

```bash
docker run -p 6333:6333 qdrant/qdrant
```

---

## API Endpoints

### Upload PDF

```
POST /pdf/upload
```

### Ask Question

```
POST /chat/
```

---

## Screenshots

### Home Page

> Add Screenshot Here

---

### Upload PDF

> Add Screenshot Here

---

### AI Chat

> Add Screenshot Here

---

### Dark Mode

> Add Screenshot Here

---

## Future Improvements

- Multiple PDF Support
- Streaming AI Responses
- Chat History
- Source Highlighting
- Authentication
- Cloud Deployment
- Conversation Memory
- Model Selection
- Drag & Drop Upload
- Export Chat
- PDF Preview

---

## Why This Project?

This project demonstrates practical implementation of Retrieval-Augmented Generation (RAG) using modern AI technologies. It combines semantic search, vector databases, local LLM inference, and an intuitive frontend to build a privacy-focused document assistant.

---

## Author

**Omkumar Chavan**

B.Tech Artificial Intelligence & Data Science

K.K. Wagh Institute of Engineering Education and Research

GitHub

https://github.com/omkumar-chavan

---

## License

This project is licensed under the MIT License.

---

## Star this Repository

If you found this project useful, consider giving it a ⭐ on GitHub.
