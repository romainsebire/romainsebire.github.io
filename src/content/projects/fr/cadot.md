---
title: "Détection Multi-classes & Data Augmentation Ciblée"
tagline: "YOLOv11 · Albumentations · Stable Diffusion"
summary: "Entraînement d'un modèle de détection d'objets urbains sur des images aériennes de Paris en corrigeant le fort déséquilibre des classes par de la génération d'images synthétiques."
category: "dl"
domains: ["computer-vision", "data-engineering"]
stack: ["PyTorch", "CNN", "YOLOv11", "Ultralytics", "Albumentations", "Stable Diffusion", "Docker"]
github: "https://github.com/romainsebire/CADOTProject"
venue: "IEEE ICIP 2025"
featured: true
order: 2
date: "Nov. – Déc. 2025"
cover: "/images/projects/cadot/cover.webp"
imageGroups:
  - caption: "Exemples d'images du dataset avec les classes annotés."
    images:
      - url: "/images/projects/cadot/annotation-step1.webp"
      - url: "/images/projects/cadot/annotation-step2.webp"
      - url: "/images/projects/cadot/annotation-step3.webp"
environment: "Conteneur docker avec GPU NVIDIA T4 (16Go VRam)"
---

Ce projet vise à entraîner un modèle de deep learning capable de détecter 14 catégories d'objets urbains sur des images aériennes haute résolution de la ville de Paris. Face à un jeu de données marqué par un déséquilibre extrême, l'objectif central a été de concevoir des pipelines de data augmentation avancés (Albumentations sur-mesure et Inpainting par IA générative) afin de redonner de la visibilité aux classes rares.

## Contexte

Développé comme projet de fin d'UE Deep Learning, le sujet est celui du défi international IEEE ICIP 2025 (CADOT Challenge). L'enjeu principal était scientifique et méthodologique : explorer, implémenter et comparer l'impact de différentes techniques d'augmentation de données sur les performances d'un modèle de détection d'objets.

## Données

* **Source & Volume** : Jeu de données issu de l'IGN, comprenant 4 628 images aériennes haute résolution de la région parisienne, totalisant 106 691 annotations d'objets (bâtiments, terrains de sport, véhicules, etc).
* **Le Défi Technique** : Les véhicules et les bâtiments représentent à eux seuls plus de 87 % des annotations. Ce déséquilibre massif tend à biaiser le modèle, qui peine à detecter les classes minoritaires comme les infrastructures sportives.
* **Prétraitement** : Conversion et restructuration complète des fichiers d'annotations du format natif COCO (JSON unique) vers le format TXT standardisé requis par l'écosystème Ultralytics YOLO.

## Méthodologie

### Étape 0 : Établissement de la Baseline
* **Objectif** : Évaluer les performances brutes sans stratégie de rééquilibrage.
* **Méthode** : Fine-tuning des architectures YOLOv11 nano et YOLOv11 medium directement sur le dataset d'origine.

### Approche A : Augmentation Commune (Générique)
* **Objectif** : Augmenter globalement la fréquence des classes rares.
* **Méthode** : Application d'un pipeline Albumentations standard (transformations géométriques, flou gaussien, découpes) appliqué uniformément sur toutes les images contenant des objets rares.

### Approche B : Augmentation Spécialisée par Classe
* **Objectif** : Éviter la dégradation des caractéristiques visuelles spécifiques aux objets.
* **Méthode** : Création de pipelines Albumentations distincts et optimisés par types d'objet.
* **Exemple concret** : Exclusion stricte du flou gaussien pour les terrains de sport, car la netteté des lignes blanches au sol est indispensable au modèle pour les identifier.

### Approche C : Inpainting par IA Générative
* **Objectif** : Créer de nouveaux exemples réalistes pour la classe la plus rare directement au sein du contexte urbain existant.

**Pipeline d'Inpainting** :
1. **Sélection** : Extraction d'un lot d'images d'arrière-plan (backgrounds) présentant de larges zones sans objets.
2. **Masquage** : Génération de masques de segmentation dans ces espaces vides.
3. **Génération** : Utilisation de Stable Diffusion 1.5 et Imagen 3 pour générer les objets rares dans les masques de manière contextuelle.
4. **Labellisation** : Injection automatique des nouvelles coordonnées de la boîte englobante (bounding box) dans les fichiers d'annotations YOLO.

| Étape 1: Sélection | Étape 2: Masque | Étape 3: Génération | Étape 4: Labellisation |
| :---: | :---: | :---: | :---: |
| ![](/images/projects/cadot/pipeline-step1.webp) | ![](/images/projects/cadot/pipeline-step2.webp) | ![](/images/projects/cadot/pipeline-step3.webp) | ![](/images/projects/cadot/pipeline-step4.webp) |

## Résultats

* **Performance Globale** : L'approche par Albumentations Spécialisés (Approche B) a le mieux performé sur le score global permettant d'obtenir un gain de +5,5 % de mAP50 par rapport à la baseline YOLOv11m.
* **Focus Classes Minoritaires** : L'approche par Inpainting ciblé a permis de doubler le recall sur la classe ciblée, de 0.20 à 0.40, accompagné d'une hausse du mAP de +22%.

**Leçon Apprise** : L'augmentation ciblée d'une classe améliore sa détectabilité. Cependant, en détection multi-classes, ce gain se fait souvent au détriment d'autres classes. Le mAP global varie peu, ce qui démontre qu'ajuster les métriques des classes rares nécessite de faire des compromis sur d'autres.
