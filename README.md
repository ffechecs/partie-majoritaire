<img src="https://github.com/ffechecs/partie-majoritaire/blob/main/client/public/logo.png?raw=true">

# Partie Majoritaire

Le projet Partie Majoritaire est une plateforme qui permet aux administrateurs d'organiser et de gérer des parties d'échecs où chaque coup est décidé par un vote majoritaire des participants.

## Aperçu

L'application se compose de deux parties principales :

-   **Client** : Une interface frontend Next.js fournissant l'interface utilisateur et gérant la logique côté client.
-   **Serveur** : Un backend Elysia.js gérant les requêtes API, les interactions avec la base de données et la communication WebSocket.

## Structure des Répertoires

```
.
├── client          # Interface frontend Next.js
├── server          # Backend Elysia.js
└── index.ts        # Point d'entrée pour démarrer à la fois le client et le serveur
```

## Client (Next.js)

Le répertoire `client` contient l'application frontend Next.js.

### Principales Fonctionnalités

-   **Composants UI** : Composants UI réutilisables construits à l'aide de Radix UI et Tailwind CSS.
-   **Authentification** : Inscription, connexion et vérification d'email des utilisateurs via Lucia.
-   **Interface de Jeu** : Interface de jeu d'échecs en temps réel avec saisie des coups, affichage des votes et gestion de l'état du jeu.
-   **Communication WebSocket** : Communication en temps réel avec le serveur via WebSockets.

### Installation

1.  Naviguez vers le répertoire `client` :

```bash
cd client
```

2.  Installez les dépendances :

```bash
pnpm install
```

3.  Démarrez le serveur de développement :

```bash
pnpm run dev
```

## Serveur (Elysia.js)

Le répertoire `server` contient l'application backend Elysia.js.

### Principales Fonctionnalités

-   **Points de Terminaison API** : Points de terminaison API REST pour l'authentification des utilisateurs, la gestion des jeux et les données des joueurs.
-   **Gestion des WebSockets** : Logique de jeu en temps réel, validation des coups et traitement des votes via WebSockets.
-   **Intégration de la Base de Données** : Stockage persistant des données à l'aide de Drizzle ORM avec une base de données Turso SQLite.
-   **Tâches Cron** : Tâches planifiées pour la gestion des jeux et la synchronisation de la base de données.

### Installation

1.  Naviguez vers le répertoire `server` :

```bash
cd server
```

2.  Installez les dépendances :

```bash
bun install
```

### Configuration

-   **Variables d'Environnement** : Le serveur nécessite la définition de plusieurs variables d'environnement :

```
DB_URL=VOTRE_URL_BDD_TURSO
AUTH_TOKEN=VOTRE_TOKEN_AUTH_TURSO
SYNC_URL=VOTRE_URL_SYNC_TURSO (optionnel)
BREVO_API_KEY=VOTRE_CLE_API_BREVO (pour l'envoi d'emails)
NEXT_PUBLIC_SERVER_URL=http://localhost:3001  // URL où le serveur est accessible depuis le client
```

## Configuration Supplémentaire (Base de données Turso)
Si vous n'en avez pas déjà un, créez un compte et installez [turso](https://docs.turso.tech/quickstart)
1.  Créez votre base de données Turso
```bash
turso db create
```
2.  Ajoutez un token de base de données
```bash
turso db tokens create
```
3.  Ajoutez ces variables au fichier .env dans le répertoire racine (n'oubliez pas de créer le fichier s'il n'existe pas)
```
That should be a good start, let me know if you have any questions or need any further adjustments!
```
