---
title: "Multi-Class Detection and Targeted Data Augmentation"
tagline: "YOLOv11 · Albumentations · Stable Diffusion"
summary: "Trained an urban object detection model on aerial imagery of Paris while addressing severe class imbalance through targeted data augmentation and synthetic image inpainting."
category: "dl"
domains: ["computer-vision", "data-engineering"]
stack: ["PyTorch", "CNN", "YOLOv11", "Ultralytics", "Albumentations", "Stable Diffusion", "Docker"]
github: "https://github.com/romainsebire/CADOTProject"
venue: "IEEE ICIP 2025"
featured: true
order: 2
date: "Nov – Dec 2025"
cover: "/images/projects/cadot/cover.webp"
imageGroups:
  - caption: "Dataset image examples with annotated classes."
    images:
      - url: "/images/projects/cadot/annotation-step1.webp"
      - url: "/images/projects/cadot/annotation-step2.webp"
      - url: "/images/projects/cadot/annotation-step3.webp"
environment: "Docker container with NVIDIA T4 GPU (16GB VRAM)"
---

This project aims to train a deep learning model capable of detecting 14 categories of urban objects in high-resolution aerial images of Paris. Faced with a dataset marked by extreme class imbalance, the central objective was to design advanced data augmentation pipelines (custom Albumentations and Generative AI inpainting) to restore visibility to rare classes.

## Context

Developed as a final project for the Deep Learning course, the topic is based on the IEEE ICIP 2025 international challenge (CADOT Challenge). The main scientific and methodological goal was to explore, implement, and compare the impact of different data augmentation techniques on the performance of an object detection model.

## Data

* **Source and Volume**: Dataset from IGN, comprising 4,628 high-resolution aerial images of the Paris region, totaling 106,691 object annotations (buildings, sports fields, vehicles, etc.).
* **The Technical Challenge**: Vehicles and buildings alone represent over 87% of the annotations. This massive imbalance biases the model, which struggles to detect minority classes such as sports infrastructures.
* **Preprocessing**: Complete conversion and restructuring of annotation files from the native COCO format (single JSON) to the standardized TXT format required by the Ultralytics YOLO ecosystem.

## Methodology

### Step 0: Establishing the Baseline
* **Objective**: Evaluate raw performance without any rebalancing strategy.
* **Method**: Fine-tuning YOLOv11 nano and YOLOv11 medium architectures directly on the original dataset.

### Approach A: Common (Generic) Augmentation
* **Objective**: Increase the overall frequency of rare classes.
* **Method**: Application of a standard Albumentations pipeline (geometric transformations, Gaussian blur, cutouts) applied uniformly to all images containing rare objects.

### Approach B: Specialized Class-Specific Augmentation
* **Objective**: Avoid degrading specific visual characteristics of objects.
* **Method**: Creation of distinct, optimized Albumentations pipelines for each object type.
* **Concrete Example**: Strict exclusion of Gaussian blur for sports fields, as the sharpness of the white ground lines is essential for the model to identify them.

### Approach C: Generative AI Inpainting
* **Objective**: Create new, realistic examples for the rarest class directly within the existing urban context.

**Inpainting Pipeline**:
1. **Selection**: Extraction of a background image batch presenting large areas without objects.
2. **Masking**: Generation of segmentation masks in these empty spaces.
3. **Generation**: Utilizing Stable Diffusion 1.5 and Imagen 3 to generate the rare objects contextually within the masks.
4. **Labeling**: Automatic injection of the new bounding box coordinates into the YOLO annotation files.

| Step 1: Selection | Step 2: Mask | Step 3: Generation | Step 4: Labeling |
| :---: | :---: | :---: | :---: |
| ![](/images/projects/cadot/pipeline-step1.webp) | ![](/images/projects/cadot/pipeline-step2.webp) | ![](/images/projects/cadot/pipeline-step3.webp) | ![](/images/projects/cadot/pipeline-step4.webp) |

## Results

* **Overall Performance**: The Specialized Albumentations approach (Approach B) performed best on the overall score, yielding a gain of +5.5% in mAP50 compared to the YOLOv11m baseline.
* **Minority Class Focus**: The targeted Inpainting approach doubled the recall on the targeted class, from 0.20 to 0.40, accompanied by a +22% increase in mAP.

**Lesson Learned**: Target-class data augmentation improves its detectability. However, in multi-class detection, this gain often comes at the expense of other classes. The overall mAP changes little, which demonstrates that adjusting metrics for rare classes requires making trade-offs on others.
