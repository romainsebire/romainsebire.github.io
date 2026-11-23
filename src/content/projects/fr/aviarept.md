---
title: "Détection Précoce des Troubles de l'Écriture par Vision par Ordinateur"
tagline: "YOLOv8-pose · MediaPipe · Intel RealSense"
summary: "Reconstruction en trois dimensions de la trajectoire d'un stylo par vision par ordinateur pour analyser les mouvements de la main en l'air et aider au dépistage précoce de la dysgraphie."
category: "dl"
domains: ["computer-vision", "data-engineering"]
stack: ["YOLOv8-pose", "MediaPipe", "RealSense SDK", "Qt"]
video: "https://github.com/user-attachments/assets/b3ae6de8-3af9-416c-bd36-fd18b5ec32e5"
featured: true
order: 5
date: "Janv. – Févr. 2026"
cover: "/images/projects/aviarept/cover.webp"
environment: "Docker (GPU NVIDIA T4)"
---

Ce projet vise à détecter de manière précoce et non-invasive les troubles de l'apprentissage de l'écriture (comme la dysgraphie) grâce à l'analyse vidéo. Le système capture et reconstruit en 3D la trajectoire complète d'un stylo à l'aide de caméras synchronisées. L'innovation majeure réside dans la capacité de l'IA à analyser les mouvements en l'air (lorsque le stylo ne touche pas la feuille), une phase cruciale de planification motrice qui est totalement invisible pour les tablettes numériques classiques. Ce pipeline complet ouvre la voie à un dépistage clinique automatisé basé sur la vidéo.

## Contexte

Ce projet s'inscrit dans le cadre de la thèse de recherche AVIAREPT, portée par Lauren Sismeiro au sein du laboratoire EuroMov Digital Health in Motion (Université de Montpellier et IMT Mines Alès). Réalisé en binôme avec Rémy Plastre, ce travail constitue notre mission R&D de fin d'études en tant qu'élèves-ingénieurs spécialisés en Intelligence Artificielle.

* **Le Problème** : La dysgraphie touche 5 à 10 % des enfants. Les tests cliniques actuels (Test BHK sur papier) ignorent la dynamique temporelle. Les tablettes graphiques (comme Wacom) captent le mouvement au contact, mais souffrent d'un angle mort critique avec une perte de signal dès que le stylo est soulevé à plus de 1 cm de la surface.
* **Notre Mission** : Accompagner techniquement la thèse en construisant un dispositif matériel et logiciel non-invasif capable de suivre l'intégralité des mouvements du stylo dans l'espace 3D pour capturer ces marqueurs moteurs invisibles.

## Données et dispositif d'acquisition

Pour capturer la vérité terrain et entraîner les modèles, un environnement d'acquisition rigoureux a été modélisé en CAO et imprimé en 3D afin de figer la géométrie des capteurs :
* **Matériel vidéo** : 2 caméras Intel RealSense D435i (RGB et Profondeur) disposées de face et de profil du côté opposé à la main d'écriture pour limiter les occlusions, complétées par une webcam Sony orientée vers le buste.
* **Référence 2D** : 1 tablette Wacom Intuos Pro recouverte d'une feuille de papier standard (position 2D, pression et inclinaison).
* **Référence 3D** : Un système optique Qualisys Motion Capture (MoCap) à 90 Hz suivant 4 marqueurs réfléchissants fixés sur un support léger imprimé en 3D et clipsé au stylo.
* **Synchronisation matérielle** : Développement d'une horloge maître en Python multithreadée cadencée à 30 FPS en résolution 640x480 pour enregistrer simultanément tous les flux vidéo et la tablette (environ 2 Go par minute) sans perte d'images malgré la saturation de bande passante USB 3.0.

## Méthodologie

### Défi 1 : Le Choix de la Vérité Terrain (MoCap vs Tablette)

Pour évaluer la précision de notre reconstruction 3D, il nous fallait une vérité terrain fiable. Deux options s'offraient à nous : la tablette graphique (très précise mais limitée au contact 2D) ou le système optique MoCap (suivi continu en 3D via les sphères infrarouges, mais nécessitant d'interpoler la position virtuelle de la pointe du stylo).

