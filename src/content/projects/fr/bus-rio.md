---
title: "Modélisation Spatio-Temporelle du Réseau de Bus de Rio de Janeiro"
tagline: "PostgreSQL · PostGIS · Python · Folium"
summary: "Nettoyage et structuration géospatiale de données GPS brutes pour identifier automatiquement les terminus et modéliser la vitesse de circulation du réseau de bus de Rio de Janeiro."
category: "ml"
domains: ["data-engineering", "clustering"]
stack: ["Python", "PostgreSQL", "PostGIS", "Pandas", "Scikit-learn", "Folium"]
github: "https://github.com/romainsebire/projects-ufrj/blob/main/notebooks/en/Notebook_bus_en.ipynb"
featured: false
order: 8
date: "Juin 2025"
cover: "/images/projects/bus-rio/cover.webp"
environment: "Jupyter Notebook (Local CPU)"
---

Ce projet de Data Mining a pour objectif de construire la base de données nécessaires à l'entraînement d'un modèle de prédiction de localisation des bus de Rio de Janeiro. À partir de données GPS brutes et très bruitées émises par des milliers de bus, le défi a été de concevoir des algorithmes spatiaux pour nettoyer les données, déduire l'infrastructure de la ville (identification automatique des dépôts et terminus), séparer les trajets par sens de circulation, et finalement calculer un modèle de vitesse découpé en tronçons de 250 mètres. Ce travail a permis de transformer un flux GPS chaotique en un dataset d'entraînement structuré et exploitable.

## Contexte

Ce projet a été réalisé lors de mon échange universitaire à l'UFRJ (Universidade Federal do Rio de Janeiro), au Brésil. Il constitue le projet final d'évaluation de l'UE Data Mining dispensée par le Professeur Geraldo Zimbrão. L'enjeu était de se confronter à la réalité des données urbaines (Open Data), souvent incomplètes ou aberrantes, et d'appliquer des méthodes de fouille de données à grande échelle.

## Données

* **Source & Volume** : Plus de 50 Go de données issues de capteurs GPS embarqués, récoltées sur 16 jours continus (du 25 avril au 10 mai 2024). Le dataset couvre 48 lignes de bus et 2 711 véhicules uniques.
* **Variables Clés** :
  * `ordem` (Identifiant unique du bus), `linha` (Numéro de ligne).
  * `latitude` / `longitude` (Coordonnées WGS84), `velocidade` (Vitesse instantanée).
  * `datahora` (Heure d'émission) et `datahoraservidor` (Heure de réception par le serveur, considérée comme la plus fiable pour éviter les désynchronisations).
* **Analyse Exploratoire** : Les données brutes présentaient beaucoup de bruit :
  * 34 % des points GPS enregistraient une vitesse nulle (bus à l'arrêt ou garés).
  * Des points aberrants situés physiquement en dehors de la ville de Rio.
  * Des vitesses incohérentes.

## Méthodologie

Pour passer de points GPS isolés à un modèle de vitesse continu, le pipeline a été structuré en 4 grandes phases d'ingénierie :

### Phase A : Nettoyage et Filtrage Géospatial
Suppression des anomalies via des requêtes PostGIS (exclusion des coordonnées hors d'une bounding box de Rio, filtrage des vitesses absurdes, et restriction de la fenêtre temporelle de 8h à 23h).

![Données GPS brutes visualisées sur la zone de Copacabana.](/images/projects/bus-rio/gps-points.webp)

### Phase B : Détection Algorithmique des Infrastructures (Clustering Temporel)
L'ordinateur ne connaissant pas le plan de la ville, il a fallu déduire les points d'intérêts par l'analyse des comportements :
* **Détection des Dépôts** : Recherche des arrêts prolongés (plus de 10 minutes) ayant lieu tôt le matin. Pour éviter les doublons, un filtre d'exclusion mutuelle d'un rayon de 50 mètres a été appliqué. Les trajets depuis/vers ces dépôts (qui polluent les temps de parcours réels) ont ensuite été exclus.
* **Détection des Terminus** : Comptage des arrêts fréquents de 10 à 30 minutes au même emplacement géographique. Cette méthode s'est avérée extrêmement fiable pour identifier automatiquement les deux extrémités de chaque ligne (validée visuellement sur des cartes folium).

![Tracés théoriques des lignes de bus et détection des terminaux.](/images/projects/bus-rio/line-tracks.webp)

### Phase C : Routage et Interpolation (Sens de Circulation)
Avec les terminus identifiés, chaque nuage de points GPS a pu être divisé en trajets \"Aller\" et trajets \"Retour\".

Les points GPS étant envoyés à intervalles réguliers, un bus roulant vite laisse de grands \"trous\" sur la carte. Une interpolation mathématique a été appliquée pour reconstruire la route de référence exacte entre les pings GPS. *(Note : Une intervention manuelle ciblée a été requise pour corriger les lignes 606 et 917 dont un terminus était en réalité un dépôt excentré).*

![Visualisation aller/retour différenciée de la ligne 483.](/images/projects/bus-rio/route-directions.webp)

### Phase D : Modélisation des Vitesses par Tronçon & Feature Engineering
Les routes de références ont été découpées en tronçons (segments) d'environ 250 mètres. Un algorithme a calculé la vitesse moyenne historique pour chaque tronçon, ligne par ligne (car un même boulevard n'est pas traversé à la même vitesse selon le nombre d'arrêts spécifiques à une ligne).

![Carte thermique des vitesses moyennes par tronçon de route.](/images/projects/bus-rio/speed-heatmap.webp)

## Résultats

Le pipeline a été exécuté avec succès sur l'ensemble des 48 lignes de la ville. Le modèle de vitesse a été validé visuellement via des cartes Folium superposant les tronçons colorés.

L'aboutissement : Le projet a permis de générer la matrice de caractéristiques finale, prête à être utilisée par un algorithme de Machine Learning pour prédire l'heure d'arrivée d'un bus à un point donné, comprenant :
* L'historique des vitesses et de la position du véhicule.
* La distance restante à parcourir sur la ligne de référence.
* La vitesse moyenne historique des prochains tronçons routiers à venir.
