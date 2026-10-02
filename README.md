# SAE 1.01 - Projet CAN (Compagnie Alsacien)

Projet réalisé dans le cadre du **BUT Informatique (1ère année - S1)**.  
L'objectif de cette SAÉ (Situation d'Apprentissage et d'Évaluation) était de développer un système de gestion et d'affichage des réservations pour une compagnie fictive de bateaux.

Le projet est articulé en deux grandes parties communiquant par le biais d'un fichier de données généré puis transmis à une API JSON centralisée.

# Technologies Utilisées

### Application CLI (Partie C#) :

- Langage : C# (exécuté sur Linux via mono)

- Compilateur : csc / msc

- Éditeur : VS Code

### Interface Web (Partie Web) :

- HTML5 / CSS3 / JavaScript (Natif, développé entièrement à la main sans framework)

### Communication & Données :

- API JSON fournie par l'équipe pédagogique

# Fonctionnalités
### Application C# (Terminal / CLI)

- Création et saisie des données de réservation en ligne de commande.

- Génération d'un fichier JSON conforme au format attendu par le serveur.

- Envoi manuel du fichier sur la racine de l'API.

## Interface Web (Dashboard & Affichage)

- Fréquentation des traversées : Suivi jour par jour des réservations.

- Cartes d'embarquement : Visualisation et génération des cartes d'embarquement associées à une réservation.

- Facturation : Affichage détaillé des factures de réservation.

### Statistiques globales :

- Nombre total de voyages réalisés.

- Répartition et statistiques détaillées par liaison.

# Exécution & Compilation

## Partie C# (Linux)

### Prérequis :
S'assurer que Mono est installé sur le système Linux :


Aller sur le site du projet Mono [ici](https://www.mono-project.com/download/stable/)

### Compilation :

À l'aide du compilateur msc (ou csc) :

``` bash
csc main.cs --r:System.Web.Extention.dll out:sae.exe
```

### Exécution :
```bash
mono sae.exe
```
### Dépôt des données :

Une fois le fichier JSON produit par l'application C#, l'envoyer manuellement à la racine de l'API.

## Partie Web

### Prérequis :

- Python3

Lancement du serveur Web local :

```bash
    cd SAE11/
    python3 -m http.server -p 8000
```
Accéder à l'interface via votre navigateur à l'adresse [http://localhost:8000](http://localhost:8000).