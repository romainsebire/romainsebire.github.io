---
title: "Prédiction de Performances Industrielles (Hackathon Airbus)"
tagline: "Data Engineering · Chained LightGBM · MLP"
summary: "Développement d'un modèle prédictif hybride combinant arbres de décision et réseau de neurones pour estimer en temps réel les indicateurs de production d'une chaîne d'assemblage d'hélicoptères."
category: "ml"
domains: ["regression", "data-engineering"]
stack: ["Pandas", "Scikit-learn", "LightGBM", "CatBoost", "PyTorch"]
github: "https://github.com/romainsebire/airbus-hackathon"
featured: true
order: 3
date: "Décembre 2025"
cover: "/images/projects/airbus/cover.webp"
environment: "Local CPU (boosting) & GPU NVIDIA T4 (MLP)"
---

Dans l'industrie aérospatiale, configurer une chaîne d'assemblage pour garantir la satisfaction client tout en maîtrisant les coûts est un défi majeur. Les logiciels de simulation traditionnels permettent de tester des scénarios, mais leurs temps de calcul sont prohibitifs. Ce projet, réalisé lors d'un hackathon inter-écoles, proposait de remplacer ces simulateurs par une IA prédictive. En domptant un jeu de données de très haute dimension (plus de 7500 variables) et en hybridant deux approches radicalement différentes (une chaîne de régression sous LightGBM et un MLP), nous avons construit un modèle capable de prédire l'impact d'une configuration industrielle en quelques millisecondes avec une excellente robustesse.

## Contexte

Ce hackathon, organisé conjointement pour l'ISAE-SUPAERO et IMT Mines Alès, s'inscrit directement dans les thématiques de recherche menées par Maryam Saadi (doctorante à l'IMT Mines Alès avec Airbus Helicopters) qui a fournit les données et le sujet.

* **Le problème** : L'évaluation d'un plan de production via un simulateur à événements discrets (ex: AnyLogic) est beaucoup trop lente pour une prise de décision agile.
* **La mission** : Developper un modèle d'IA de substitution (Surrogate Model) capable de prédire simultanément trois indicateurs de performance (KPI) : le volume d'en-cours (Work in Progress), les Investissements nécessaires, et la Satisfaction Client.
* **L'évaluation** : Si les trois KPI devaient être prédits pour comprendre la dynamique de l'usine, seule la Satisfaction Client (probabilité que l'erreur de prédiction soit inférieure à 0.05) était retenue pour le score final du classement.

## Données

Le jeu de données fourni présentait des obstacles majeurs pour les algorithmes d'apprentissage classiques :
* **Haute Dimensionnalité vs Petit Échantillon** : Plus de 7590 colonnes (features) pour un nombre limité d'exemples d'entraînement, créant un risque critique de surapprentissage (overfitting).
* **Hétérogénéité des données** : 7540 séries temporelles très creuses (sparse) représentant la Demande, combinées à 50 paramètres de configuration d'atelier très denses.
* **Déséquilibre des Gradients** : Les variables cibles n'étaient pas à la même échelle. Le WIP oscillait au-dessus de 10^7, l'Investissement autour de 10^5, et la Satisfaction entre 0 et 1. Sans traitement, le WIP aurait totalement écrasé la fonction de perte (loss function) du modèle.

## Méthodologie

Avant de modéliser, un lourd travail de nettoyage a été effectué : suppression de 1485 colonnes constantes, mise à l'échelle des cibles, et analyse de l'importance des variables. Ensuite, pour contourner la complexité du problème, nous avons développé deux approches distinctes :

### Approche A : Chaîne de Régresseurs
Au lieu de prédire les 3 KPI d'un coup, nous avons exploité leur lien de causalité industriel via une architecture en cascade : \
**Étape 1** : Un modèle prédit le WIP à partir des données brutes. \
**Étape 2** : Un second modèle prédit l'Investissement à partir des données brutes + la prédiction du WIP. \
**Étape 3** : Le modèle final prédit la Satisfaction Client en utilisant tout le contexte (données + WIP + Investissement). 

* **Algorithmes évalués** : XGBoost, CatBoost, et LightGBM.
* **Feature Selection** : La dimensionnalité a été drastiquement réduite en calculant l'importance des variables pour chaque KPI et chaque modèle, générant un dataset spécialisé et allégé (ex: 1764 features retenues pour LGBM).

### Approche B : Deep Learning (MLP)
Pour capturer des relations différentes des arbres de décision, nous avons conçu un réseau de neurones (MLP de 6.5M de paramètres) spécifiquement pensé pour ce problème :
* **Architecture à double entrée** : Deux réseaux distincts traitent séparément les features "Demande" (creuses) et les features "Paramètres" (denses), avant de concaténer leurs représentations (embeddings) pour la prédiction finale.
* **Custom Loss** : Pour forcer le réseau à se concentrer sur l'objectif du hackathon, nous avons créé une fonction WMAE (Weighted Mean Absolute Error) pondérant la Satisfaction à 3, contre 1 pour les autres KPI. À cela s'est ajouté un système de pénalité binaire pour toute erreur supérieure au seuil fatidique de 0.05.

## Résultats

* **Performances** : L'approche par chaîne de régression avec LightGBM s'est avérée être notre meilleur modèle unique (Score de 0.83). Le réseau de neurones (MLP) a plafonné autour de 0.81, validant la supériorité des modèles à base d'arbres (Tree-based) sur les données tabulaires.
* **Association des modèles** : Pour obtenir notre meilleur score final sur le classement privé, nous avons réalisé une moyenne pondérée des prédictions du LightGBM et du MLP.
* **Bilan final** : Notre équipe a remporté la 1ère place du classement général final (sur 15 équipes participantes).
