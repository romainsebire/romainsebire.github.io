---
title: "Combinatorial Optimization & Intervention Scheduling"
tagline: "Genetic algorithm · Simulated annealing · CP-SAT"
summary: "Modeled and solved a complex telecom technician scheduling problem under strict constraints by comparing constraint programming against evolutionary metaheuristics."
category: "dev"
domains: ["combinatorial-optimization", "software-engineering"]
stack: ["Python", "OR-Tools", "CP-SAT", "Genetic Algorithm", "Simulated Annealing"]
github: "https://github.com/romainsebire/RoadefChallenge2007"
venue: "Roadef 2007"
featured: false
order: 7
date: "Oct – Dec 2025"
cover: "/images/projects/roadef/cover.webp"
environment: "Local CPU"
---

This project tackles the ROADEF 2007 challenge (based on a real France Telecom problem) involving modeling and solving a resource-constrained personnel scheduling problem (NP-hard). The goal is to assign technicians to teams and schedule interventions to minimize delays according to a strict priority order. To achieve this, we designed a two-level resolution architecture (separating treatment ordering from temporal allocation) and implemented four distinct resolution engines. The Genetic Algorithm emerged as the most robust and performant solution at scale compared to the computational limits of Constraint Programming (CP-SAT).

## Context

This work was completed in a team (Romain Sebire, Pauline Rougeot, Remy Plastre). The proposed problem combines two classic challenges in operations research: team building and resource-constrained project scheduling. The goal of our implementation was to evaluate different algorithmic approaches on datasets of varying sizes (Set A = small/medium instances, Set B = large instances), under a strict execution time limit of 5 minutes per instance.

## Architecture

The problem requires mathematically modeling a dense operational reality:
* **Resources (Technicians)**: Each possesses specific skill levels in different areas and a calendar of unavailability (leave).
* **Tasks (Interventions)**: Defined by a duration, a priority level (1 to 4), strict skill requirements for the team, and precedence constraints (intervention A must be completed before B can start).
* **Objective Function (Score)**: Minimize a weighted sum of intervention completion dates by priority level. The formula heavily penalizes delays in high-priority tasks:

<div style="text-align: center; margin: 0.75rem 0;">
  <span style="display: inline-block; font-family: var(--font-mono); font-size: 1rem; padding: 0.45rem 0.9rem; background: var(--bg-2); border-radius: var(--radius-sm); border: 1px solid var(--hairline-2); color: var(--ink);">
    Score = 28 &times; T<sub>1</sub> + 14 &times; T<sub>2</sub> + 4 &times; T<sub>3</sub> + T<sub>4</sub>
  </span>
</div>

*(Where T<sub>p</sub> is the latest completion date among all priority p interventions).*

## Methodology

To prevent algorithms from getting lost in an infinite search space, the key engineering decision was to design a two-level architecture. The metaheuristics (Level 1) only optimize the sequence order of the interventions. This order is then passed to a greedy algorithm (Level 2) that constructs the physical schedule and computes the score. On this basis, 4 resolution engines were developed and compared:

### Approach 1: Baseline (Greedy)
* **Objective**: Obtain a quick upper bound and verify the validity of the schedule builder.
* **Method**: Simply sorts interventions by priority, then by duration, and assigns them as soon as resources are available. Very fast, but blind to global optimizations.

### Approach 2: Exact Method (CP-SAT)
* **Objective**: Find the mathematically perfect (optimal) solution using Constraint Programming.
* **Method**: Complete modeling of the problem in integer and boolean variables under Google's solver. The tool explores the decision tree by pruning invalid branches.

### Approach 3: Simulated Annealing
* **Objective**: Introduce a metaheuristic capable of exploring the space of intervention sequences without getting stuck in a local optimum.
* **Method**: Altering the sequence of interventions (permutations, insertions, inversions). Implementation of an adaptive reheat mechanism that restarts exploration when the algorithm stagnates.

### Approach 4: Genetic Algorithm
* **Objective**: Use a population-based approach to mix a maximum number of good sub-sequences.
* **Method**: Creating a population of intervention sequences. Using tournament selection, scheduling-specific crossovers to avoid breaking precedence constraints, and an elitism mechanism to preserve the best solutions from one generation to the next.

## Results

The algorithms were tested on 20 official instances (10 Set A, 10 Set B) with a time budget of 300 seconds. The results of all solvers on each instance can be found in the GitHub repository. **(Note: Lower scores are better).**

| Solver | Overall Performance Relative to the Best | Observed Advantages / Limitations |
| :--- | :--- | :--- |
| **Genetic Algorithm** | **Winner (Reference Score)** | The diversity of the population allows it to dominate heavily on large instances (Set B). |
| Simulated Annealing | + 7.9% | Wins several small instances (Set A) but struggles on very large search spaces. |
| CP-SAT (OR-Tools) | Incomplete | Finds the guaranteed optimal solution on small instances (Set A). Memory and time consumption exploded on 8 out of 10 large instances (Set B) due to constraint graph complexity. |
| Greedy Baseline | + 696% | Ultra-fast but provides solutions 7 to 8 times less optimal. |

**Lesson Learned**: Exact mathematical solvers (CP-SAT) are unbeatable on modest-sized problems, but when facing the combinatorial explosion of a real large-scale problem, well-modeled metaheuristics (Genetic and Simulated Annealing) remain the only viable solutions to obtain excellent results within a constrained time (300 seconds).
