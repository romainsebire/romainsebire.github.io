---
title: "Prévision des Ventes de Supermarchés par Séries Temporelles"
tagline: "LightGBM · RandomForest · Time Series"
summary: "Prévision des ventes quotidiennes d'une chaîne de supermarchés équatorienne en croisant l'historique des transactions avec le cours du pétrole, les jours fériés et le calendrier des salaires."
category: "ml"
domains: ["time-series", "regression", "data-engineering"]
stack: ["Python", "Pandas", "LightGBM", "XGBoost", "RandomForest", "Scikit-learn"]
github: "https://github.com/romainsebire/projects-ufrj/blob/main/notebooks/en/Notebook_forecasting_en.ipynb"
featured: false
order: 9
date: "Mai – Juin 2025"
cover: "/images/projects/sales-forecasting/cover.webp"
environment: "Notebook local (CPU)"
---

Ce projet vise à prédire les ventes unitaires quotidiennes pour des milliers de références réparties dans les 54 magasins de l'enseigne Corporación Favorita (Équateur). Le défi central réside dans l'intégration harmonieuse de signaux externes hétérogènes (variations du prix du pétrole, séismes régionaux, jours fériés, jours de paie) pour améliorer les prévisions. Grâce à une démarche d'enrichissement itératif des caractéristiques, le modèle a atteint un score RMSLE de 0.69857 en évaluation.

## Contexte

Ce travail a été réalisé lors de mon échange universitaire à l'UFRJ (Brésil), dans le cadre de l'UE Data Mining enseignée par M. Geraldo Zimbrão. L'enjeu industriel est critique : une prédiction précise de la demande permet de limiter les ruptures de stock tout en évitant le gaspillage de produits périssables.

## Données

Pour capturer toute la complexité de la demande, le pipeline fusionne 6 sources de données distinctes :
* **Données Cibles** : Historique des ventes unitaires et des promotions de janvier 2013 à juillet 2017 (pour 54 magasins et 33 familles de produits).
* **Données Économiques (Pétrole)** : L'économie équatorienne étant fortement dépendante du pétrole brut, son cours quotidien a un impact direct sur le pouvoir d'achat. Le dataset présentait 28.5 % de valeurs manquantes (dont les week-ends), corrigées par interpolation linéaire.
* **Données Calendaires (Fériés)** : Base de données complexes des jours fériés (locaux, régionaux, nationaux) et des événements majeurs (ex: impact du séisme d'avril 2016).
* **Données Sociales (Paies)** : Les fonctionnaires étant payés le 15 et le dernier jour du mois, ces dates génèrent des pics de consommation qu'il a fallu modéliser.

![Tendances des ventes mensuelles historiques.](/images/projects/sales-forecasting/monthly-trends.webp)

## Méthodologie

Pour isoler l'impact de chaque source de données, nous avons adopté une démarche scientifique d'enrichissement progressif, validée sur un seul "magasin pilote" avant le passage à l'échelle.

### Phase A : Modèle de Base
* Extraction des composantes temporelles classiques de la date (jour de la semaine, jour de l'année, mois).
* Création de variables glissantes sur 30 jours pour capturer la tendance intrinsèque de chaque famille de produits.

![Moyenne des ventes journalières selon le jour de la semaine.](/images/projects/sales-forecasting/weekly-patterns.webp)

### Phase B : Enrichissement Itératif
* **Ajout des Jours Fériés** : Création d'indicateurs (flags) pour avertir le modèle des pics de consommation liés aux festivités.
* **Ajout du Pétrole** : Injection du cours du baril lissé pour ajuster la tendance macro-économique globale.
* **Ajout des Jours de Paie** : Modélisation des fenêtres de paie bi-mensuelles, un signal extrêmement fort dans les habitudes de consommation sud-américaines.

### Phase C : Choix de l'Algorithme et Passage à l'Échelle
* **Expérimentations** : Sur le magasin pilote, RandomForestRegressor s'est montré légèrement plus performant que LightGBM (RMSLE de 0.4956 contre 0.5674 sur les données de base).
* **Le mur de la scalabilité** : Lors du passage à l'échelle nationale (prédire simultanément les 54 magasins * 33 familles de produits sur des millions de lignes), l'algorithme Random Forest s'est effondré, générant une erreur de saturation mémoire (Out-Of-Memory) en raison de la profondeur et du nombre d'arbres.
* **Solution** : Bascule sur LightGBM, un algorithme de gradient boosting spécialement conçu pour être extrêmement frugal en mémoire et très rapide sur de vastes volumes.

## Résultats

Le suivi de l'erreur quadratique moyenne (RMSLE) sur le magasin pilote prouve que chaque source de données externe a apporté un gain prédictif incrémental :

| Étape de Modélisation | Features Ajoutées | RMSLE (Magasin Pilote) |
| :--- | :--- | :--- |
| 1. Baseline | Variables temporelles pures | 0.4956 |
| 2. + Calendrier | Indicateurs de Jours Fériés | 0.4931 |
| 3. + Économie | Cours du pétrole (interpolé) | 0.4737 |
| **4. + Social** | **Cycles de paie (15 & fin de mois)** | **0.4722** |

**Bilan Final** : Déployé sur l'intégralité du réseau national (tous magasins et produits confondus), le modèle LightGBM final a obtenu un score public de 0.69857 sur Kaggle. Le rebond mécanique du RMSLE lors de cette phase finale s'explique par l'explosion de la complexité et de la variance induite par la prédiction de magasins et d'articles aux comportements très disparates.
