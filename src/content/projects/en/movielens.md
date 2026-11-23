---
title: "User Segmentation and Movie Profiling (MovieLens 1M)"
tagline: "PCA · SVD · K-Means · DBSCAN"
summary: "Segmented movie platform users through unsupervised clustering to uncover distinct viewer profiles after outlier removal and dimensionality reduction."
category: "ml"
domains: ["clustering", "data-engineering"]
stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "PCA", "SVD", "K-Means", "DBSCAN"]
github: "https://github.com/romainsebire/projects-ufrj/blob/main/notebooks/en/Notebook_clustering_en.ipynb"
featured: false
order: 13
date: "June 2025"
cover: "/images/projects/movielens/cover.webp"
environment: "Local Notebook (CPU)"
---

This project aims to segment users of the famous MovieLens 1M database (1 million ratings, 6,040 users, 3,706 movies) into coherent groups based on their cinematic tastes. Applying unsupervised clustering algorithms directly on such a high-dimensional matrix initially failed. By designing a strict outlier detection and removal pipeline based on K-NN distances, followed by dimensionality reduction (PCA/SVD), we were able to extract two highly distinct user profiles. This work serves as the foundation for a collaborative filtering recommendation system.

## Context

Completed during my exchange at UFRJ (Brazil), this project is part of the Data Mining course evaluation (taught by Mr. Geraldo Zimbrao). Unlike regression or classification tasks, this project is purely exploratory. Without ground truth, the main challenge was to mathematically and visually prove the relevance of the groups formed by the algorithms.

## Data

* **The Structure**: Transforming raw data into a massive User-Movie matrix (rows represent users, columns represent movies, and values represent ratings from 1 to 5). Missing values (movies not watched) were imputed with zeros.
* **The Noise**: The distribution of interactions is extremely skewed. Some "super-users" rated over 2,300 movies, while niche movies (e.g., Documentaries, Film-Noir) have only a single rating.
* **Preprocessing**: Utilizing a StandardScaler to standardize the data. This step is critical because clustering algorithms rely on Euclidean distance calculations.

![Comparison of average rating profiles by user cluster.](/images/projects/movielens/user-clusters.webp)

## Methodology

The process highlighted the biggest pitfall of unsupervised learning: extreme sensitivity to outliers in high-dimensional spaces.

### Phase A: The High-Dimensional Wall
"Naive" application of K-Means, DBSCAN, and Agglomerative Clustering.
* **Observation**: The algorithms collapsed. They grouped 99% of the data into a single giant cluster and created clusters of one or two elements containing only extreme users. DBSCAN failed to form any clusters at all.

### Phase B: Outlier Purging
To force the algorithms to focus on core trends, a 3-step filtering strategy was implemented:
1. **Quantile Trimming**: Strict removal of users and movies lying outside the 5th to 95th percentile range.
2. **K-Nearest Neighbors Detection**: Calculating the distance matrix between all users. For each user, the average distance to their 5 nearest neighbors was calculated.
3. **Z-Score**: Excluding users with a distance Z-score > 3 (those whose rating behavior deviated radically from the norm).

### Phase C: Dimensionality Reduction (PCA & SVD)
To assist DBSCAN (which is highly sensitive to high dimensions), the movie space was compressed mathematically:
* **PCA**: Reduction to 50 dimensions (retaining ~20% of the variance).
* **SVD**: More aggressive reduction to 10 dimensions (retaining >25% of the variance).

![Average score by genre and by cluster.](/images/projects/movielens/genre-scores.webp)

## Results

After cleaning the outliers, optimization via the Silhouette Score validated that the ideal number of clusters for K-Means and Agglomerative was 3. Analysis of these clusters revealed two highly distinct typical profiles:
* **Profile 1 (Action & Thrill Seekers)**: Massively consume Action, Adventure, Sci-Fi, and Thriller movies. Interestingly, the heatmap of their ratings shows that they are harsher critics, giving overall ratings below the average.
* **Profile 2 (Drama & Romance Viewers)**: Clearly prefer Comedies, Dramas, Romances, and Musicals. They are generally more generous in their ratings.

**Lesson Learned**: This project proves that identifying and removing outliers is the most critical step in achieving meaningful clustering.
