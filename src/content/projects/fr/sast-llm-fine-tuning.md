---
title: "Construction d'un Dataset Cybersécurité & Fine-Tuning d'un LLM SAST"
tagline: "LLM finetuning · LoRA · MCP · vLLM"
summary: "Création d'un jeu de données de vulnérabilités et spécialisation d'un modèle de langage open-source chez Orange pour auditer la sécurité du code source en interne."
category: "dl"
domains: ["llm", "cybersecurity"]
stack: ["LoRA", "Qwen", "Serena MCP", "LSP", "Tree-sitter", "vLLM", "Hugging Face", "PyTorch", "GCP"]
cta:
  url: "/assets/Recommandation_Orange_Romain_Sebire.pdf"
  label: "Voir la recommandation"
  icon: "medal"
featured: true
order: 0
date: "Mars – Sept. 2026"
cover: "/images/projects/sast-llm-fine-tuning/cover.webp"
environment: "Distillation CoT : API Claude Haiku 4.5 & Sonnet 4.6\nEntraînement LoRA : GCP GPU NVIDIA H100 (80 Go)\nInférence & Déploiement : Serveur vLLM (API REST)"
---

Ce projet vise à concevoir un modèle souverain d'audit de sécurité de code source (Static Application Security Testing). En s'appuyant sur un pipeline d'extraction et de distillation de connaissances, un jeu de données de haute qualité de plus de 11 700 échantillons de code vulnérable et sécurisé a été constitué. Un modèle open-source (Qwen 3.6 27B) a ensuite été fine-tuné en LoRA sur ce dataset, offrant une solution locale qui protège la confidentialité du code sensible tout en maîtrisant les coûts.

## Contexte

Ce travail a été réalisé dans le cadre de mon stage de fin d'études de 6 mois chez Orange, au sein de l'équipe sécurité DEFY.

Face aux cyberattaques de plus en plus fréquentes et sophistiquées, l'utilisation de l'IA pour l'audit de code s'est imposée pour dépasser les limites des approches actuelles :
* **Outils SAST classiques** : Basés sur des règles fixes et de la recherche de motifs, ils ne comprennent pas le contexte métier de l'application et génèrent énormément de faux positifs que les pentesters doivent trier manuellement.
* **Modèles propriétaires et API tierces** : L'équipe a conçu un outil SAST basé sur des agents interrogeant des grands modèles propriétaires via API. Bien que performante, cette approche pose des problèmes de coûts à grande échelle, de dépendance technologique et de souveraineté, car il est impossible d'envoyer le code source d'applications internes critiques sur des serveurs externes.

L'objectif de ma mission était donc de développer une alternative souveraine et déployable en interne : construire un dataset de cybersécurité orienté langages web, spécialiser un modèle open-source, le déployer derrière une API et évaluer l'apport de cet entraînement.

## Données

La constitution d'un dataset d'entraînement de qualité représentait le premier grand défi, car les bases publiques ne contiennent pas directement le code exploitable.

* **Bases de vulnérabilités publiques** : Collecte et consolidation des métadonnées issues du NVD (National Vulnerability Database) et de la base OSV de Google (incluant GitHub Security Advisories) en ciblant les technologies web (PHP, Java, Go, JavaScript, TypeScript, Python, Ruby).
* **Absence de code source** : Une fiche CVE ne fournit qu'une brève description de la faille, sa catégorie (CWE), sa sévérité (CVSS) et un lien vers le commit de correction sur le dépôt Git, sans inclure directement les portions de code concernées.

## Méthodologie

Le pipeline a été structuré en cinq étapes, allant de l'extraction ciblée du code jusqu'au déploiement et à l'évaluation du modèle.

### 1. Extraction du code source à l'échelle de la méthode
Extraire des fichiers entiers depuis les commits de correction saturerait la fenêtre de contexte du LLM avec du code hors-sujet. Un pipeline d'extraction sur-mesure a donc été développé pour reconstruire uniquement le flux complet de la donnée, du point d'entrée jusqu'à la faille :
* **Tree-sitter** : Génère les arbres de syntaxe abstraite (AST) pour isoler la méthode touchée par la faille ainsi que les sous-fonctions qu'elle appelle.
* **Serveurs LSP et Serena MCP** : Déploie un serveur de langage sur le dépôt cloné pour remonter la pile d'appels et identifier les fonctions appelantes jusqu'aux points d'entrée publics de l'application.
* **Code vulnérable et code sain** : Pour éviter que le modèle ne lève des alertes systématiques, chaque CVE permet d'extraire deux échantillons : la version vulnérable sur le commit parent et la version corrigée sur le commit de patch.

