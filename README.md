# Romain Sebire: Personal Portfolio

> **Bilingual AI & Data Engineering portfolio built with Astro, TypeScript, and React, featuring 16 technical case studies and an interactive RAG assistant**

[![Live Site](https://img.shields.io/badge/Live%20Site-romainsebire.fr-blue)](https://romainsebire.fr)
[![Astro](https://img.shields.io/badge/Astro-SSG-FF5D01)](https://astro.build/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://react.dev/)
[![RAG Backend](https://img.shields.io/badge/RAG%20Backend-FastAPI%20%26%20MCP-009688)](https://github.com/romainsebire/portfolio-chatbot-backend)

---

## Overview

This repository hosts the production source of [romainsebire.fr](https://romainsebire.fr). It presents 16 projects across Computer Vision, Reinforcement Learning, Cybersecurity, LLM Fine-Tuning, Optimization, and Time Series Forecasting, alongside bilingual downloadable resumes and an interactive AI assistant.

---

## Architecture & Tech Stack

### Frontend
* **Framework**: Astro (Static Site Generation) for fast loading and clean SEO
* **Components & Logic**: TypeScript, React 18, Vanilla CSS
* **Internationalization (i18n)**: Native French and English routes for every page and project
* **Performance & Analytics**: WebP media optimization, OpenGraph metadata, and Umami Analytics

### AI Assistant Backend
* **Repository**: [portfolio-chatbot-backend](https://github.com/romainsebire/portfolio-chatbot-backend) (FastAPI, LangGraph, FastMCP, Pinecone)
* **Details & Benchmarks**: For the current model lineup, architecture diagram, and evaluation results, see the dedicated [Portfolio RAG Chatbot project page](https://romainsebire.fr/en/projects/portfolio-rag-chatbot)

---

## Key Features

* **Responsive, Clean Interface**: Thoughtful layout tailored for desktop and mobile reading across all case studies.
* **Interactive RAG Assistant**: Answers visitor questions about projects, skills, and experience in French or English, with graceful cold-start handling.
* **Bilingual Resumes**: Built-in French and English resume pages with direct PDF downloads.

---

## Local Development

**Requirements:** Node.js 18+

```bash
git clone https://github.com/romainsebire/romainsebire.github.io.git
cd romainsebire.github.io
npm install
npm run dev
```

To generate the production static build:

```bash
npm run build
```

---

## Links

* **Website**: [romainsebire.fr](https://romainsebire.fr)
* **LinkedIn**: [linkedin.com/in/romain-sebire](https://linkedin.com/in/romain-sebire)
* **Email**: [romain.sebire1@gmail.com](mailto:romain.sebire1@gmail.com)

---

© 2026 Romain Sebire. All rights reserved.
