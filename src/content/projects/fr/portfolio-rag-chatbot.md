---
title: "Assistant RAG Sécurisé du Portfolio"
tagline: "RAG · LangGraph · FastMCP · Groq · Pinecone"
summary: "Conception et déploiement de l'assistant conversationnel de ce portfolio, capable de répondre aux questions sur mon parcours et mes projets à partir d'une base vectorielle sécurisée."
category: "dl"
domains: ["llm", "cybersecurity", "software-engineering"]
stack: ["RAG", "LangGraph", "FastMCP", "FastAPI", "Pinecone", "Groq", "Python", "Render", "GitHub Actions"]
github: "https://github.com/romainsebire/portfolio-chatbot-backend"
featured: true
order: 1
date: "Septembre 2026"
cover: "/images/projects/portfolio-rag-chatbot/cover.webp"
video: "https://github.com/user-attachments/assets/ede303cc-b0dd-43df-91cc-097b38015ae0"
environment: "Backend API : FastAPI sur Render Free Tier\nBase Vectorielle : Pinecone Starter\nModèle d'Embedding : Pinecone Inference API (multilingual-e5-large)\nInférence LLM : Groq API (Qwen 3.8 27B / GPT-OSS 120B / GPT-OSS 20B)\nCI/CD : GitHub Actions & Webhook Render"
---

Ce projet présente le développement et la mise en production de l'assistant conversationnel intégré à ce portfolio. Conçu pour répondre clairement aux questions des visiteurs et recruteurs sur mon parcours et mes projets, il repose sur une architecture agentique RAG fonctionnant intégralement sur des services cloud gratuits, tout en intégrant des mécanismes de sécurité, de tolérance aux pannes et de contrôle de la qualité des réponses.

## Contexte

Ce chatbot a été pensé comme une mise en pratique concrète de compétences en ingénierie logicielle et en IA appliquée. L'objectif était de concevoir un agent autonome complet confronté aux vraies contraintes de production : gestion stricte des quotas d'API, continuité de service en cas de panne d'un modèle, isolation des sessions utilisateurs et protection de l'API publique, le tout sans serveur payant permanent.

## Architecture Cloud et Contraintes

Le principal défi technique consistait à offrir des réponses rapides et fiables tout en respectant les limites des offres cloud gratuites :

* **Render (API FastAPI)** : Hébergement du backend Python dans une enveloppe mémoire limitée à 512 Mo de RAM, avec mise en veille automatique après inactivité et suivi du redémarrage à froid côté interface web.
* **Pinecone et Pinecone Inference** : Stockage serverless de la base de connaissances et calcul des vecteurs à distance via `multilingual-e5-large`, ce qui évite de charger un modèle lourd dans la mémoire du serveur.
* **Cascade de modèles Groq** : Inférence rapide répartie sur plusieurs modèles gratuits organisés en cascade (`Qwen 3.8 27B`, `GPT-OSS 120B`, `GPT-OSS 20B`). Un mécanisme de coupe-circuit en mémoire met temporairement de côté un modèle en cas de saturation ou d'erreur pour basculer automatiquement sur le suivant.

## Méthodologie et Pipeline Agentique

### 1. Découpage sémantique en 3 blocs
Plutôt que d'envoyer des pages entières au modèle, chaque projet du portfolio est structuré dans la base en trois blocs complémentaires (`Contexte et stack`, `Méthodologie`, `Résultats`), chacun préfixé par son titre de section afin de fiabiliser la recherche sémantique.

### 2. Outil de recherche via le protocole MCP
Un serveur **FastMCP** expose la recherche vectorielle Pinecone sous forme d'outil standardisé connecté à l'agent. Lorsqu'une question porte sur un projet, l'agent récupère en un seul appel les trois blocs associés afin de disposer de toute l'information pertinente sans avoir à deviner la bonne sous-section.

### 3. Agent en deux passes (LangGraph)
L'assistant fonctionne selon un graphe en deux étapes distinctes :
* **Passe 1 (Routage)** : L'agent analyse la demande dans la langue du visiteur, répond directement aux salutations ou aux demandes hors périmètre, et déclenche la recherche documentaire uniquement lorsque c'est nécessaire.
* **Passe 2 (Synthèse)** : Une fois les extraits récupérés, le modèle génère la réponse finale sans outils attachés, ce qui évite les appels en boucle, avec une consigne de brièveté pour rester clair et accessible à tout type de lecteur.

## Sécurité et Robustesse

L'exposition publique d'une API reliée à un LLM impose plusieurs niveaux de protection :
* **Protection contre les abus** : Limitation du débit par adresse IP à la minute et plafond quotidien de tokens pour préserver les quotas gratuits.
* **Contrôle des entrées et des sorties** : Validation stricte de la longueur des messages, filtrage des tentatives de détournement de prompt et nettoyage des réponses pour bloquer les injections XSS.
* **Confidentialité et CI/CD** : Isolation des conversations par jeton de session unique, journalisation anonymisée par hachage sans données personnelles en clair, et pipeline GitHub Actions exécutant tests unitaires et audits de sécurité avant chaque déploiement.

## Évaluation et Résultats

Pour comparer objectivement les modèles gratuits et affiner le découpage des documents, une suite d'évaluation dédiée a été mise en place. Sur la recherche vectorielle, le préfixage des sections permet d'atteindre **100 % de rappel dans les 3 premiers résultats**. Sur le pipeline complet, un jeu de **23 questions pérennes** (questions simples, questions techniques sur les projets, suivi multi-tours et cas pièges de sécurité ou de confidentialité) évalue chaque modèle à l'aide de vérifications automatiques et d'un juge LLM fixe (`GPT-OSS 120B`).

| Modèle évalué | Vérifications réussies | Note globale (Juge) | Sécurité |
| :--- | :---: | :---: | :---: |
| **Qwen 3.8 27B** | **91,3 %** | **8,6 / 10** | **10 / 10** |
| GPT-OSS 120B | 87,0 % | 8,1 / 10 | 10 / 10 |
| GPT-OSS 20B | 82,6 % | 8,0 / 10 | 10 / 10 |

Cette évaluation a conduit à placer **Qwen 3.8 27B** en tête de la cascade pour la clarté de ses synthèses et son respect des garde-fous, tout en conservant **GPT-OSS 120B** et **GPT-OSS 20B** en secours pour garantir la disponibilité du service. Elle a également permis de corriger des cas concrets en production, comme le blocage des boucles d'appels d'outils en Passe 2 et le respect de la langue du visiteur dès la Passe 1.
