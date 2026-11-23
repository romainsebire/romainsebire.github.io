---
title: "Segmentation d'Utilisateurs et Profilage Cinématographique (MovieLens 1M)"
tagline: "PCA · SVD · K-Means · DBSCAN"
summary: "Segmentation non supervisée d'utilisateurs de cinéma pour identifier des profils de spectateurs distincts après filtrage des comportements atypiques et réduction de dimension."
category: "ml"
domains: ["clustering", "data-engineering"]
stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "PCA", "SVD", "K-Means", "DBSCAN"]
github: "https://github.com/romainsebire/projects-ufrj/blob/main/notebooks/en/Notebook_clustering_en.ipynb"
featured: false
order: 13
date: "Juin 2025"
cover: "/images/projects/movielens/cover.webp"
environment: "Notebook local (CPU)"
---

Ce projet vise à segmenter les utilisateurs de la célèbre base de données MovieLens 1M (1 million de notes, 6 040 utilisateurs, 3 706 films) en groupes cohérents basés sur leurs goûts cinématographiques. L'application d'algorithmes de clustering non-supervisés sur une matrice de si grande dimension a d'abord échoué. C'est en concevant un pipeline strict de détection et suppression des valeurs aberrantes basé sur les distances K-NN, suivi d'une réduction de dimension (PCA/SVD), que nous avons pu extraire deux profils types d'utilisateurs hautement distincts. Ce travail constitue la première brique fondamentale d'un système de recommandation par filtrage collaboratif.

## Contexte

Réalisé lors de mon échange à l'UFRJ (Brésil), ce projet fait partie du cursus d'évaluation de l'UE Data Mining (enseigné par M. Geraldo Zimbrão). Contrairement aux projets de régression ou de classification, ce projet est purement exploratoire. Sans vérité terrain, l'enjeu principal était de prouver mathématiquement et visuellement la pertinence des groupes formés par les algorithmes.

## Données

* **La structure** : Transformation des données brutes en une immense Matrice Utilisateur-Film (les lignes sont les utilisateurs, les colonnes les films, et les valeurs les notes de 1 à 5). Les valeurs manquantes (films non vus) ont été imputées par des zéros.
* **Le Bruit** : La distribution des interactions est extrêmement asymétrique. Certains \"super-utilisateurs\" ont noté plus de 2 300 films, tandis que des films de niche (ex: Documentaires, Film-Noir) ne possèdent qu'une seule note.
* **Prétraitement** : Utilisation d'un StandardScaler pour centrer-réduire les données. Cette étape est critique car les algorithmes de clustering se basent sur des calculs de distance euclidienne.

![Comparaison des profils de notation moyens par cluster d'utilisateurs.](/images/projects/movielens/user-clusters.webp)

## Méthodologie

La démarche a mis en évidence le plus grand piège de l'apprentissage non-supervisé : la sensibilité extrême aux valeurs aberrantes dans les espaces à haute dimension.

### Phase A : Le mur de la haute dimension
Application \"naïve\" de KMeans, DBSCAN et Agglomerative Clustering.
* **Constat** : Les algorithmes s'effondrent. Ils regroupent 99% des données dans un seul cluster géant et créent des clusters d'un ou deux éléments contenant uniquement les utilisateurs extrêmes. DBSCAN ne parvient même pas à former de clusters.

### Phase B : La purge des Outliers
Pour forcer les algorithmes à se concentrer sur les tendances de fond, une stratégie de filtrage en 3 étapes a été mise en place :
1. **Écrémage par quantiles** : Suppression stricte des utilisateurs et des films se trouvant en dehors de l'intervalle du 5ème au 95ème percentile.
2. **Détection par K-Nearest Neighbors** : Calcul de la matrice de distance entre tous les utilisateurs. Pour chaque utilisateur, calcul de la distance moyenne avec ses 5 plus proches voisins.
3. **Z-Score** : Exclusion des utilisateurs ayant un Z-score de distance > 3 (ceux qui ont des comportements de notation radicalement éloignés de la norme).

### Phase C : Réduction de Dimension (PCA & SVD)
Pour aider DBSCAN (très sensible à la grande dimension), l'espace des films a été compressé mathématiquement :
* **PCA** : Réduction à 50 dimensions (conservant ~20% de la variance).
* **SVD** : Réduction plus agressive à 10 dimensions (conservant >25% de la variance).

![Score moyen par genre et par cluster.](/images/projects/movielens/genre-scores.webp)

## Résultats

Après le nettoyage des outliers, l'optimisation par le Score de Silhouette a validé que le nombre idéal de clusters pour KMeans et Agglomerative était de 3. L'analyse de ces clusters a révélé deux profils types très distincts :
* **Profil 1 (Amateurs de sensations fortes)** : Consomment massivement des films d'Action, d'Aventure, de Science-Fiction et des Thrillers. Fait intéressant : la Heatmap de leurs notes montre qu'ils sont des critiques plus sévères, donnant des notes globales plus basses que la moyenne.
* **Profil 2 (Spectateurs d'émotion)** : Préfèrent nettement les Comédies, Drames, Romances et Comédies Musicales. Ils sont globalement plus généreux dans leurs notations.

**Leçon Apprise** : Ce projet prouve que l'identification et la suppression des valeurs aberrantes est l'étape la plus critique pour réussir un clustering pertinent.
