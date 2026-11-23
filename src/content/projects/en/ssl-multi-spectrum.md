---
title: "Agricultural Disease Classification using Self-Supervised Learning"
tagline: "Self-Supervised Learning · Vision Transformers · Sentinel-2"
summary: "Detected crop diseases from multi-spectral satellite imagery by pre-training a vision foundation model with self-supervised learning on a large unlabelled dataset."
category: "dl"
domains: ["computer-vision", "self-supervised-learning"]
stack: ["Vision Transformers", "ResNet", "SimCLR", "MAE", "Sentinel-2", "Docker"]
github: "https://github.com/romainsebire/ssl-multi-spectrum"
venue: "ICPR 2026"
featured: true
order: 6
date: "February 2026"
cover: "/images/projects/ssl-multi-spectrum/cover.webp"
imageGroups:
  - caption: "Sample 1: RGB (visible light) and NIR (near-infrared) channels"
    images:
      - url: "/images/projects/ssl-multi-spectrum/sample1-rgb.webp"
        alt: "Sample 1 RGB"
      - url: "/images/projects/ssl-multi-spectrum/sample1-nir.webp"
        alt: "Sample 1 NIR"
  - caption: "Sample 2: RGB (visible light) and NIR (near-infrared) channels"
    images:
      - url: "/images/projects/ssl-multi-spectrum/sample2-rgb.webp"
        alt: "Sample 2 RGB"
      - url: "/images/projects/ssl-multi-spectrum/sample2-nir.webp"
        alt: "Sample 2 NIR"
environment: "SimCLR & MAE pipelines: Docker container with NVIDIA T4 GPU (16GB VRAM)\nSat-MAE pipeline: Google Colab with NVIDIA A100 GPU (40GB VRAM)"
---

This project aims to detect and classify four types of diseases affecting agricultural crops using Sentinel-2 multi-spectral satellite imagery. The major challenge lay in the extreme scarcity of available labeled data, making the training of classic deep models impossible. To bypass this obstacle, we leveraged a massive 125 GB corpus of unlabeled satellite data to pre-train architectures (ResNet and Vision Transformers) via self-supervised learning (SSL) techniques. The final adaptation of the Sat-MAE satellite foundation model achieved an accuracy of 87.5%, significantly outperforming traditional approaches.

## Context

This work was completed as part of the Advanced Deep Learning course at IMT Mines Ales, based on the AgVision international competition (ICPR 2026): \"Beyond Visible Spectrum: AI for Agriculture.\" Completed in collaboration with Kungsamreth SOK and Setthika SUN. The goal is critical: early disease detection (aphids, rust, etc.) is essential for preventing large-scale agricultural losses. The technical challenge was to demonstrate the viability of foundation models for Earth observation under highly limited labeled data regimes.

## Data

* **Source and Volume**: Multi-spectral satellite imagery from Sentinel-2. The corpus is divided into a large unlabeled dataset of 125 GB (166,775 images) for pre-training, and a very small dataset of only 900 labeled samples for fine-tuning.
* **The Technical Challenge**: The data contains up to 12 spectral bands ranging from visible light (RGB) to near-infrared (NIR) and SWIR, with heterogeneous spatial resolutions (10m, 20m, 60m). The relationships between these bands are complex and non-linear. The labeled set is heavily imbalanced, with the \"Rust\" class representing 50% of the data compared to only 8.3% for the \"RPH\" class.
* **Preprocessing**: Standardized band normalization (Z-score) based on global statistics computed over the entire unlabeled dataset.

## Methodology

Faced with a lack of labels, we structured our experiments around three self-supervised learning (SSL) methods to teach the model to \"understand\" satellite imagery before asking it to classify diseases.

### Approach A: Contrastive Learning (SimCLR)
* **Objective**: Evaluate a classic CNN architecture coupled with a contrastive method.
* **Method**: Using the SimCLR framework with a ResNet-18 encoder modified to accept all 12 spectral channels. The model generates two augmented views of the same image and learns to maximize their similarity. The encoder is then reused to train a linear classifier.

### Approach B: Masked Reconstruction (Custom MAE)
* **Objective**: Switch to the Vision Transformer (ViT) architecture to better capture spatial and spectral dependencies.
* **Method**: Implementing a Masked Autoencoder (MAE) on a ViT-Small architecture. 75% of the satellite image patches are randomly masked. The model is forced to reconstruct the invisible areas (via a MSE loss), obliging it to learn agricultural semantics. Only the ViT encoder is kept for the final classification phase.

### Approach C: Foundation Model Adaptation (Sat-MAE)
* **Objective**: Leverage the power of a globally pre-trained heavy model (Sat-MAE, based on ViT-Large) and adapt it to our specific domain.
* **Continuous Pre-training**: Additional training of Sat-MAE on our 125 GB of unlabeled Sentinel-2 data to reduce domain shift.
* **Weight Freezing Strategy**: To prevent catastrophic forgetting of the model's knowledge and control weight drift, blocks 0 to 5 of the encoder were frozen (23.2% of the parameters).
* **Supervised Fine-Tuning**: Final training of the classifier (last blocks + classification head) on labeled data using a weighted Focal Loss (gamma=2) to address the extreme class imbalance.

## Results

The use of pre-trained self-supervised foundation models completely outperformed traditional convolutional neural networks (CNNs) in rare-data scenarios. To maximize inference robustness, we applied a Test-Time Augmentation (TTA) mechanism (combining geometric flips and rotations during final prediction).

| Model / Approach | Architecture Type | Data Size | Validation Accuracy |
| :--- | :--- | :---: | :---: |
| SimCLR | ResNet-18 | 125 GB | 59.2% |
| MAE | ViT-Small | 125 GB | 71.0% |
| **Sat-MAE** | **ViT-Large + TTA** | **94 GB** | **87.5%** |

* **Lesson Learned**: This project demonstrates that adapting a massive foundation model (Sat-MAE) to the unlabeled data of a target domain (agriculture) yields exceptional generalization, even with fewer than a thousand labeled images.