* **Synchronisation** : Les acquisitions MoCap à 90 Hz étant enregistrées sur un logiciel propriétaire externe, trois méthodes de recalage temporel et de rééchantillonnage à 30 FPS ont été développées (par détection du premier contact, par corrélation croisée des vitesses et via une interface graphique d'alignement manuel).
* **Constat** : Après alignement spatial rigide (algorithme de Kabsch), la précision absolue du système MoCap s'est révélée insuffisante pour des mouvements millimétriques comme des lettres manuscrites, d'autant que le plan de la table n'est pas parfaitement aligné avec l'axe Z de la MoCap et que les facteurs d'échelle divergent. La tablette Wacom a donc été retenue comme vérité terrain pour l'écriture au contact.

![Comparaison des tracés Wacom vs MoCap](/images/projects/aviarept/trace-overlay.webp)

### Défi 2 : Tracking Vidéo 2D et Analyse Posturale

La première étape de la transformation des pixels bruts en coordonnées physiques consistait à isoler le stylo sur les flux vidéo.

* **Tracking du stylo** : Entraînement d'un modèle YOLOv8-pose sur un jeu de données annoté manuellement pour détecter simultanément un squelette minimaliste à deux points clés (la pointe et le sommet du stylo) sur les vues de face et de profil. Pour stabiliser les prédictions malgré la vitesse du mouvement, un filtre de Kalman calibré par analyse spectrale (transformée de Fourier rapide avec filtre passe-bas à 10 Hz) a été appliqué aux trajectoires extraites.
* **Tracking postural** : En parallèle, MediaPipe Pose a été déployé pour suivre la posture du haut du corps (épaules, coudes, poignets, tête) en projetant les points clés 2D sur les cartes de profondeur des caméras RealSense, permettant d'analyser la stabilité corporelle du sujet pendant l'écriture.

<div class="project__video-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin: 1rem 0;">
  <video src="https://github.com/user-attachments/assets/d6d95588-55d5-48ef-972d-29ca401858e3" controls class="project__video" style="width: 100%; margin: 0;"></video>
</div>

### Défi 3 : La Reconstruction 3D de la Trajectoire

Le dernier verrou consistait à reconstruire la position 3D du stylo à partir des coordonnées 2D extraites sur les vues de face et de profil. Nous avons exploré et comparé deux approches :

* **Approche Deep Learning (MLP)** : Un Perceptron Multicouche prenant en entrée les coordonnées 2D des deux caméras (face et profil) pour prédire directement les coordonnées sur le plan de la tablette. Si la validation intra-session (70 % entraînement et 30 % test sur une même prise) montre que le réseau apprend bien la géométrie tant que les caméras restent strictement immobiles, l'évaluation croisée entre sujets (Leave-One-Subject-Out) a échoué sur les premières sessions enregistrées avant la mise en place du support imprimé en 3D, le moindre micro-déplacement des caméras faussant la projection spatiale.
* **Approche Géométrique (Triangulation Épipolaire)** : Une méthode de vision par ordinateur reposant sur la calibration des paramètres intrinsèques (correction de distorsion des lentilles) et extrinsèques (matrices de rotation et translation) des caméras à l'aide d'une mire en damier, en s'appuyant sur les travaux de Bruno Henriquès, doctorant à l'IMT Mines Alès spécialisé sur ce matériel. Cette approche géométrique permet de trianguler la trajectoire 3D complète (tracés au contact sur la feuille et mouvements de levée en l'air) sans biais lié au sujet.

<video src="https://github.com/user-attachments/assets/a73442ca-a382-4f70-90a6-48f7713e4ff3" controls class="project__video"></video>

## Résultats

* **Précision du tracking YOLOv8-pose** : Le modèle atteint un mAP@50 supérieur à 0,93 avec une erreur médiane de localisation de 3,28 pixels (erreur moyenne MAE de 4,31 pixels et RMSE de 6,09 pixels en validation Leave-One-Subject-Out sur 5 sujets), garantissant un suivi fiable de la pointe et du sommet du stylo.
* **Validation cinématique face à la tablette** : Après alignement entre la trajectoire reconstruite par les caméras et la vérité terrain Wacom, la comparaison des signaux affiche une erreur absolue moyenne (MAE) de 14,65 pixels, un ratio de tremblement (Jitter Ratio) de 1,03x, une vitesse angulaire très proche (0,36 contre 0,33 rad/frame) et une corrélation de profil de vitesse de 0,535, validant la faisabilité d'une analyse cinématique par vision.