### 2. Distillation de connaissances et Chain-of-Thought
Les descriptions publiques des CVE étant trop succinctes et hétérogènes pour entraîner un modèle à raisonner, une phase de distillation de connaissances a été mise en place :
* **Génération des analyses** : Un modèle professeur analyse le code vulnérable et son correctif pour rédiger un raisonnement détaillé (Chain-of-Thought) expliquant le flux de données compromis ou l'efficacité du mécanisme de protection.
* **Routage par score de confiance** : L'analyse est d'abord confiée à Claude Haiku 4.5, qui évalue sa propre confiance. Pour les cas complexes où ce score est insuffisant, l'analyse est relancée avec Claude Sonnet 4.6, réduisant fortement les coûts d'API tout en garantissant la qualité des explications.
* **Alignement du format** : Les raisonnements générés ont été moulés dans la structure de réflexion native du modèle Qwen 3.6 pour ne pas perturber ses acquis de pré-entraînement.

![Interface de visualisation d'un échantillon du dataset (paire vulnérable / patchée) avec analyse CoT et verdict du pipeline de qualité](/images/projects/sast-llm-fine-tuning/dataset-sample.webp)

### 3. Filtrage du bruit
Pour garantir la qualité d'apprentissage, plusieurs filtres successifs ont écarté le bruit : suppression des commits ne touchant que des fichiers de tests ou de documentation, rejet des méthodes de longueur extrême, élimination des analyses dont le score de confiance restait trop faible et calibrage au tokenizer pour respecter la fenêtre de 4 096 tokens. Au terme de ce tri, le dataset final rassemble 11 726 échantillons équilibrés (51 % vulnérables et 49 % sécurisés) couvrant 341 familles de failles (CWE).

### 4. Fine-Tuning LoRA et déploiement vLLM
* **Sélection du modèle** : Le choix s'est porté sur Qwen 3.6 27B (version dense), qui surpasse sa variante Mixture of Experts sur les benchmarks de code et d'analyse logique.
* **Entraînement LoRA en BF16** : L'entraînement a été réalisé sur un GPU NVIDIA H100 (80 Go de VRAM) sur GCP. Cette capacité mémoire a permis de charger le modèle nativement en précision BF16 sans recourir à une quantification destructrice, et d'entraîner uniquement les adaptateurs LoRA (0,9 % des paramètres) avec un masquage de la perte sur le contexte d'entrée.
* **Ingénierie du prompt** : Le prompt système a été structuré pour obliger le modèle à identifier et lister toutes les protections présentes dans le code avant de chercher les vulnérabilités, limitant ainsi les fausses alertes.
* **Fusion et serveur d'inférence** : Une fois l'entraînement terminé, les adaptateurs LoRA ont été fusionnés aux poids de base et le modèle unifié a été déployé via vLLM derrière une API REST.

## Résultats

Pour mesurer l'apport réel de la spécialisation, le modèle fine-tuné a été comparé au modèle de base Qwen 3.6 27B sur un jeu de test isolé de 300 échantillons réels (150 vulnérables et 150 sains). Une approche LLM-as-a-Judge a permis de vérifier la justesse de l'explication fournie par rapport à la vérité terrain.

| Métrique d'évaluation | Modèle de base | Modèle fine-tuné (LoRA) | Évolution |
| :--- | :---: | :---: | :---: |
| Détection des failles réelles (Rappel) | 48,7 % | 61,3 % | + 12,7 % |
| Identification des protections | 86,7 % | 85,3 % | - 1,3 % |
| Code sain validé sans fausse alerte | 22,0 % | 28,7 % | + 6,7 % |
| Score global de détection | 67,7 % | 73,3 % | + 5,7 % |

* **Apport de la spécialisation** : Le fine-tuning améliore de près de 13 % la capacité du modèle à détecter et expliquer les vulnérabilités réelles en traçant correctement les flux de données.
* **Limites et perspectives** : Bien que la précision progresse, le taux de faux positifs en une seule passe reste encore élevé pour un modèle de 27 milliards de paramètres. Ces travaux ont permis d'orienter la suite du projet vers deux axes : le passage à un modèle open-source de plus grande taille et l'utilisation d'une architecture multi-agents en deux passes, où un second agent investigateur explore le dépôt pour vérifier le contexte manquant et filtrer les fausses alertes.
