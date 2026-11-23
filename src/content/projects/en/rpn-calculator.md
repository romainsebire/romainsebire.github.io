---
title: "RPN Calculator (Reverse Polish Notation): MVC Architecture"
tagline: "Java · JavaFX · MVC Architecture"
summary: "Developed a Reverse Polish Notation scientific calculator in JavaFX built around a modular architecture that strictly decouples the user interface from the calculation engine."
category: "dev"
domains: ["software-engineering"]
stack: ["Java", "JavaFX", "MVC"]
github: "https://github.com/romainsebire/rpn-calculator-javafx"
order: 14
date: "October 2024"
cover: "/images/projects/rpn-calculator/cover.webp"
video: "https://github.com/user-attachments/assets/3f1e05e4-285f-41ec-8995-93b09673e9c2"
featured: false
environment: "JavaFX GUI (Local CPU)"
---

This software engineering project involved developing a desktop calculator inspired by famous HP scientific calculators using reverse polish notation. Beyond the mathematical algorithmics, the core of the project lay in implementing a strict Model-View-Controller (MVC) architecture. By defining clear interface contracts, the application is completely decoupled: the JavaFX graphical interface can be replaced with a console interface (or with a View coded by another developer) without modifying a single line of business logic.

## Context

Completed at IMT Mines Ales as part of the Software Engineering course evaluation.

Reverse Polish Notation (where operands are entered before the operator, e.g., 3 4 + instead of 3 + 4) was chosen because it lends itself perfectly to object-oriented modeling around Stack data structures. The major challenge set by the specifications was interoperability: each student had to be able to plug a classmate's View into their own Model/Controller without causing compilation errors.

## Architecture

To ensure this interoperability, the project was architected around Java interfaces acting as strict contracts between the different layers:
* **The Model (Business Logic)**: Manages the accumulator (the current input as a string) and the operand stack via a LIFO Stack structure. It encapsulates all mathematical logic and application safety mechanisms (e.g., throwing business exceptions during a division-by-zero attempt).
* **The View (User Interface)**: Developed in JavaFX. It uses a GridPane layout for responsive alignment of keypad buttons and operators. It performs no calculations; it simply displays the state transmitted by the Model.
* **The Controller (Event Handling)**: Acts as the coordinator. It listens to user actions (clicks on the View's buttons) and translates these events into method calls understandable by the Model.

## Methodology

The life cycle of a calculation in this software architecture perfectly illustrates the unidirectional data flow of the MVC pattern:
1. **Input (View)**: The user enters a number via the graphical interface or physical keyboard keys. The Controller intercepts the event (KeyEvent or ActionEvent).
2. **Update (Controller -> Model)**: The Controller requests the Model to add this number to the temporary accumulator.
3. **Pushing**: The user submits (Enter). The Model converts the accumulator string into a number (Double) and pushes it to the top of the LIFO stack.
4. **Calculation**: The user presses an operator (e.g., +). The Controller transmits the command. The Model pops the top two operands, performs the addition, and pushes the result back to the top.
5. **Rendering (Model -> View)**: With each modification, the Model notifies the View that a change has occurred. The View refreshes by reading the new state of the stack to display the result on screen.

## Results

* **Responsiveness & Ergonomics**: A lightweight, responsive, and robust desktop application. Combining the GUI with a keyboard event listener allows for fluid use by those accustomed to a physical keypad.
* **Plug-and-Play Architecture**: The pedagogical and architectural goal was successfully validated. Replacing the JavaFX interface entirely with a third-party View implementing the defined Java interface is done without any alteration to the mathematical logic of the application.
