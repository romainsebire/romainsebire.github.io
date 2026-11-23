---
title: "Real Estate Price Prediction: Text Mining & Regression"
tagline: "LightGBM · Optuna · Basic NLP · Pandas"
summary: "Estimated residential property prices in Brazil by combining structural housing attributes with automated keyword extraction from free-text listing descriptions."
category: "ml"
domains: ["regression", "data-engineering"]
stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "LightGBM", "XGBoost", "Optuna"]
github: "https://github.com/romainsebire/projects-ufrj/blob/main/notebooks/en/Notebook_realEstate_en.ipynb"
featured: false
order: 11
date: "July 2025"
cover: "/images/projects/real-estate/cover.webp"
environment: "Local CPU (Kaggle)"
---

This project aims to predict the sale price of real estate properties based on their physical characteristics (surface area, bedrooms) and amenities (pool, gym, etc.). The main challenge lay in processing a free-text variable describing the property's features, as well as managing extreme prices. By combining clever keyword extraction, strict statistical filtering, and Bayesian hyperparameter optimization via Optuna, the final LightGBM model achieved a RMSPE score of 0.2527 on the Kaggle platform.

## Context

This work constitutes the second and final evaluation project for the Machine Learning course taught by Professor Heraldo Luis Silveira de Almeida at UFRJ (Brazil). Organized as a Kaggle In-Class competition, the objective was to expose students to classic regression problems on noisy and heterogeneous data (numerical, categorical, and textual).

## Data

* **Volume**: 4,683 training examples and 2,000 test examples, with 21 variables (neighborhood, seller type, number of bedrooms, surface area, etc.).
* **Baseline Quality**: No missing values were present in the dataset.
* **The Noise**: Distribution analysis revealed extreme values on the target variable (price), with very high (ultra-luxury) or very low amounts, risking completely biasing model training.

![Analysis of living area distribution.](/images/projects/real-estate/area-distribution.webp)

## Methodology

The success of this project relied on transforming unstructured information into strong mathematical signals, divided into three key steps:

### Phase A: Handling Extreme Values
Since the evaluation metric heavily penalizes large prediction errors (RMSPE), cleaning the target variable was critical. We applied the Interquartile Range (IQR) method with a strict factor of 1.55 to truncate extreme prices, thereby stabilizing the model's loss function.

![Statistical distribution of real estate prices before and after IQR filtering.](/images/projects/real-estate/price-distribution.webp)

### Phase B: Text Mining on the \"Diferenciais\" Variable
The listings had a free-text column (`diferenciais`) containing comma-separated keywords (e.g., "sauna, pool, security").
* **Cross-Audit**: By counting word occurrences in this text and comparing them to already existing boolean columns, we proved that some information was redundant.
* **Value Creation**: We extracted 8 new unique features from this text (e.g., soccer field, squash court, locker room, hydromassage) that did not exist in the basic tabular data.

### Phase C: Additional Feature Engineering & Multicollinearity
* **Creation of Combined Domain Variables**: `area_total` (usable area + extra area) and `area_por_quarto` (average area per room).
* **The Redundancy Test**: Intuitively, one might want to remove redundant variables (multicollinearity) to lighten the model. However, tree-based models handle collinearity very well natively. Since removing columns did not change performance, the precautionary principle led us to keep all encoded variables.

## Results

Three Gradient Boosting algorithms were compared in cross-validation (Random Forest, XGBoost, LightGBM). LightGBM proved to be the most performant (base RMSPE at ~0.2379).

To squeeze out the last percentages of performance, we replaced classic grid searches with Bayesian optimization via Optuna.

![Feature importance determined by the LightGBM model.](/images/projects/real-estate/feature-importance.webp)

| Model | RMSPE Score (Validation) | Kaggle Score |
| :--- | :---: | :---: |
| Random Forest | 0.2493 | - |
| XGBoost | 0.2432 | - |
| LightGBM | 0.2379 | - |
| **LightGBM + Optuna** | **0.2372** | **0.2527** |
