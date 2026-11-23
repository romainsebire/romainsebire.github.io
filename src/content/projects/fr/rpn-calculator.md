---
title: "Calculatrice RPN (Notation Polonaise Inverse) : Architecture MVC"
tagline: "Java · JavaFX · Architecture MVC"
summary: "Développement d'une calculatrice scientifique en notation polonaise inverse sous JavaFX reposant sur une architecture logicielle modulaire qui sépare strictement l'interface du moteur de calcul."
category: "dev"
domains: ["software-engineering"]
stack: ["Java", "JavaFX", "MVC"]
github: "https://github.com/romainsebire/rpn-calculator-javafx"
order: 14
date: "Octobre 2024"
cover: "/images/projects/rpn-calculator/cover.webp"
video: "https://github.com/user-attachments/assets/3f1e05e4-285f-41ec-8995-93b09673e9c2"
featured: false
environment: "JavaFX GUI (Local CPU)"
---

Ce projet d'ingénierie logicielle consistait à développer une calculatrice de bureau inspirée des célèbres calculatrices scientifiques HP, utilisant la notation polonaise inverse. Au-delà de l'algorithmique mathématique, le cœur du projet résidait dans l'implémentation d'une architecture MVC (Modèle-Vue-Contrôleur) stricte. Grâce à la définition de contrats d'interfaces clairs, l'application est totalement découplée : il est possible de remplacer l'interface graphique JavaFX par une interface console (ou par la Vue codée par un autre développeur) sans avoir à modifier une seule ligne de la logique métier.

## Contexte

Réalisé à l'IMT Mines Alès dans le cadre du projet d'évaluation de l'UE Génie Logiciel.

La notation polonaise inverse (où l'on saisit les opérandes avant l'opérateur, ex: 3 4 + au lieu de 3 + 4) a été choisie car elle se prête parfaitement à une modélisation orientée objet autour de la structure de données en Piles. Le défi majeur imposé par le cahier des charges était l'interopérabilité : chaque étudiant devait pouvoir \"brancher\" la Vue d'un camarade de classe sur son propre Modèle/Contrôleur sans provoquer d'erreurs de compilation.

## Architecture

Pour garantir cette interopérabilité, le projet a été architecturé autour d'interfaces Java agissant comme des contrats stricts entre les différentes couches :
* **Le Modèle (Logique Métier)** : Gère l'accumulateur (la saisie en cours sous forme de chaîne de caractères) et la pile d'opérandes via une structure Stack (LIFO). Il encapsule toute l'intelligence mathématique et les mécanismes de sécurité de l'application (ex: levée d'exceptions métier lors d'une tentative de division par zéro).
* **La Vue (Interface Utilisateur)** : Développée en JavaFX. Elle utilise une disposition en GridPane pour l'alignement responsive des boutons du pavé numérique et des opérateurs. Elle ne fait aucun calcul, elle se contente d'afficher l'état que le Modèle lui transmet.
* **Le Contrôleur (Gestion des Événements)** : Agit comme le chef d'orchestre. Il écoute les actions de l'utilisateur (clics sur les boutons de la Vue) et traduit ces événements en appels de méthodes compréhensibles par le Modèle.

## Méthodologie

Le cycle de vie d'un calcul dans cette architecture logicielle illustre parfaitement le flux de données unidirectionnel du pattern MVC :
1. **Saisie (Vue)** : L'utilisateur saisit un nombre via l'interface graphique ou ses touches clavier physiques. Le Contrôleur intercepte l'événement (KeyEvent ou ActionEvent).
2. **Mise à jour (Contrôleur -> Modèle)** : Le Contrôleur demande au Modèle d'ajouter ce nombre à l'accumulateur temporaire.
3. **Empilement** : L'utilisateur valide (Entrée). Le Modèle convertit la chaîne de l'accumulateur en nombre (Double) et le pousse au sommet de la pile LIFO.
4. **Calcul** : L'utilisateur presse un opérateur (ex: +). Le Contrôleur transmet l'ordre. Le Modèle dépile les deux derniers opérandes, effectue l'addition, et empile le résultat au sommet.
5. **Rendu (Modèle -> Vue)** : À chaque modification, le Modèle notifie la Vue qu'un changement a eu lieu. La Vue se rafraîchit en lisant le nouvel état de la pile pour afficher le résultat à l'écran.

## Résultats

* **Réactivité & Ergonomie** : Une application de bureau légère, réactive et robuste. Le doublage de l'interface graphique par un écouteur d'événements clavier permet une utilisation fluide pour les habitués du pavé numérique physique.
* **Architecture Plug-and-Play** : L'objectif pédagogique et architectural a été validé avec succès. Le remplacement complet de l'interface JavaFX par une Vue tierce respectant l'interface Java définie, s'effectue sans aucune altération de la logique mathématique de l'application.
