---
title: "Age of War: 2D Real-Time Strategy Game"
tagline: "Java · Swing · XML"
summary: "Recreated the real-time strategy game Age of War in Java Swing as a first object-oriented programming project featuring a timed game loop, external XML balancing, and an automated opponent."
category: "dev"
domains: ["software-engineering"]
stack: ["Java", "Swing", "XML", "OOP"]
github: "https://github.com/romainsebire/age-of-war-java"
order: 15
date: "Dec 2023 – Jan 2024"
cover: "/images/projects/age-of-war/cover.webp"
video: "https://github.com/user-attachments/assets/2ffb48de-e79f-406e-a7f6-418c204debd6"
featured: false
environment: "Java Swing GUI (Local CPU)"
---

Built as my very first coding project at the start of the engineering program, this assignment recreated the classic real-time strategy game "Age of War" in Java. In this 1v1 game, the player manages gold to recruit three unit types, defend their base, and evolve their civilization across three eras against a computer-controlled opponent. Choosing an ambitious real-time 2D game early on provided hands-on practice with object-oriented programming, Swing timers, XML data loading, and sprite rendering.

## Context

This academic project was completed in pairs at IMT Mines Alès for the Object-Oriented Programming Application (APO) course. The goal was to build a complete, playable desktop game in Java from scratch while practicing inheritance, event handling, and multi-class organization.

## Architecture and Data

The game is organized into seven Java classes (window and HUD, board and timers, XML data loader, bases, and units) backed by an external configuration file:

* **Object-Oriented Modeling**: Classes for bases and units, including a dedicated subclass for enemy units that reverses movement direction and damage display.
* **Isolated XML Parameters (`characters.xml`)**: All unit and base stats (health points, damage, range, cost, gold loot, and sprite dimensions) are kept outside the Java source code in an XML file so game balance can be tuned without recompiling.

## Methodology

### Phase A: XML Parsing and Initialization
At startup, `GameData` reads `characters.xml` with Java's standard DOM parser (`javax.xml.parsers`) to load stats and asset metadata for all 3 unit types and both bases across the 3 eras.

### Phase B: Timed Game Loop
Real-time movement and combat are driven by `javax.swing.Timer` instances orchestrated in `GameBoard`:
1. Continuous movement of units along the battlefield with front-line collision checks against opposing units and bases.
2. Periodic combat resolution based on each unit's range, gold rewards on elimination, and victory or defeat detection.
3. Passive gold income and base replacement when advancing to a new era.

### Phase C: Swing Rendering and Audio
Visual rendering overrides `paintComponent` in Java Swing to draw the background, bases, and unit sprites, paired with live HUD labels (gold and base HP), floating damage indicators, and looping background audio via `javax.sound.sampled`.

### Phase D: Automated Opponent
To support solo play with progressive pacing, the computer opponent spawns enemy waves probabilistically (capped at 5 active enemy units on screen) and triggers transitions to eras 2 and 3 on randomized timers.

## Results and Retrospective

* **Complete Playable Game**: All 3 eras, 3 unit classes (melee, ranged, tank), economy mechanics, and win, loss, and replay flows work end to end.
* **Architectural Retrospective**: Looking back with more engineering experience, this first Java project still couples game entities directly to Swing components (`JPanel`) and relies on fixed window coordinates and sprite widths for movement and collisions. Those lessons directly informed later software projects such as the [JavaFX RPN Calculator](/en/projects/rpn-calculator), built around a strict interface-based MVC architecture.
