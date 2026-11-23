---
title: "Système d'Aide à la Décision : Prédiction du Risque de Crédit"
tagline: "LightGBM · XGBoost · RandomizedSearchCV"
summary: "Développement d'un modèle de classification pour évaluer le risque de défaut de paiement de demandeurs de crédit à partir de leur profil socio-économique et de leur historique bancaire."
category: "ml"
domains: ["classification", "data-engineering"]
stack: ["Python", "Pandas", "Scikit-learn", "LightGBM", "XGBoost", "RandomForest", "RandomizedSearchCV"]
github: "https://github.com/romainsebire/projects-ufrj/blob/main/notebooks/en/Notebook_creditApproval_en.ipynb"
featured: false
order: 10
date: "Juillet 2025"
cover: "/images/projects/credit/cover.webp"
environment: "Local CPU (Jupyter Notebook)"
---

Ce projet vise à construire un modèle de classification pour prédire si un demandeur de crédit fera défaut sur ses paiements, à partir de ses données démographiques et financières. Le défi technique résidait dans le traitement d'une base de données contenant beaucoup de bruit (variables constantes, erreurs d'extraction). En appliquant une sélection de caractéristiques et en optimisant un modèle, nous avons atteint une précision de 0.5996 sur le dataset d'évaluation.

## Contexte

Ce travail a été réalisé au Brésil (UFRJ) et constitue le premier des deux projets d'évaluation de l'UE Machine Learning dispensée par le Professeur Heraldo Luis Silveira de Almeida. Il a pris la forme d'une compétition Kaggle In-Class, confrontant les étudiants sur leurs capacités à nettoyer les données et à optimiser des algorithmes de classification.

## Données

* **Volume** : 20 000 exemples d'entraînement et 5 000 de test, décrits par 42 caractéristiques initiales (âge, revenu, statut, nombre de comptes bancaires, etc.).
* **La Cible** : Une variable binaire indiquant si le client est un bon payeur ou un mauvais payeur. La cible était parfaitement équilibrée (50/50), évitant le recours à des techniques d'oversampling.
* **Analyse Exploratoire** : L'analyse des distributions a révélé de nombreuses anomalies dans la collecte des données. De multiples colonnes étaient entièrement remplies de zéros, de "1" ou de "N", les rendant totalement inutiles d'un point de vue prédictif.

## Méthodologie

L'approche s'est voulue itérative, en testant de multiples hypothèses pour ne conserver que les plus robustes.

### Phase A : Sélection des Caractéristiques
Au lieu de garder les 42 variables aveuglément, une première itération rapide avec LightGBM a permis de calculer l'importance des variables. En croisant ces résultats avec l'analyse exploratoire, les 10 variables les moins utiles et les plus corrompues ont été purement et simplement supprimées de la base.

![Importance relative des variables déterminée par le modèle LightGBM, 10 plus importantes.](/images/projects/credit/top-features.webp)
![Importance relative des variables déterminée par le modèle LightGBM, 10 moins importantes.](/images/projects/credit/bottom-features.webp)

### Phase B : Prétraitement et Pipeline
* **Imputation des valeurs manquantes** : Après avoir testé plusieurs stratégies (valeur la plus fréquente, moyenne, etc.), l'imputation par la médiane s'est révélée être la plus performante.
* **Encodage** : Application d'un One-Hot Encoding sur les variables catégorielles. Bien que théoriquement facultative pour les algorithmes à base d'arbres, une normalisation (Standard Scaler) a été appliquée, améliorant empiriquement les scores en validation croisée.

### Phase C : Benchmark
Les données ont été séparées (80% Train / 20% Validation) pour comparer trois algorithmes majeurs : Random Forest, XGBoost et LightGBM. Le LightGBM s'est immédiatement détaché du lot en termes d'efficacité et de précision.

![Distribution des scores de crédit pour plusieurs modèles.](/images/projects/credit/score-distribution.webp)

### Phase D : Optimisation
L'intérêt de ce projet réside dans l'étendue des expérimentations menées :
* **Les échecs** : La création massive de nouvelles variables (Feature Engineering complexe), l'utilisation d'Optuna, et les méthodes d'ensembles (Stacking/Voting incluant RF et XGBoost) ont toutes fait chuter le score. Le LightGBM étant supérieur, le forcer à "voter" avec des modèles moins bons dégradait ses performances.
* **La solution retenue** : Une recherche d'hyperparamètres maîtrisée via RandomizedSearchCV sur le LightGBM seul.

## Résultats

Le modèle final généré a été soumis sur la plateforme Kaggle pour le classement de la classe.

| Modèle Utilisé | Stratégie Adoptée | Accuracy (Validation) | Accuracy (Leaderboard Kaggle) |
| :--- | :--- | :--- | :--- |
| Random Forest | Baseline brute | 0.5782 | - |
| XGBoost | Baseline brute | 0.5896 | - |
| LightGBM | Baseline brute | 0.5964 | - |
| LightGBM | Stacking / Voting (avec RF/XGB) | Baisse de perf. | - |
| **LightGBM** | **Pruning + RandomSearchCV** | **~0.60** | **0.5996** |

**Leçon Apprise** : Un nettoyage méticuleux des données associé à un algorithme puissant (LightGBM) bien calibré est souvent bien plus robuste et performant que d'empiler des couches de complexité algorithmique inutiles.
