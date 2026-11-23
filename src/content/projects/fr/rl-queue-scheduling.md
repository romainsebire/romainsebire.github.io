---
title: "Optimisation des Files d'Attente d'Hôpital par Apprentissage par Renforcement"
tagline: "Maskable PPO · Gymnasium"
summary: "Application de l'apprentissage par renforcement pour affecter dynamiquement les patients aux médecins d'un hôpital afin de réduire le temps d'attente et respecter les horaires de rendez-vous."
category: "dl"
domains: ["reinforcement-learning", "combinatorial-optimization"]
stack: ["Python", "Stable-Baselines3", "Maskable PPO", "Gymnasium", "PyTorch", "Docker"]
github: "https://github.com/romainsebire/queue_scheduling_under_uncertainties"
featured: true
order: 4
date: "Février 2026"
cover: "/images/projects/rl-queue-scheduling/cover.webp"
environment: "Conteneur docker avec GPU NVIDIA T4 (16Go VRam)"
---

Ce projet applique l'apprentissage par renforcement profond (Deep RL) pour optimiser l'affectation dynamique et en temps réel des patients aux médecins au sein d'un environnement hospitalier complexe. L'objectif est de maximiser un score composite combinant trois facteurs critiques : la réduction du temps d'attente, le respect strict des horaires de rendez-vous et le taux de service. En transformant un espace d'actions initialement lourd et complexe en un espace "sémantique" optimisé, l'agent RL a fait bondir le score de gestion hospitalière de 45 % à 92,5 %, tout en démontrant une forte robustesse face aux variations imprévisibles de flux de patients.

## Contexte

Ce projet s'inscrit dans le cadre de l'UE Reinforcement Learning de l'IMT Mines Alès. Réalisé en équipe avec Kungsamreth SOK et Setthika SUN, il s'appuie sur les travaux de thèse de Loïs Trassoudaine concernant l'hybridation des approches d'IA et de Recherche Opérationnelle pour l'allocation de ressources. Le défi principal était de prouver qu'un agent RL pouvait surpasser les algorithmes traditionnels d'ordonnancement pour s'adapter en temps réel.

## Données

Contrairement aux projets de ML classiques basés sur des datasets figés, ce projet repose sur un simulateur stochastique (Gymnasium) simulant une journée complète d'activité hospitalière.

* **Contraintes de l'environnement** : Gestion d'un flux élevé de patients (avec et sans rendez-vous) avec des médecins possédant des compétences hétérogènes (un médecin ne peut pas effectuer toutes les tâches).
* **Evaluation** : L'évaluation de l'agent est un score composite équilibrant le temps d'attente (<em>G<sub>w</sub></em>), le respect de l'heure des rendez-vous (<em>G<sub>a</sub></em>) et le taux de service (<em>G<sub>s</sub></em>). La formule exacte à maximiser est :

<div style="text-align: center; margin: 0.75rem 0;">
  <span style="display: inline-block; font-family: var(--font-mono); font-size: 1rem; padding: 0.45rem 0.9rem; background: var(--bg-2); border-radius: var(--radius-sm); border: 1px solid var(--hairline-2); color: var(--ink);">
    Score = 0.4 &times; G<sub>w</sub> + 0.4 &times; G<sub>a</sub> + 0.2 &times; G<sub>s</sub>
  </span>
</div>

## Méthodologie

### Baseline : Affectation naïve
Avant d'introduire de l'intelligence artificielle, une méthode d'affectation basée sur des règles logiques humaines a été mise en place pour servir de point de comparaison. Cette solution reproduit le comportement qu'un gestionnaire hospitalier humain adopterait de manière intuitive :
1. Dès qu'un médecin (serveur) se libère, l'algorithme applique un filtre de compétences : il isole uniquement les patients de la file d'attente dont la tâche médicale correspond aux aptitudes réelles de ce médecin.
2. Parmi ces patients éligibles, l'algorithme applique une règle de priorité gloutonne : il sélectionne en priorité absolue le patient le plus proche de son heure de rendez-vous (pour maximiser la ponctualité) ou, à défaut, le patient sans rendez-vous qui subit le temps d'attente le plus élevé (règle du premier arrivé, premier servi / FIFO).

### Approche A : Sélection par Identifiant du Patient dans la file
Dans cette première tentative, l'agent tente de trier manuellement la file d'attente en désignant directement un individu à prendre en charge.
* **Espace d'actions (51 actions possibles)** : L'agent dispose de 50 actions correspondant aux index fixes des 50 premiers patients de la file d'attente, ainsi qu'une 51ème action consistant à attendre (HOLD).
* **Caractéristiques visuelles (Vecteur de 300D)** : L'agent observe l'état complet sous la forme d'une grande matrice de 50 patients possédant chacun 6 descripteurs clés (son temps d'attente accumulé, l'identifiant de sa tâche médicale, s'il possède un rendez-vous, son avance ou retard horaire, son temps estimé de traitement et son niveau de risque d'abandon).
* **Limites** : L'environnement est trop mouvant, dès qu'un patient est servi, la file se décale, brisant l'association logique entre un index fixe et une bonne décision de l'agent.

