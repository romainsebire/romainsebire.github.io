---
title: "Age of War : Jeu de Stratégie 2D en Temps Réel"
tagline: "Java · Swing · XML"
summary: "Recréation du jeu de stratégie en temps réel Age of War en Java Swing, premier projet de programmation orientée objet avec boucle temps réel, configuration XML et adversaire autonome."
category: "dev"
domains: ["software-engineering"]
stack: ["Java", "Swing", "XML", "OOP"]
github: "https://github.com/romainsebire/age-of-war-java"
order: 15
date: "Déc. 2023 – Janv. 2024"
cover: "/images/projects/age-of-war/cover.webp"
video: "https://github.com/user-attachments/assets/2ffb48de-e79f-406e-a7f6-418c204debd6"
featured: false
environment: "Java Swing GUI (Local CPU)"
---

Premier projet de programmation réalisé au début du cycle ingénieur, ce travail consistait à recréer en Java le jeu de stratégie en temps réel "Age of War". Dans ce jeu en 1 contre 1, le joueur gère son or pour recruter trois types d'unités, défendre sa base et faire évoluer sa civilisation à travers trois ères face à un adversaire géré par l'ordinateur. Ce choix de sujet ambitieux pour des débutants a permis de pratiquer concrètement la programmation orientée objet, les timers Swing, le chargement de données XML et l'affichage de sprites en 2D.

## Contexte

Ce projet académique a été réalisé en binôme à l'IMT Mines Alès dans le cadre de l'UE Application à la Programmation Objets (APO). L'objectif était de livrer une première application graphique complète et jouable en Java, en mettant en pratique l'héritage, la gestion d'événements et la structuration d'un projet en plusieurs classes.

## Architecture et données

Le jeu s'articule autour de sept classes Java (fenêtre et HUD, plateau et timers, chargement des données, bases et unités) associées à un fichier de configuration externe :

* **Hiérarchie orientée objet** : modélisation des bases et des unités (dont une sous-classe dédiée aux unités ennemies inversant le sens de déplacement et l'affichage des dégâts).
* **Paramètres isolés en XML (`characters.xml`)** : les statistiques des unités et des bases (points de vie, dégâts, portée, coût, récompense en or et dimensions des sprites) sont externalisées dans un fichier XML pour pouvoir ajuster l'équilibrage facilement sans modifier le code Java.

## Fonctionnement

### Phase A : Chargement XML et initialisation
Au démarrage, `GameData` parcourt `characters.xml` via le parseur DOM standard de Java (`javax.xml.parsers`) pour charger en mémoire toutes les caractéristiques des 3 types d'unités et des bases sur les 3 ères.

### Phase B : Boucle de jeu cadencée
L'animation et la logique temps réel reposent sur plusieurs `javax.swing.Timer` pilotés par `GameBoard` :
1. Déplacement continu des unités sur la ligne de front et blocage au contact des unités ou de la base adverse.
2. Résolution périodique des combats selon la portée de chaque unité, attribution de l'or en cas d'élimination et vérification de fin de partie.
3. Revenu d'or régulier et évolution des bases lorsqu'une nouvelle ère est débloquée.

### Phase C : Affichage graphique et bande-son
Le rendu s'appuie sur Java Swing avec redéfinition de `paintComponent` pour afficher le décor, les bases et les sprites des unités, complété par des compteurs HUD (or, points de vie des bases), l'affichage temporaire des dégâts infligés et une musique de fond via `javax.sound.sampled`.

### Phase D : Adversaire automatisé
Pour permettre des parties en solo au rythme progressif, l'adversaire génère des vagues d'unités de manière probabiliste (dans la limite de 5 unités ennemies actives simultanément) et déclenche son passage aux ères 2 et 3 sur des délais aléatoires.

## Résultats et recul technique

* **Jeu complet et jouable** : les 3 ères d'évolution, les 3 classes d'unités (corps à corps, distance, tank), la boutique et les écrans de victoire, défaite et relance fonctionnent de bout en bout.
* **Recul sur l'architecture** : avec le recul de fin de cursus, ce premier projet couple encore directement les entités métier aux composants graphiques Swing (`JPanel`) et base les déplacements sur des coordonnées et tailles d'images fixes. C'est précisément ce constat qui a guidé les projets logiciels suivants, comme la [Calculatrice RPN en JavaFX](/projects/rpn-calculator), conçue avec une séparation MVC stricte par interfaces.
