---
title: "Hospital Queue Optimization using Reinforcement Learning"
tagline: "Maskable PPO · Gymnasium"
summary: "Applied reinforcement learning to dynamically assign hospital patients to doctors in real time, reducing waiting times while respecting scheduled appointments."
category: "dl"
domains: ["reinforcement-learning", "combinatorial-optimization"]
stack: ["Python", "Stable-Baselines3", "Maskable PPO", "Gymnasium", "PyTorch", "Docker"]
github: "https://github.com/romainsebire/queue_scheduling_under_uncertainties"
featured: true
order: 4
date: "February 2026"
cover: "/images/projects/rl-queue-scheduling/cover.webp"
environment: "Docker container with NVIDIA T4 GPU (16GB VRAM)"
---

This project applies deep reinforcement learning (Deep RL) to optimize the dynamic, real-time allocation of patients to doctors in a complex hospital environment. The goal is to maximize a composite score balancing three critical factors: waiting time reduction, strict adherence to appointment schedules, and service rates. By transforming an initially massive and complex action space into an optimized "semantic" space, the RL agent increased the hospital management score from 45% to 92.5%, while demonstrating high robustness against unpredictable variations in patient flow.

## Context

This project was carried out as part of the Reinforcement Learning course at IMT Mines Ales. Completed in collaboration with Kungsamreth SOK and Setthika SUN, it is based on Lois Trassoudaine's PhD work regarding the hybridization of AI and Operations Research approaches for resource allocation. The main challenge was to prove that an RL agent could outperform traditional scheduling algorithms and adapt in real time.

## Data

Unlike classic ML projects based on static datasets, this project relies on a stochastic simulator (Gymnasium) simulating a full day of hospital activity.

* **Environment Constraints**: Managing a high flow of patients (both walk-ins and scheduled appointments) with doctors having heterogeneous skill sets (a doctor cannot perform all medical tasks).
* **Evaluation**: The agent's evaluation is a composite score balancing waiting time (<em>G<sub>w</sub></em>), appointment time adherence (<em>G<sub>a</sub></em>), and service rate (<em>G<sub>s</sub></em>). The exact formula to maximize is:

<div style="text-align: center; margin: 0.75rem 0;">
  <span style="display: inline-block; font-family: var(--font-mono); font-size: 1rem; padding: 0.45rem 0.9rem; background: var(--bg-2); border-radius: var(--radius-sm); border: 1px solid var(--hairline-2); color: var(--ink);">
    Score = 0.4 &times; G<sub>w</sub> + 0.4 &times; G<sub>a</sub> + 0.2 &times; G<sub>s</sub>
  </span>
</div>

## Methodology

### Baseline: Naive Allocation
Before introducing artificial intelligence, an allocation method based on human logical rules was established as a benchmark. This solution reproduces the intuitive behavior a human hospital manager would adopt:
1. As soon as a doctor (server) becomes free, the algorithm applies a skills filter: it isolates only the patients in the queue whose medical task matches the doctor's actual skills.
2. Among these eligible patients, the algorithm applies a greedy priority rule: it gives absolute priority to the patient closest to their appointment time (to maximize punctuality) or, otherwise, the walk-in patient who has waited the longest (First-In, First-Out / FIFO rule).

### Approach A: Selection by Patient ID in the Queue
In this first attempt, the agent tries to manually sort the queue by designating a specific individual to be treated.
* **Action Space (51 possible actions)**: The agent has 50 actions corresponding to the fixed indices of the first 50 patients in the queue, plus a 51st action to wait (HOLD).
* **Features (300D Vector)**: The agent observes the full state in the form of a large matrix of 50 patients, each described by 6 key features (accumulated waiting time, medical task ID, appointment status, time delta relative to appointment, estimated treatment time, and walk-out risk level).
* **Limitations**: The environment is too dynamic. As soon as a patient is served, the queue shifts, breaking the logical link between a fixed index and a correct decision by the agent.

### Approach B: Selection by Medical Task Type
To abstract away from individuals, the agent now focuses on the type of medical task to be performed, leaving a heuristic rule to select the longest-waiting patient within the selected category.
* **Action Space (32 possible actions)**: The agent can choose from 30 actions representing a specific medical task to assign to a walk-in patient, 1 global action to treat the most relevant scheduled appointment, and 1 action to wait (HOLD).
* **Features (94D Vector)**: For each task, the agent tracks 3 metrics (number of waiting patients, maximum waiting time, and current doctor's efficiency index). Added to this are 4 macro-hospital features (number of waiting appointments, maximum delay observed, simulation time, and available server ID).

### Approach C: Selection by Global Priority Mode
The agent moves to a higher level of abstraction: it no longer chooses the task, but defines the hospital's strategy at any given moment (e.g., handling emergencies or clearing the general queue), while a mathematical solver calculates each patient's priority score.
* **Action Space (3 possible actions)**: The space is reduced to the extreme with 3 choices: absolute priority to appointments, priority to walk-ins, or wait (HOLD).
* **Features (152D Vector)**: The agent has a broad overview detailing the 30 tasks of the facility through 5 precise indicators (walk-in volume, max walk-in waiting time, scheduled appointment volume, max delay on appointments, and doctor skill level).

### Approach D: Priority Mode Selection with Reduced Features
The final approach gives the agent a strategic decision-making role: it directly selects a behavioral management rule from four interpretable options, and the environment applies this rule to the ideal patient.
* **Action Space (4 possible actions)**: The agent chooses between 4 scheduling strategies: serve the most urgent appointment, prioritize the longest-waiting patient in the queue, optimize throughput by taking the fastest patient to treat, or wait (HOLD).
* **Features (Optimized 22D Vector)**: Thanks to this modeling, the observation space is drastically compressed. The agent no longer scans the entire queue, but only analyzes the characteristics of the top 3 virtual candidates pre-selected by each strategy (5 features per candidate: waiting time, estimated service time, appointment status, time delta relative to appointment, urgency score). The vector is completed by 7 global variables (queue size, simulation time, availability, etc.).

## Results

The final evaluation over 50 test days shows the clear superiority of the reinforcement learning approach when the action space is modeled correctly.

| Technical Configuration | Agent's Choice Type | Action Space Size | Feature Dimension | Final Score |
| :--- | :--- | :---: | :---: | :---: |
| Baseline | Fixed domain rules + Filter | - | - | 45% |
| Approach A | Patient index in the queue | 51 actions | 300 variables | 60.3% |
| Approach B | Medical task type | 32 actions | 94 variables | 70.6% |
| Approach C | Global priority mode | 3 actions | 152 variables | **90.4%** |
| Approach D | Approach C + Reduced dimension | 4 actions | 22 variables | **92.5%** |

* **Generalization and Robustness**: When subjected to significant variations (unplanned spikes in walk-in patient arrivals), the semantic PPO agent maintains stability and proves its ability to adapt in real time where fixed rules collapse.
* **Action Space Size**: Reducing the action space and the number of features to the bare minimum allows the agent to converge faster and toward a more performant allocation policy.
