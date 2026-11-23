---
title: "Optimisation Combinatoire & Planification d'Interventions"
tagline: "Algorithme génétique · Recuit simulé · CP-SAT"
summary: "Modélisation et résolution d'un problème complexe de planification de techniciens télécom sous contraintes en comparant la programmation par contraintes et des algorithmes évolutionnaires."
category: "dev"
domains: ["combinatorial-optimization", "software-engineering"]
stack: ["Python", "OR-Tools", "CP-SAT", "Genetic Algorithm", "Simulated Annealing"]
github: "https://github.com/romainsebire/RoadefChallenge2007"
venue: "Roadef 2007"
featured: false
order: 7
date: "Oct. – Déc. 2025"
cover: "/images/projects/roadef/cover.webp"
environment: "Local CPU"
---

Ce projet relève le défi du ROADEF 2007 (basé sur un problème réel de France Télécom) consistant à modéliser et résoudre un problème d'ordonnancement de personnel sous contraintes (NP-difficile). L'objectif est d'affecter des techniciens à des équipes et de planifier des interventions pour minimiser les retards selon un ordre de priorité strict. Pour y parvenir, nous avons conçu une architecture de résolution à deux niveaux (séparant l'ordre de traitement de l'allocation temporelle) et implémenté quatre moteurs de résolution distincts. L'Algorithme Génétique s'est imposé comme la solution la plus robuste et performante à grande échelle face aux limites calculatoires de la Programmation par Contraintes (CP-SAT).

## Contexte

Ce travail a été réalisé en équipe (Romain Sebire, Pauline Rougeot, Rémy Plastre). Le problème proposé mêle deux défis classiques de la recherche opérationnelle : la formation d'équipes et la planification de projet sous contraintes de ressources. L'enjeu de notre implémentation était d'évaluer différentes approches algorithmiques sur des jeux de données de tailles variables (Set A = petites/moyennes instances, Set B = grandes instances), avec une contrainte de temps d'exécution stricte de 5 minutes par instance.

## Architecture

Le problème impose de modéliser mathématiquement une réalité opérationnelle dense :
* **Ressources (Techniciens)** : Chacun possède des niveaux de compétences spécifiques dans différents domaines et un calendrier d'indisponibilités (congés).
* **Tâches (Interventions)** : Définies par une durée, un niveau de priorité (1 à 4), des prérequis de compétences stricts pour l'équipe, et des contraintes de précédence (l'intervention A doit être finie avant la B).
* **Fonction Objectif (Score)** : Minimiser une somme pondérée des dates de fin des interventions par niveau de priorité. La formule pénalise lourdement le retard des tâches prioritaires :

<div style="text-align: center; margin: 0.75rem 0;">
  <span style="display: inline-block; font-family: var(--font-mono); font-size: 1rem; padding: 0.45rem 0.9rem; background: var(--bg-2); border-radius: var(--radius-sm); border: 1px solid var(--hairline-2); color: var(--ink);">
    Score = 28 &times; T<sub>1</sub> + 14 &times; T<sub>2</sub> + 4 &times; T<sub>3</sub> + T<sub>4</sub>
  </span>
</div>

*(Où T<sub>p</sub> est la date de fin la plus tardive parmi toutes les interventions de priorité p).*

## Méthodologie

Pour éviter que les algorithmes ne se perdent dans un espace de recherche infini, la décision clé d'ingénierie a été de concevoir une architecture à deux niveaux. Les métaheuristiques (Niveau 1) ne cherchent qu'à optimiser la séquence d'ordre des interventions. Cet ordre est ensuite passé à un algorithme glouton (Niveau 2) qui construit le planning physique et calcule le score. Sur cette base, 4 moteurs de résolution ont été développés et comparés :

### Approche 1 : Baseline (Greedy)
* **Objectif** : Obtenir une borne supérieure rapide et vérifier la validité du constructeur de planning.
* **Méthode** : Trie simplement les interventions par priorité, puis par durée, et les assigne dès que les ressources sont disponibles. Très rapide, mais aveugle face aux optimisations globales.

### Approche 2 : Méthode Exacte (CP-SAT)
* **Objectif** : Trouver la solution mathématiquement parfaite (optimale) en utilisant la Programmation par Contraintes.
* **Méthode** : Modélisation intégrale du problème en variables entières et booléennes sous le solveur de Google. L'outil explore l'arbre des possibles en coupant les branches invalides.

### Approche 3 : Recuit Simulé
* **Objectif** : Introduire une métaheuristique capable d'explorer l'espace des séquences d'interventions sans rester bloquée dans un optimum local.
* **Méthode** : Altération de la séquence d'interventions (permutations, insertions, inversions). Implémentation d'un mécanisme de \"réchauffement adaptatif\" (adaptive reheat) qui relance l'exploration lorsque l'algorithme stagne.

### Approche 4 : Algorithme Génétique
* **Objectif** : Utiliser une approche populationnelle pour brasser un maximum de bonnes sous-séquences.
* **Méthode** : Création d'une population de séquences d'interventions. Utilisation de la sélection par tournoi, de croisements spécifiques à l'ordonnancement pour ne pas briser les contraintes de précédence, et d'un mécanisme d'élitisme pour conserver les meilleures solutions d'une génération à l'autre.

## Résultats

Les algorithmes ont été testés sur 20 instances officielles (10 Set A, 10 Set B) avec un budget temps de 300 secondes. Les résultats de tous les solveurs sur chaque instance se trouvent sur le répertoire github. **(Rappel : Plus le score est bas, meilleur il est).**

| Solveur | Performance globale par rapport au meilleur | Avantages / Limites constatées |
| :--- | :--- | :--- |
| **Algorithme Génétique** | **Vainqueur (Score de Référence)** | La diversité de la population lui permet de dominer largement sur les grandes instances (Set B). |
| Recuit Simulé | + 7.9 % | Remporte plusieurs petites instances (Set A) mais peine sur les très grands espaces. |
| CP-SAT (OR-Tools) | Incomplet | Trouve la solution optimale garantie sur les petites instances (Set A). Explose en mémoire et en temps sur 8 des 10 grandes instances (Set B) en raison de la complexité du graphe de contraintes. |
| Baseline Gloutonne | + 696 % | Ultra-rapide mais fournit des solutions 7 à 8 fois moins optimales. |

**Leçon Apprise** : Les solveurs mathématiques exacts (CP-SAT) sont imbattables sur des problèmes de taille modeste, mais face à l'explosion combinatoire d'un problème réel à grande échelle, les métaheuristiques bien modélisées (Génétique et Recuit Simulé) restent les seules solutions viables pour obtenir d'excellents résultats en un temps contraint (300 secondes).
