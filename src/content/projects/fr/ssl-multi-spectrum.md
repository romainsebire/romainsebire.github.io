---
title: "Classification de Maladies Agricoles par Apprentissage Auto-Supervisé"
tagline: "Self-Supervised Learning · Vision Transformers · Sentinel-2"
summary: "Détection de maladies agricoles sur des images satellites multi-spectrales en pré-entraînant un modèle de vision de manière auto-supervisée sur un large volume d'images non annotées."
category: "dl"
domains: ["computer-vision", "self-supervised-learning"]
stack: ["Vision Transformers","ResNet", "SimCLR", "MAE", "Sentinel-2", "Docker"]
github: "https://github.com/romainsebire/ssl-multi-spectrum"
venue: "ICPR 2026"
featured: true
order: 6
date: "Février 2026"
cover: "/images/projects/ssl-multi-spectrum/cover.webp"
imageGroups:
  - caption: "Échantillon 1 : Canaux RGB (lumière visible) et NIR (proche infrarouge)"
    images:
      - url: "/images/projects/ssl-multi-spectrum/sample1-rgb.webp"
        alt: "Échantillon 1 RGB"
      - url: "/images/projects/ssl-multi-spectrum/sample1-nir.webp"
        alt: "Échantillon 1 NIR"
  - caption: "Échantillon 2 : Canaux RGB (lumière visible) et NIR (proche infrarouge)"
    images:
      - url: "/images/projects/ssl-multi-spectrum/sample2-rgb.webp"
        alt: "Échantillon 2 RGB"
      - url: "/images/projects/ssl-multi-spectrum/sample2-nir.webp"
        alt: "Échantillon 2 NIR"
environment: "Pipelines SimCLR & MAE : Docker GPU NVIDIA T4 (16Go VRam)\nPipeline Sat-MAE : Google Colab GPU NVIDIA A100 (40Go VRAM)"
---

Ce projet vise à détecter et classifier quatre types de maladies affectant les cultures agricoles à partir d'images satellites multi-spectrales Sentinel-2. Le défi majeur résidait dans l'extrême rareté des données labellisées disponibles, rendant l'entraînement de modèles profonds classiques impossible. Pour contourner cet obstacle, nous avons exploité un corpus massif de 125 Go de données satellitaires non labellisées afin de pré-entraîner des architectures (ResNet et Vision Transformers) via des techniques d'apprentissage auto-supervisé (Self Supervised Learning). L'adaptation finale du modèle de fondation satellitaire Sat-MAE a permis d'atteindre une accuracy de 87.5 %, surpassant largement les approches classiques.

## Contexte

Ce travail a été réalisé dans le cadre de l'UE Advanced Deep Learning de l'IMT Mines Alès s'appuyant sur la compétition internationale AgVision (ICPR 2026) : "Beyond Visible Spectrum: AI for Agriculture". Réalisé en équipe avec Kungsamreth SOK et Setthika SUN. L'objectif est critique : la détection précoce des maladies (pucerons, rouille, etc.) est indispensable pour prévenir les pertes agricoles massives à grande échelle. L'enjeu technique était de démontrer la viabilité des modèles de fondation pour l'observation de la Terre en régime de données labelisées très limitées.

## Données

* **Source & Volume** : Imagerie satellitaire multi-spectrale issue de Sentinel-2. Le corpus se divise en un vaste jeu non labellisé de 125 Go (166 775 images) pour le pré-entraînement, et un très petit jeu de seulement 900 échantillons labellisés pour le fine-tuning.
* **Le Défi Technique** : Les données contiennent jusqu'à 12 bandes spectrales allant de la lumière visible (RVB) au proche infrarouge (NIR) et SWIR, avec des résolutions spatiales hétérogènes (10m, 20m, 60m). Les relations entre ces bandes sont complexes et non-linéaires. Le jeu labellisé est fortement déséquilibré, la classe "Rouille" (Rust) représentant 50 % des données contre seulement 8.3 % pour la classe "RPH".
* **Prétraitement** : Normalisation standardisée des bandes (Z-score) basée sur le calcul des statistiques globales de l'ensemble du dataset non labellisé.

## Méthodologie

Face au manque de labels, nous avons structuré nos expériences autour de trois méthodes d'apprentissage auto-supervisé (SSL) pour apprendre au modèle à "comprendre" l'imagerie satellite avant de lui demander de classifier les maladies.

### Approche A : Apprentissage Contrastif (SimCLR)
* **Objectif** : Évaluer une architecture CNN classique couplée à une méthode contrastive.
* **Méthode** : Utilisation du framework SimCLR avec un encodeur ResNet-18 modifié pour accepter les 12 canaux spectraux. Le modèle génère deux vues augmentées d'une même image et apprend à maximiser leur similarité. L'encodeur est ensuite réutilisé pour entraîner un classifieur linéaire.

### Approche B : Reconstruction par Masquage (Custom MAE)
* **Objectif** : Basculer sur l'architecture Vision Transformer (ViT) pour mieux capturer les dépendances spatiales et spectrales.
* **Méthode** : Implémentation d'un Masked Autoencoder (MAE) sur une architecture ViT-Small. 75 % des patchs de l'image satellite sont masqués aléatoirement. Le modèle est forcé de reconstruire les zones invisibles (via une perte MSE), l'obligeant à apprendre la sémantique agricole. Seul l'encodeur ViT est conservé pour la phase de classification finale.

### Approche C : Adaptation d'un Modèle de Fondation (Sat-MAE)
* **Objectif** : Exploiter la puissance d'un modèle lourd pré-entraîné mondialement (Sat-MAE, basé sur ViT-Large) et l'adapter à notre domaine spécifique.
* **Pré-entraînement continu** : Entraînement supplémentaire de Sat-MAE sur nos 125 Go de données non labellisées Sentinel-2 pour réduire le changement de domaine.
* **Stratégie de gel des poids** : Pour éviter d'effacer les connaissances du modèle (catastrophic forgetting) et maîtriser la "dérive des poids" (weight drift), les blocs 0 à 5 de l'encodeur ont été figés (23.2% des paramètres).
* **Fine-Tuning Supervisé** : Entraînement final du classifieur (derniers blocs + tête de classification) sur les données labellisées en utilisant une Focal Loss pondérée (gamma=2) pour pallier le déséquilibre extrême des classes.

## Résultats

L'utilisation de modèles de fondation pré-entraînés auto-supervisés a complètement surclassé les réseaux convolutifs classiques (CNN) en situation de données rares. Afin de maximiser la robustesse de l'inférence, nous avons appliqué un mécanisme de Test-Time Augmentation (TTA) (combinaison de retournements et de rotations géométriques lors de la prédiction finale).

| Modèle / Approche | Type d'architecture | Taille des Données | Accuracy en Validation |
| :--- | :--- | :---: | :---: |
| SimCLR | ResNet-18 | 125 Go |59.2 % |
| MAE | ViT-Small | 125 Go | 71.0 % |
| **Sat-MAE** | **ViT-Large + TTA** | **94 Go** | **87.5 %** |

* **Leçon Apprise** : Ce projet démontre que l'adaptation d'un modèle de fondation massif (Sat-MAE) sur les données non labellisées d'un domaine cible (agricole), permet d'obtenir une généralisation exceptionnelle, même avec moins d'un millier d'images labellisées.