### Approche B : Sélection par Type de Tâche Médicale
Pour s'abstraire des individus, l'agent se focalise désormais sur le type d'acte médical à effectuer, laissant une règle heuristique choisir le patient le plus ancien au sein de la catégorie sélectionnée.
* **Espace d'actions (32 actions possibles)** : L'agent peut choisir parmi 30 actions représentant chacune une tâche médicale spécifique à attribuer à un patient sans rendez-vous, 1 action globale pour traiter le rendez-vous le plus pertinent, et 1 action pour attendre (HOLD).
* **Caractéristiques visuelles (Vecteur de 94D)** : Pour chaque tâche, l'agent suit 3 indicateurs (le nombre de patients en attente, le temps d'attente maximal et l'indice d'efficacité du médecin actuel). À cela s'ajoutent 4 données macro-hospitalières (le nombre de rendez-vous en attente, le retard maximal constaté, l'heure de la simulation et l'identifiant du serveur disponible).

### Approche C : Sélection par Mode de Priorité Globale
L'agent passe à un niveau d'abstraction supérieur : il ne choisit plus la tâche, mais définit la stratégie de l'hôpital à un instant T (gérer les urgences ou désengorger la file générale), tandis qu'un solveur mathématique calcule le gain de chaque patient.
* **Espace d'actions (3 actions possibles)** : L'espace est réduit à l'extrême avec 3 choix : donner la priorité absolue aux rendez-vous, donner la priorité à la file d'attente des personnes sans rendez-vous, ou attendre (HOLD).
* **Caractéristiques visuelles (Vecteur de 152D)** : L'agent dispose d'une vision panoramique très lourde détaillant les 30 tâches de l'établissement à travers 5 indicateurs précis (volume de sans RDV, attente max sans RDV, volume de RDV planifiés, retard maximal sur ces RDV, et niveau de compétence du médecin).

### Approche D : Sélection par Mode de Priorité avec Réduction du Nombre de Caractéristiques
L'approche finale consiste à donner à l'agent un rôle de décideur stratégique : il choisit directement une règle de gestion comportementale parmi quatre options interprétables, et l'environnement applique cette règle sur le patient idéal.
* **Espace d'actions (4 actions possibles)** : L'agent choisit entre 4 stratégies d'ordonnancement directes : servir le rendez-vous le plus urgent, privilégier l'attente la plus longue de la file, optimiser le débit en prenant le patient le plus rapide à traiter, ou temporiser (HOLD).
* **Caractéristiques visuelles (Vecteur optimisé de 22D)** : Grâce à cette modélisation, l'espace d'observation est drastiquement compressé. L'agent ne scrute plus toute la file, mais analyse uniquement les caractéristiques des 3 meilleurs candidats virtuels présélectionnés par chaque stratégie (5 indicateurs par candidat : temps d'attente, temps de service estimé, présence d'un RDV, delta de temps par rapport au RDV, score d'urgence). Le vecteur est complété par 7 variables globales (taille de la file, temps de simulation, disponibilité, etc.).

## Résultats

L'évaluation finale sur 50 journées tests montre une supériorité incontestable de l'approche par apprentissage par renforcement lorsque l'espace d'actions est correctement modélisé.

| Configuration Technique | Type de Choix de l'Agent | Taille de l'Espace d'Actions | Dimension des Caractéristiques | Score Final Obtenu |
| :--- | :--- | :---: | :---: | :---: |
| Baseline | Règles métiers fixes + Filtre | — | — | 45% |
| Approche A | Index du patient dans la file | 51 actions | 300 variables | 60.3% |
| Approche B | Type de tâche médicale | 32 actions | 94 variables | 70.6% |
| Approche C | Mode de priorité globale | 3 actions | 152 variables | **90.4%** |
| Approche D | Approche C + Dimension réduite | 4 actions | 22 variables | **92.5%** |

* **Généralisation et Robustesse** : Soumis à d'importantes variations (pics d'affluence imprévus de patients sans rendez-vous), l'agent PPO sémantique conserve sa stabilité et prouve sa capacité à s'adapter en temps réel là où les règles fixes s'effondrent.
* **Taille de l'espace d'actions** : La réduction de l'espace d'action et du nombre de variables caractéristiques au strict minimum permettent à l'agent de converger plus rapidement et vers une police d'affectation plus performante.
