---
title: "Classification du Risque d'Obésité par Machine Learning"
tagline: "XGBoost · GridSearchCV · Feature Engineering"
summary: "Classification du niveau de risque d'obésité de patients à partir de leurs habitudes alimentaires et de leur mode de vie grâce à la création d'indicateurs cliniques et au gradient boosting."
category: "ml"
domains: ["classification", "data-engineering"]
stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "XGBoost", "GridSearchCV"]
github: "https://github.com/romainsebire/projects-ufrj/blob/main/notebooks/en/Notebook_obesityRisk_en.ipynb"
featured: false
order: 12
date: "Mai 2025"
cover: "/images/projects/obesity/cover.webp"
environment: "Jupyter Notebook (Local CPU)"
---

Ce projet a pour objectif de classifier des individus dans 7 catégories de risque d'obésité (allant de Poids Insuffisant à Obésité de Type III) en se basant sur 17 variables physiques et comportementales. Face à un problème de classification multiclasse, nous avons mis en place un benchmark comparant pics d'algorithmes d'apprentissage (du KNN au XGBoost). L'insight majeur du projet a été de démontrer que l'ingénierie d'une caractéristique métier simple (le calcul de l'Indice de Masse Corporelle) améliorait drastiquement les performances du meilleur modèle (XGBoost), permettant d'atteindre une accuracy (précision) de 0.90715 sur le jeu de test.

## Contexte

Ce travail ouvre la série de projets réalisés lors de mon échange universitaire à l'UFRJ (Brésil), pour l'UE Data Mining du Professeur Geraldo Zimbrão. Il s'appuie sur une compétition hébergée sur la plateforme Kaggle (Obesity Risk Classification). L'enjeu était d'appliquer une méthodologie stricte de modélisation prédictive sur des données de santé publique : de l'analyse exploratoire (EDA) jusqu'à l'optimisation fine des hyperparamètres.

## Données

* **Qualité des données** : Le dataset fourni était exceptionnellement propre, ne comportant aucune valeur manquante ni dans le jeu d'entraînement, ni dans le jeu de test.
* **Les Variables** : 17 caractéristiques mêlant données numériques et catégorielles.
  * **Critères physiques** : Âge, Taille, Poids, Sexe, Antécédents familiaux.
  * **Habitudes alimentaires** : Fréquence de consommation de légumes (FCVC), nombre de repas (NCP), consommation d'eau (CH2O), consommation d'aliments caloriques (FAVC).
  * **Habitudes de vie** : Fréquence d'activité physique (FAF), temps passé sur les écrans (TUE), mode de transport principal (MTRANS).
* **La Cible** : `NObeyesdad`, une variable discrète divisée en 7 classes déséquilibrées (la classe Obesity_Type_III étant légèrement surreprésentée dans le jeu d'entraînement).

## Méthodologie

Le pipeline s'est articulé autour d'une démarche d'entonnoir : explorer, comparer, puis optimiser.

### Phase A : Analyse Exploratoire (EDA)
L'analyse des corrélations a immédiatement révélé que la variable Poids (Weight) était fortement prédictive. Cependant, d'un point de vue clinique, le poids seul ne définit pas l'obésité sans être mis en relation avec la taille.

### Phase B : Feature Engineering
Ajout d'une nouvelle variable synthétique : l'IMC (Indice de Masse Corporelle), calculé mathématiquement à partir de la taille et du poids. Une fois injectée dans les modèles, l'analyse de l'importance des features a révélé que l'IMC s'est instantanément classé comme la variable prédictive numéro 1, devant toutes les autres habitudes de vie.

![Distribution de l'Indice de Masse Corporelle (IMC) selon les classes cibles.](/images/projects/obesity/bmi-distribution.webp)

### Phase C : Benchmark des Modèles de Classification
Après encodage des variables catégorielles et normalisation, 5 algorithmes ont été comparés en validation croisée :
* KNN (K-Nearest Neighbors) : 0.7625
* Régression Logistique : 0.8603
* SVM (Support Vector Machine) : 0.8617
* Random Forest : 0.8985
* **XGBoost** : **0.9023** (Vainqueur)

### Phase D : Optimisation des Hyperparamètres
Le modèle XGBoost a été affiné via une recherche d'hyperparamètres pour maximiser la généralisation et éviter le surapprentissage.
* **Meilleurs paramètres trouvés** : `learning_rate` (0.1), `max_depth` (5), `n_estimators` (200), `subsample` (0.7), `colsample_bytree` (0.7).
* **Accuracy après optimisation** : 0.9070.

![Importance des caractéristiques mesurée par le modèle XGBoost.](/images/projects/obesity/feature-importance.webp)

## Résultats

L'entraînement final a été réalisé sur 100 % des données d'entraînement disponibles avant de soumettre les prédictions sur Kaggle.

| Modèle | Ajout Métier | Score Public Kaggle | Score Privé Kaggle |
| :--- | :--- | :--- | :--- |
|KNN | Baseline | 0.7625 | - |
|LogisticRegression | Baseline | 0.8603 | - |
|SVM | Baseline | 0.8617 | - |
|RandomForest | Baseline | 0.8985 | - |
| **XGBoost Optimisé** | **+ Feature IMC** | **0.91257** | **0.90715** |

**Leçon Apprise** : Ce projet démontre qu'en Data Science, la compréhension du problème prime sur la force brute des algorithmes. Transformer de simples colonnes de taille et de poids en un indicateur clinique (IMC) a été le levier d'amélioration le plus puissant de tout le pipeline.
