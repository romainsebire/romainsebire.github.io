---
title: "Early Detection of Writing Disorders using Computer Vision"
tagline: "YOLOv8-pose · MediaPipe · Intel RealSense"
summary: "Reconstructed three-dimensional pen trajectories using computer vision to capture in-air hand movements and support early screening of handwriting disorders."
category: "dl"
domains: ["computer-vision", "data-engineering"]
stack: ["YOLOv8-pose", "MediaPipe", "RealSense SDK", "Qt"]
video: "https://github.com/user-attachments/assets/b3ae6de8-3af9-416c-bd36-fd18b5ec32e5"
featured: true
order: 5
date: "Jan – Feb 2026"
cover: "/images/projects/aviarept/cover.webp"
environment: "Docker (GPU NVIDIA T4)"
---

This project aims to detect early learning writing disorders (such as dysgraphia) in a non-invasive way using video analysis. The system captures and reconstructs the complete 3D trajectory of a pen using synchronized cameras. The major innovation lies in the AI's ability to analyze in-air movements (when the pen does not touch the paper), a crucial motor planning phase that is completely invisible to standard digital tablets. This end-to-end pipeline opens the way to video-based automated clinical screening.

## Context

This project is part of the AVIAREPT research thesis led by Lauren Sismeiro within the EuroMov Digital Health in Motion laboratory (University of Montpellier and IMT Mines Alès). Completed in partnership with Rémy Plastre, this work represents our end-of-studies R&D mission as engineering students specializing in Artificial Intelligence.

* **The Problem**: Dysgraphia affects 5 to 10% of children. Current clinical tests (BHK test on paper) ignore temporal dynamics. Graphics tablets (such as Wacom) capture contact movement but suffer from a critical blind spot with a total loss of signal as soon as the pen is lifted more than 1 cm above the surface.
* **Our Mission**: Technically support the thesis by building a non-invasive hardware and software system capable of tracking 100% of the pen's movements in 3D space to capture these invisible motor markers.

## Data and Acquisition Setup

To capture ground truth and train the models, a rigid acquisition setup was designed in CAD and 3D-printed to freeze the sensor geometry:
* **Video Hardware**: 2 Intel RealSense D435i cameras (RGB and Depth) positioned frontally and in profile on the side opposite the writing hand to avoid occlusions, complemented by 1 Sony webcam targeting the upper body.
* **2D Reference**: 1 Wacom Intuos Pro tablet overlaid with a standard sheet of paper (2D coordinates, pressure, and tilt).
* **3D Reference**: A Qualisys optical Motion Capture (MoCap) system operating at 90 Hz tracking 4 reflective spheres attached to a lightweight 3D-printed mount clipped onto the pen.
* **Hardware Synchronization**: Developed a multithreaded Python master clock running at 30 FPS at 640x480 resolution to simultaneously record all camera feeds and tablet data (roughly 2 GB per minute) without dropping frames despite USB 3.0 bandwidth constraints.

## Methodology

### Challenge 1: Choosing the Ground Truth (MoCap vs Tablet)

To evaluate the accuracy of our 3D reconstruction, we needed a reliable ground truth. Two options were evaluated: the digitizing tablet (highly accurate on contact but limited to 2D) or the optical MoCap system (continuous 3D tracking via infrared spheres, but requiring mathematical extrapolation of the virtual pen tip).

* **Synchronization**: Since 90 Hz MoCap recordings ran on external proprietary software, three post-acquisition temporal alignment and 30 FPS resampling tools were developed (first-contact detection, velocity cross-correlation, and an interactive manual alignment GUI).
* **Observation**: After rigid spatial registration (Kabsch alignment), the absolute precision of the MoCap system proved insufficient for millimetric handwriting strokes, compounded by a non-horizontal table plane and skewed scaling factors between MoCap space and tablet space. The Wacom tablet was therefore selected as the reference for contact writing.

![Wacom vs MoCap trace comparison overlay](/images/projects/aviarept/trace-overlay.webp)

### Challenge 2: 2D Video Tracking and Postural Analysis

The first step in transforming raw pixels into physical coordinates was isolating the pen in the video streams.

* **Pen Tracking**: Trained a custom YOLOv8-pose model on manually annotated images to simultaneously detect a two-keypoint skeleton (pen tip and pen top) across front and profile views. To smooth predictions during rapid strokes, a Kalman filter tuned via Fast Fourier Transform (FFT) spectral analysis with a 10 Hz low-pass cutoff was applied to the extracted keypoint trajectories.
* **Postural Tracking**: In parallel, MediaPipe Pose was deployed to track upper body posture (shoulders, elbows, wrists, head) by mapping 2D keypoints onto the RealSense depth maps, enabling analysis of body stability during writing sessions.

<div class="project__video-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 1rem 0;">
  <video src="https://github.com/user-attachments/assets/d6d95588-55d5-48ef-972d-29ca401858e3" controls class="project__video" style="width: 100%; margin: 0;"></video>
</div>

### Challenge 3: 3D Trajectory Reconstruction

The final hurdle was reconstructing the 3D pen trajectory from the 2D detections in the front and profile camera feeds. We explored and compared two distinct approaches:

* **Deep Learning Approach (MLP)**: A Multi-Layer Perceptron taking the 2D coordinates from both cameras (front and profile) as inputs to directly predict tablet coordinates. While intra-session validation (70% train and 30% test within the same recording) confirmed that the network learns the spatial mapping when cameras remain strictly immobile, Leave-One-Subject-Out cross-validation failed on early sessions recorded before introducing the 3D-printed frame, as micro-movements of the cameras between subjects skewed spatial learning.
* **Geometric Approach (Epipolar Triangulation)**: A computer vision method relying on intrinsic (lens distortion) and extrinsic (rotation and translation matrices) camera calibration using a checkerboard pattern, building on the work of Bruno Henriquès, a PhD student at IMT Mines Alès specializing in this hardware. This geometric approach reconstructs the full 3D trajectory (both contact strokes on paper and in-air pen lifts) without subject-dependent bias.

<video src="https://github.com/user-attachments/assets/a73442ca-a382-4f70-90a6-48f7713e4ff3" controls class="project__video"></video>

## Results

* **YOLOv8-pose Tracking Accuracy**: The model achieves a mAP@50 above 0.93 with a median localization error of 3.28 pixels (mean absolute error MAE of 4.31 pixels and RMSE of 6.09 pixels in Leave-One-Subject-Out validation across 5 subjects), ensuring reliable tracking of the pen tip and top.
* **Kinematic Validation against the Tablet**: Comparing the camera-reconstructed trajectory against the Wacom ground truth yielded a mean absolute error (MAE) of 14.65 pixels, a tremor Jitter Ratio of 1.03x, closely matched angular velocity (0.36 vs 0.33 rad/frame), and a velocity profile correlation of 0.535, validating the feasibility of vision-based kinematic analysis.
