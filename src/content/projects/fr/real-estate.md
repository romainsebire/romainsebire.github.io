---
title: "Prédiction de Prix Immobiliers : Text Mining & Régression"
tagline: "LightGBM · Optuna · NLP basique · Pandas"
summary: "Estimation du prix de vente de biens immobiliers au Brésil en combinant l'analyse des caractéristiques du logement avec l'extraction automatique d'équipements depuis le texte des annonces."
category: "ml"
domains: ["regression", "data-engineering"]
stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "LightGBM", "XGBoost", "Optuna"]
github: "https://github.com/romainsebire/projects-ufrj/blob/main/notebooks/en/Notebook_realEstate_en.ipynb"
featured: false
order: 11
date: "Juillet 2025"
cover: "/images/projects/real-estate/cover.webp"
environment: "Local CPU (Kaggle)"
---

Ce projet vise à prédire le prix de vente de biens immobiliers à partir de leurs caractéristiques physiques (surface, chambres) et de leurs prestations (piscine, salle de sport, etc.). Le défi principal résidait dans le traitement d'une variable textuelle libre décrivant les atouts du bien, ainsi que dans la gestion de prix extrêmes. En combinant une extraction astucieuse de mots-clés, un filtrage statistique strict et une optimisation bayésienne des hyperparamètres via Optuna, le modèle LightGBM final a atteint un score RMSPE de 0.2527 sur la plateforme Kaggle.

## Contexte

Ce travail constitue le second et dernier projet d'évaluation de l'UE Machine Learning du Professeur Heraldo Luis Silveira de Almeida à l'UFRJ (Brésil). Organisé sous la forme d'une compétition Kaggle In-Class, l'objectif était de confronter les étudiants à des problématiques classiques de régression sur des données bruitées et hétérogènes (numériques, catégorielles et textuelles).

## Données

* **Volume** : 4 683 exemples d'entraînement et 2 000 de test, avec 21 variables (quartier, type de vendeur, nombre de chambres, surface, etc.).
* **Qualité de base** : Aucune valeur manquante n'était présente dans le jeu de données.
* **Le Bruit** : L'analyse des distributions a révélé des valeurs extrêmes sur la variable cible (le prix), avec des montants très hauts (ultra luxe) ou très bas, risquant de fausser complètement l'apprentissage du modèle.

![Analyse de la distribution des surfaces habitables.](/images/projects/real-estate/area-distribution.webp)

## Méthodologie

Le succès de ce projet repose sur la transformation d'informations non structurées en signaux mathématiques forts, divisée en trois étapes clés :

### Phase A : Traitement des Valeurs Extrêmes
Puisque la métrique d'évaluation pénalise fortement les grands écarts de prédiction (RMSPE), un nettoyage de la variable cible était critique. Nous avons appliqué la méthode de l'Écart Interquartile (IQR avec un facteur strict de 1.55) pour tronquer les prix extrêmes, stabilisant ainsi la fonction de perte du modèle.

![Distribution statistique des prix de l'immobilier avant et après filtrage IQR.](/images/projects/real-estate/price-distribution.webp)

### Phase B : Text Mining sur la variable \"Diferenciais\"
Les annonces possédaient une colonne de texte libre (`diferenciais`) contenant des mots-clés séparés par des virgules (ex: "sauna, piscine, sécurité").
* **Audit croisé** : En comptant les occurrences de mots dans ce texte et en les comparant aux colonnes booléennes déjà existantes, nous avons prouvé que certaines info étaient redondantes.
* **Création de valeur** : Nous avons extrait 8 nouvelles caractéristiques inédites de ce texte (ex: terrain de football, terrain de squash, vestiaire, hydromassage) qui n'existaient pas dans les données tabulaires de base.

### Phase C : Feature Engineering Additionnel & Multicolinéarité
* **Création de variables métiers combinées** : `area_total` (surface utile + surface extra) et `area_por_quarto` (surface moyenne par chambre).
* **Le test de la redondance** : Intuitivement, on pourrait vouloir supprimer les variables redondantes (multicolinéarité) pour alléger le modèle. Cependant, les modèles basés sur les arbres gèrent nativement très bien la colinéarité. La suppression de colonnes ne modifiant pas les performances, le principe de précaution nous a poussés à conserver toutes les variables encodées.

## Résultats

Trois algorithmes de Gradient Boosting ont été comparés en validation croisée (Random Forest, XGBoost, LightGBM). LightGBM s'est avéré le plus performant (RMSPE de base à ~0.2379).

Pour extraire les derniers pourcentages de performance, nous avons remplacé les recherches classiques (GridSearch) par une optimisation bayésienne via Optuna.

![Importance des caractéristiques déterminée par le modèle LightGBM.](/images/projects/real-estate/feature-importance.webp)

| Modèle | Score RMSPE (Validation) | Score Kaggle |
| :--- | :---: | :---: |
| Random Forest | 0.2493 | - |
| XGBoost | 0.2432 | - |
| LightGBM | 0.2379 | - |
| **LightGBM + Optuna** | **0.2372** | **0.2527** |
