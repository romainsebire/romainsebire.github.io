---
title: "Secure Portfolio RAG Assistant"
tagline: "RAG · LangGraph · FastMCP · Groq · Pinecone"
summary: "Designed and deployed the conversational assistant for this portfolio to answer questions about my background and projects using a secure vector knowledge base."
category: "dl"
domains: ["llm", "cybersecurity", "software-engineering"]
stack: ["RAG", "LangGraph", "FastMCP", "FastAPI", "Pinecone", "Groq", "Python", "Render", "GitHub Actions"]
github: "https://github.com/romainsebire/portfolio-chatbot-backend"
featured: true
order: 1
date: "September 2026"
cover: "/images/projects/portfolio-rag-chatbot/cover.webp"
video: "https://github.com/user-attachments/assets/ca02c0df-eca4-4e33-b990-d49da78bfd32"
environment: "Backend API: FastAPI on Render Free Tier\nVector Database: Pinecone Starter\nEmbedding Model: Pinecone Inference API (multilingual-e5-large)\nLLM Inference: Groq API (Qwen 3.8 27B / GPT-OSS 120B / GPT-OSS 20B)\nCI/CD: GitHub Actions & Render Webhook"
---

This project presents the development and production deployment of the conversational assistant integrated into this portfolio. Built to clearly answer visitor and recruiter questions about my background and projects, it relies on an agentic RAG architecture running entirely on free cloud services while incorporating security safeguards, fault tolerance, and response quality monitoring.

## Context

This chatbot was designed as a hands-on demonstration of applied AI and software engineering skills. The goal was to build a complete autonomous agent operating under real production constraints: strict API quota management, automatic failover when a model becomes unavailable, user session isolation, and public API protection, without relying on paid hosting.

## Cloud Architecture and Constraints

The main engineering challenge was delivering responsive, reliable answers while staying within free-tier cloud limits:

* **Render (FastAPI API)**: Hosts the Python backend within a 512 MB RAM ceiling, with automatic sleep after inactivity and cold-start progress tracking on the web interface.
* **Pinecone and Pinecone Inference**: Serverless storage of the knowledge base and remote embedding generation via `multilingual-e5-large`, avoiding heavy model loading in backend memory.
* **Groq Model Cascade**: Fast inference across multiple free models arranged in a fallback cascade (`Qwen 3.8 27B`, `GPT-OSS 120B`, `GPT-OSS 20B`). An in-memory circuit breaker temporarily quarantines any model hitting a rate limit or error and routes requests to the next model automatically.

## Methodology and Agentic Pipeline

### 1. Semantic Splitting into 3 Blocks
Rather than sending full pages to the language model, each portfolio project is indexed as three complementary blocks (`Context and stack`, `Methodology`, `Results`), each prefixed with its section title to make semantic retrieval more reliable.

### 2. Retrieval Tool via MCP
A **FastMCP** server exposes Pinecone vector search as a standardized tool connected to the agent. When a visitor asks about a project, the agent retrieves all three corresponding blocks in a single call so it has complete context without guessing which subsection holds the answer.

### 3. Two-Pass Agent (LangGraph)
The assistant runs as a two-stage graph:
* **Pass 1 (Routing)**: The agent analyzes the request in the visitor's language, replies directly to simple greetings or out-of-scope queries, and triggers document retrieval only when needed.
* **Pass 2 (Synthesis)**: Once the relevant context is retrieved, the model generates the final answer without tools bound, preventing tool-call loops, and follows brevity instructions so explanations remain clear and accessible.

## Security and Robustness

Exposing a public LLM endpoint requires layered safeguards:
* **Abuse Protection**: Per-IP request rate limiting and a daily token cap to protect free-tier quotas.
* **Input and Output Validation**: Strict message length limits, prompt injection filtering, and output sanitization to prevent XSS attacks.
* **Privacy and CI/CD**: Unique session tokens to isolate conversations, hashed logging without storing raw personal data, and a GitHub Actions pipeline running automated tests and security audits before each deployment.

## Evaluation and Results

To objectively compare free-tier models and refine document chunking, a dedicated evaluation suite was built. On vector retrieval, section-title prefixing brings recall within the top 3 results to **100%**. End-to-end, a set of **23 perennial questions** covering simple queries, technical project questions, multi-turn follow-ups, and guardrails (off-topic queries, privacy, prompt injection) grades each model using deterministic checks and a fixed LLM judge (`GPT-OSS 120B`).

| Evaluated Model | Deterministic Checks | Overall Score (Judge) | Safety |
| :--- | :---: | :---: | :---: |
| **Qwen 3.8 27B** | **91.3%** | **8.6 / 10** | **10 / 10** |
| GPT-OSS 120B | 87.0% | 8.1 / 10 | 10 / 10 |
| GPT-OSS 20B | 82.6% | 8.0 / 10 | 10 / 10 |

This benchmark confirmed placing **Qwen 3.8 27B** first in the cascade for the clarity of its summaries and adherence to guardrails, backed by **GPT-OSS 120B** and **GPT-OSS 20B** for continuous availability. It also surfaced and resolved concrete edge cases, such as preventing tool loops in Pass 2 and enforcing language matching from Pass 1.
