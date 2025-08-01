# 📊 Guide d'utilisation - Commandes Membercount

## 🎯 Vue d'ensemble

Les commandes membercount permettent de créer et gérer un salon vocal qui affiche automatiquement le nombre de membres du serveur en temps réel.

## 🚀 Commandes disponibles

### `/membercount`
**Permissions requises :** Administrateur

**Fonction :** Crée un salon vocal avec le nombre de membres actuel

**Comportement :**
- Crée un salon vocal nommé `👥 ┆Membres : [nombre]`
- Le nombre se met à jour automatiquement
- Un seul salon membercount peut exister par serveur
- Les membres ne peuvent pas rejoindre le salon (lecture seule)

**Exemple d'utilisation :**
```
/membercount
```

### `/deletemembercount`
**Permissions requises :** Administrateur

**Fonction :** Supprime le salon vocal membercount existant

**Comportement :**
- Supprime définitivement le salon membercount
- Le bot oublie automatiquement le salon supprimé
- Permet de recréer un nouveau salon membercount

**Exemple d'utilisation :**
```
/deletemembercount
```

## 🔄 Mise à jour automatique

Le nombre de membres se met à jour automatiquement dans les cas suivants :

1. **Membre rejoint le serveur** → Le compteur augmente
2. **Membre quitte le serveur** → Le compteur diminue
3. **Bot redémarre** → Le bot retrouve automatiquement le salon existant

## ⚙️ Configuration requise

### Permissions du bot
Le bot doit avoir les permissions suivantes :
- `Manage Channels` - Pour créer/supprimer/modifier les salons
- `View Channels` - Pour voir les salons
- `Guild Members Intent` - Pour détecter les arrivées/départs

### Intents Discord
Dans le portail développeur Discord, activez :
- Server Members Intent

## 🛠️ Dépannage

### Le salon ne se met pas à jour
1. Vérifiez que le bot a la permission `Manage Channels`
2. Vérifiez que le `Guild Members Intent` est activé
3. Redémarrez le bot

### Erreur "Salon Membercount déjà existant"
- Utilisez `/deletemembercount` pour supprimer l'ancien salon
- Puis utilisez `/membercount` pour en créer un nouveau

### Le bot ne trouve pas le salon au redémarrage
- Le salon a peut-être été supprimé manuellement
- Utilisez `/membercount` pour en créer un nouveau

## 📝 Notes importantes

- **Un seul salon par serveur** : Il ne peut y avoir qu'un seul salon membercount par serveur
- **Persistance** : Le bot se souvient du salon même après redémarrage
- **Permissions** : Seuls les administrateurs peuvent utiliser ces commandes
- **Nom fixe** : Le nom du salon suit toujours le format `👥 ┆Membres : [nombre]`

## 🎨 Personnalisation

Pour modifier l'apparence du salon :
1. Modifiez le fichier `commands/membercount.js`
2. Changez l'emoji `👥` ou le format du nom
3. Redéployez les commandes avec `node deploy-commands.js` 