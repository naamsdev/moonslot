# 🤖 Naams Slot Bot

Un bot Discord pour la gestion des slots avec des embeds préconfigurés et un système de commandes slash.

## ✨ Fonctionnalités

- **Commande `/prices`** : Affiche les prix des différents types de slots avec un embed préconfiguré
- **Commande `/createslot`** : Crée un nouveau slot avec toutes les informations nécessaires
- **Commande `/pingstatus`** : Affiche le statut des pings de vos slots
- **Commande `/help`** : Affiche l'aide du bot
- **Commande `/membercount`** : Crée un salon vocal avec le nombre de membres en temps réel
- **Commande `/deletemembercount`** : Supprime le salon vocal membercount
- **Système de permissions** : Seuls les administrateurs peuvent créer des slots
- **Création automatique de salons** : Crée des salons privés pour chaque slot dans les bonnes catégories
- **Gestion des pings** : Compte et limite les pings quotidiens (@everyone/@here)
- **Embeds personnalisés** : Design moderne et professionnel
- **Système de mentions** : Détecte automatiquement les mentions et affiche le statut

## 🚀 Installation

### Prérequis

- Node.js (version 16 ou supérieure)
- Un bot Discord créé sur le [Portail Développeur Discord](https://discord.com/developers/applications)

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone <votre-repo>
   cd naams_slot_bot
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement**
   - Copiez le fichier `env.example` vers `.env`
   - Remplissez les informations suivantes :
   ```env
   DISCORD_TOKEN=your_discord_bot_token_here
   GUILD_ID=your_guild_id_here
   CLIENT_ID=your_client_id_here
   ```

4. **Déployer les commandes slash**
   ```bash
   node deploy-commands.js
   ```

5. **Lancer le bot**
   ```bash
   npm start
   ```

## 📋 Configuration du Bot Discord

### 1. Créer un bot Discord

1. Allez sur [Discord Developer Portal](https://discord.com/developers/applications)
2. Cliquez sur "New Application"
3. Donnez un nom à votre application
4. Allez dans l'onglet "Bot"
5. Cliquez sur "Add Bot"
6. Copiez le token du bot (vous en aurez besoin pour `.env`)

### 2. Configurer les permissions

1. Dans l'onglet "Bot", activez les options suivantes :
   - Message Content Intent
   - Server Members Intent
   - Presence Intent

2. Dans l'onglet "OAuth2" > "URL Generator" :
   - Sélectionnez "bot" dans Scopes
   - Sélectionnez les permissions suivantes :
     - Send Messages
     - Use Slash Commands
     - Embed Links
     - Read Message History

### 3. Inviter le bot sur votre serveur

1. Utilisez l'URL générée pour inviter le bot
2. Ou utilisez ce lien (remplacez CLIENT_ID par votre ID) :
   ```
   https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=2147483648&scope=bot%20applications.commands
   ```

## 🎮 Utilisation

### Commandes disponibles

#### `/prices`
Affiche les prix des différents types de slots :
- 🎀 Co Seller
- 🔥 V.I.P
- ☁️ Category 1
- ☁️ Category 2

#### `/createslot` (Administrateur uniquement)
Crée un nouveau slot avec les paramètres suivants :
- **Owner** : Le propriétaire du slot
- **Category** : La catégorie du slot (crée automatiquement la catégorie Discord)
- **Duration** : Weekly, Monthly, ou Lifetime
- **Pings** : @here ou @everyone
- **Ping Count** : 2x ou 3x par jour

**Fonctionnalités automatiques :**
- Création d'un salon privé `slot-[username]` dans la bonne catégorie
- Seul le propriétaire a accès au salon
- Système de gestion des pings intégré

#### `/pingstatus`
Affiche le statut des pings pour tous vos slots :
- Nombre de pings utilisés/restants
- Date d'expiration
- Type de pings autorisés

#### `/help`
Affiche l'aide du bot avec toutes les commandes disponibles.

#### `/membercount` (Administrateur uniquement)
Crée un salon vocal qui affiche automatiquement le nombre de membres du serveur :
- **Nom du salon** : `👥 ┆Membres : [nombre]`
- **Mise à jour automatique** : Le nombre se met à jour quand des membres rejoignent ou quittent
- **Salon unique** : Un seul salon membercount peut exister par serveur
- **Permissions** : Les membres ne peuvent pas rejoindre le salon (lecture seule)

#### `/deletemembercount` (Administrateur uniquement)
Supprime le salon vocal membercount existant :
- **Suppression définitive** : Le salon est supprimé du serveur
- **Nettoyage automatique** : Le bot oublie automatiquement le salon supprimé

## 🔧 Personnalisation

### Modifier les prix

Pour modifier les prix affichés, éditez le fichier `commands/prices.js` et modifiez la description de l'embed.

### Modifier l'apparence des embeds

Vous pouvez personnaliser les couleurs, emojis et textes en modifiant les fichiers dans le dossier `commands/`.

### Ajouter de nouvelles catégories

1. Modifiez `commands/prices.js` pour ajouter la nouvelle catégorie
2. Modifiez `commands/createslot.js` pour ajouter l'option dans les choix
3. Redéployez les commandes avec `node deploy-commands.js`

## 🎯 Système de Pings

### Fonctionnement

Le bot gère automatiquement les pings dans les salons de slots :

1. **Détection automatique** : Le bot détecte quand un utilisateur utilise @everyone ou @here
2. **Vérification des permissions** : Seul le propriétaire du slot peut utiliser des pings
3. **Comptage quotidien** : Les pings sont réinitialisés chaque jour à minuit
4. **Limitation** : Respecte la limite définie (2x ou 3x par jour)
5. **Feedback** : Affiche un embed avec le statut des pings utilisés

## 📊 Système Membercount

### Fonctionnement

Le bot gère automatiquement un salon vocal qui affiche le nombre de membres en temps réel :

1. **Création du salon** : La commande `/membercount` crée un salon vocal avec le nom `👥 ┆Membres : [nombre]`
2. **Mise à jour automatique** : Le nombre se met à jour automatiquement quand des membres rejoignent ou quittent
3. **Salon unique** : Un seul salon membercount peut exister par serveur
4. **Persistance** : Le bot se souvient du salon même après redémarrage
5. **Permissions** : Les membres ne peuvent pas rejoindre le salon (lecture seule)

### Événements gérés

- **`guildMemberAdd`** : Incrémente le compteur quand un membre rejoint
- **`guildMemberRemove`** : Décrémente le compteur quand un membre quitte
- **Redémarrage** : Le bot retrouve automatiquement le salon existant au démarrage

### Messages automatiques

- **Ping autorisé** : "✅ Ping utilisé avec succès! [utilisateur] a utilisé 1/X pings."
- **Ping refusé** : "❌ Ping non autorisé!" avec les raisons possibles
- **Message supprimé** : Les messages avec des pings non autorisés sont automatiquement supprimés

## 📝 Structure du projet

```
naams_slot_bot/
├── commands/
│   ├── prices.js          # Commande pour afficher les prix
│   ├── createslot.js      # Commande pour créer un slot
│   ├── pingstatus.js      # Commande pour voir le statut des pings
│   ├── help.js           # Commande d'aide
│   ├── membercount.js     # Commande pour créer le salon membercount
│   └── deletemembercount.js # Commande pour supprimer le salon membercount
├── utils/
│   └── slotManager.js     # Gestionnaire des slots et pings
├── config/
│   └── permissions.js     # Configuration des permissions
├── index.js              # Fichier principal du bot
├── deploy-commands.js    # Script de déploiement des commandes
├── package.json          # Dépendances du projet
├── env.example          # Exemple de configuration
└── README.md            # Ce fichier
```

## 🛠️ Développement

### Mode développement

```bash
npm run dev
```

### Redéployer les commandes

Après avoir modifié une commande, redéployez avec :
```bash
node deploy-commands.js
```

## 📞 Support

Si vous rencontrez des problèmes ou avez des questions, n'hésitez pas à ouvrir une issue sur GitHub.

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails. 