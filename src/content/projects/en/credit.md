---
title: "Decision Support System: Credit Risk Prediction"
tagline: "LightGBM · XGBoost · RandomizedSearchCV"
summary: "Built a classification model to assess loan default risk from applicants' socio-economic profiles and banking histories after targeted feature selection."
category: "ml"
domains: ["classification", "data-engineering"]
stack: ["Python", "Pandas", "Scikit-learn", "LightGBM", "XGBoost", "RandomForest", "RandomizedSearchCV"]
github: "https://github.com/romainsebire/projects-ufrj/blob/main/notebooks/en/Notebook_creditApproval_en.ipynb"
featured: false
order: 10
date: "July 2025"
cover: "/images/projects/credit/cover.webp"
environment: "Local CPU (Jupyter Notebook)"
---

This project aims to build a classification model to predict whether a credit applicant will default on their payments, based on their demographic and financial data. The technical challenge lay in processing a database containing significant noise (constant variables, extraction errors). By applying feature selection and optimizing a model, we reached an accuracy of 0.5996 on the evaluation dataset.

## Context

This work was carried out in Brazil (UFRJ) and constitutes the first of two evaluation projects for the Machine Learning course taught by Professor Heraldo Luis Silveira de Almeida. It took the form of a Kaggle In-Class competition, testing students on their ability to clean data and optimize classification algorithms.

## Data

* **Volume**: 20,000 training examples and 5,000 test examples, described by 42 initial features (age, income, status, number of bank accounts, etc.).
* **The Target**: A binary variable indicating whether the client is a good payer or a bad payer. The target was perfectly balanced (50/50), avoiding the need for oversampling techniques.
* **Exploratory Analysis**: Distribution analysis revealed numerous anomalies in data collection. Multiple columns were entirely filled with zeros, "1", or "N", rendering them completely useless from a predictive standpoint.

## Methodology

The approach was iterative, testing multiple hypotheses to retain only the most robust.

### Phase A: Feature Selection
Instead of blindly keeping all 42 variables, a quick first iteration with LightGBM allowed us to calculate feature importance. By crossing these results with the exploratory analysis, the 10 least useful and most corrupted variables were simply removed from the dataset.

![Relative feature importance determined by the LightGBM model, top 10 most important.](/images/projects/credit/top-features.webp)
![Relative feature importance determined by the LightGBM model, bottom 10 least important.](/images/projects/credit/bottom-features.webp)

### Phase B: Preprocessing and Pipeline
* **Missing Value Imputation**: After testing several strategies (most frequent value, mean, etc.), median imputation proved to be the most effective.
* **Encoding**: Application of One-Hot Encoding on categorical variables. Although theoretically optional for tree-based algorithms, normalization (Standard Scaler) was applied, empirically improving cross-validation scores.

### Phase C: Benchmark
The data was split (80% Train / 20% Validation) to compare three major algorithms: Random Forest, XGBoost, and LightGBM. LightGBM immediately stood out in terms of efficiency and accuracy.

![Distribution of credit scores for several models.](/images/projects/credit/score-distribution.webp)

### Phase D: Optimization
The value of this project lies in the scope of the experiments conducted:
* **The Failures**: Massive creation of new variables (complex feature engineering), using Optuna, and ensemble methods (Stacking/Voting including RF and XGBoost) all dropped the score. Since LightGBM was superior, forcing it to "vote" with poorer models degraded its performance.
* **The Chosen Solution**: Controlled hyperparameter tuning via RandomizedSearchCV on LightGBM alone.

## Results

The final model generated was submitted to the Kaggle platform for the class ranking.

| Model Used | Strategy Adopted | Accuracy (Validation) | Accuracy (Kaggle Leaderboard) |
| :--- | :--- | :--- | :--- |
| Random Forest | Raw baseline | 0.5782 | - |
| XGBoost | Raw baseline | 0.5896 | - |
| LightGBM | Raw baseline | 0.5964 | - |
| LightGBM | Stacking / Voting (with RF/XGB) | Performance drop | - |
| **LightGBM** | **Pruning + RandomSearchCV** | **~0.60** | **0.5996** |

**Lesson Learned**: Meticulous data cleaning combined with a well-calibrated powerful algorithm (LightGBM) is often far more robust and performant than stacking unnecessary layers of algorithmic complexity.
