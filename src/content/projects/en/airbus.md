---
title: "Industrial Performance Prediction (Airbus Hackathon)"
tagline: "Data Engineering · Chained LightGBM · MLP"
summary: "Developed a hybrid predictive model combining gradient boosted trees and a neural network to estimate helicopter assembly line performance indicators in real time."
category: "ml"
domains: ["regression", "data-engineering"]
stack: ["Pandas", "Scikit-learn", "LightGBM", "CatBoost", "PyTorch"]
github: "https://github.com/romainsebire/airbus-hackathon"
featured: true
order: 3
date: "December 2025"
cover: "/images/projects/airbus/cover.webp"
environment: "Local CPU (boosting) & GPU NVIDIA T4 (MLP)"
---

In the aerospace industry, configuring an assembly line to ensure customer satisfaction while controlling costs is a major challenge. Traditional simulation software allows testing scenarios, but their computation times are prohibitive. This project, completed during an inter-school hackathon, proposed replacing these simulators with predictive AI. By managing a very high-dimensional dataset (over 7,500 variables) and hybridizing two radically different approaches (a LightGBM regression chain and an MLP), we built a model capable of predicting the impact of an industrial configuration in a few milliseconds with excellent robustness.

## Context

This hackathon, organized jointly for ISAE-SUPAERO and IMT Mines Ales, directly aligns with the research topics led by Maryam Saadi (PhD student at IMT Mines Ales with Airbus Helicopters), who provided the data and the topic.

* **The Problem**: Evaluating a production plan via a discrete-event simulator (e.g., AnyLogic) is far too slow for agile decision-making.
* **The Mission**: Develop a surrogate model (predictive AI) capable of simultaneously predicting three key performance indicators (KPIs): Work in Progress (WIP), required Investments, and Customer Satisfaction.
* **The Evaluation**: While all three KPIs had to be predicted to understand factory dynamics, only Customer Satisfaction (the probability that the prediction error is less than 0.05) was used for the final leaderboard score.

## Data

The provided dataset presented major obstacles for classic learning algorithms:
* **High Dimensionality vs. Small Sample Size**: Over 7,590 features for a limited number of training examples, creating a critical risk of overfitting.
* **Data Heterogeneity**: 7,540 very sparse time series representing Demand, combined with 50 dense workshop configuration parameters.
* **Gradient Imbalance**: The target variables were not on the same scale. WIP fluctuated above 10^7, Investment around 10^5, and Satisfaction between 0 and 1. Without treatment, WIP would have completely dominated the model's loss function.

## Methodology

Before modeling, heavy preprocessing was carried out: removing 1,485 constant columns, scaling targets, and analyzing feature importance. Then, to bypass the problem's complexity, we developed two distinct approaches:

### Approach A: Regressor Chain
Instead of predicting the 3 KPIs simultaneously, we exploited their industrial causal links via a cascaded architecture:
**Step 1**: A model predicts WIP from raw data.
**Step 2**: A second model predicts Investment from raw data + the WIP prediction.
**Step 3**: The final model predicts Customer Satisfaction using the full context (data + WIP + Investment).

* **Evaluated Algorithms**: XGBoost, CatBoost, and LightGBM.
* **Feature Selection**: Dimensionality was drastically reduced by calculating feature importance for each KPI and model, generating a specialized, lighter dataset (e.g., 1,764 features kept for LGBM).

### Approach B: Deep Learning (MLP)
To capture relationships different from decision trees, we designed a neural network (a 6.5M parameter MLP) specifically tailored for this problem:
* **Dual-input Architecture**: Two distinct networks separately process "Demand" features (sparse) and "Parameter" features (dense), before concatenating their embeddings for the final prediction.
* **Custom Loss**: To force the network to focus on the hackathon goal, we created a Weighted Mean Absolute Error (WMAE) loss function, weighting Satisfaction at 3, compared to 1 for the other KPIs. We also added a binary penalty system for any error exceeding the threshold of 0.05.

## Results

* **Performance**: The regressor chain approach with LightGBM proved to be our best single model (Score: 0.83). The neural network (MLP) peaked around 0.81, validating the superiority of tree-based models on tabular data.
* **Model Ensembling**: To achieve our best final score on the private leaderboard, we computed a weighted average of the LightGBM and MLP predictions.
* **Final Standings**: Our team won 1st place in the final general standings (out of 15 participating teams).
