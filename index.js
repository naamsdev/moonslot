const { Client, GatewayIntentBits, Collection, Events, EmbedBuilder, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');
const SlotManager = require('./utils/slotManager');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();
client.slotManager = new SlotManager();

// Charger les commandes
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[AVERTISSEMENT] La commande à ${filePath} manque une propriété "data" ou "execute" requise.`);
    }
}

// Événement ready
client.once('ready', () => {
    console.log(`✅ ${client.user.tag} est connecté et prêt!`);
    
    // Système de statut rotatif
    const statuses = [
        { name: 'Cheap Services', type: 3 }, // PLAYING
        { name: '.gg/moonstore', type: 3 }, // PLAYING
        { name: 'Developer : Naams', type: 3 }, // PLAYING
        { name: 'SellAuth soon', type: 3 } // PLAYING
    ];
    
    let currentStatusIndex = 0;
    
    const updateStatus = () => {
        try {
            const status = statuses[currentStatusIndex];
            client.user.setPresence({
                activities: [{
                    name: status.name,
                    type: status.type
                }],
                status: 'online'
            });
            console.log(`🔄 Statut changé: "${status.name}"`);
            currentStatusIndex = (currentStatusIndex + 1) % statuses.length;
        } catch (error) {
            console.error('❌ Erreur lors du changement de statut:', error);
        }
    };
    
    // Définir le premier statut
    updateStatus();
    
    // Changer le statut toutes les 3 minutes (180000 ms)
    setInterval(updateStatus, 180000);
    
    console.log('✅ Système de statut rotatif activé (changement toutes les 3 minutes)');

    // Initialiser la Map pour les salons membercount
    client.memberCountChannel = new Map();
    
    // Récupérer les salons membercount existants
    client.guilds.cache.forEach(guild => {
        const memberCountChannel = guild.channels.cache.find(
            channel => channel.name.includes('Users') && channel.type === ChannelType.GuildVoice
        );
        
        if (memberCountChannel) {
            client.memberCountChannel.set(guild.id, memberCountChannel.id);
            console.log(`📊 Salon membercount trouvé pour ${guild.name}: ${memberCountChannel.name}`);
            
            // Mettre à jour immédiatement le nom du salon
            updateMemberCountChannel(guild);
        } else {
            console.log(`⚠️ Aucun salon membercount trouvé pour ${guild.name}`);
        }
    });
});

// Gestion des interactions slash
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
        console.error(`Aucune commande correspondant à ${interaction.commandName} n'a été trouvée.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'Il y a eu une erreur lors de l\'exécution de cette commande!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'Il y a eu une erreur lors de l\'exécution de cette commande!', ephemeral: true });
        }
    }
});

// Gestion des messages et mentions dans les slots
client.on(Events.MessageCreate, async message => {
    // Ignorer les messages du bot
    if (message.author.bot) return;

    // Vérifier si le message est dans un salon de slot
    const slot = client.slotManager.getSlot(message.channel.id);
    if (!slot) return;

    // Vérifier si le message contient une mention @everyone ou @here
    const hasEveryoneMention = message.mentions.everyone;
    const hasHereMention = message.mentions.here;
    const hasRoleMention = message.mentions.roles.size > 0;

    if (hasEveryoneMention || hasHereMention || hasRoleMention) {
        const userId = message.author.id;
        const slot = client.slotManager.getSlot(message.channel.id);
        
        // Vérifier si l'utilisateur peut utiliser un ping
        if (client.slotManager.canUsePing(message.channel.id, userId)) {
            // Vérifier si le type de mention correspond aux permissions du slot
            const allowedPingType = slot.pings; // 'everyone' ou 'here'
            const usedPingType = hasEveryoneMention ? 'everyone' : 'here';
            
            if (allowedPingType === usedPingType) {
                // Utiliser le ping
                client.slotManager.usePing(message.channel.id, userId);
                
                // Obtenir le statut des pings
                const pingStatus = client.slotManager.getPingStatus(message.channel.id);
                
                // Créer l'embed de confirmation
                const pingEmbed = new EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle('✅ Ping used successfully!')
                    .setDescription(`<@${userId}> has used 1/${pingStatus.max} pings.`)
                    .addFields(
                        {
                            name: '📊 Ping Status',
                            value: `**Used:** ${pingStatus.used}/${pingStatus.max}\n**Remaining:** ${pingStatus.remaining}`,
                            inline: true
                        }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Naams Slot Bot' });

                await message.reply({ embeds: [pingEmbed] });
            } else {
                // Mauvais type de mention utilisé
                const pingEmbed = new EmbedBuilder()
                    .setColor(0xFFA500)
                    .setTitle('⚠️ Wrong ping type!')
                    .setDescription(`<@${userId}>, you can only use ${allowedPingType === 'everyone' ? '@everyone' : '@here'} in this slot.`)
                    .addFields(
                        {
                            name: '📋 Allowed ping type',
                            value: `Your slot allows: **${allowedPingType === 'everyone' ? '@everyone' : '@here'}**\nYou used: **${usedPingType === 'everyone' ? '@everyone' : '@here'}**`,
                            inline: false
                        }
                    )
                    .setTimestamp()
                    .setFooter({ text: 'Naams Slot Bot' });

                await message.reply({ embeds: [pingEmbed] });
                
                // Supprimer le message original
                try {
                    await message.delete();
                } catch (error) {
                    console.error('Unable to delete message:', error);
                }
            }
        } else {
            // L'utilisateur ne peut pas utiliser de ping
            const pingEmbed = new EmbedBuilder()
                .setColor(0xFF0000)
                .setTitle('❌ Ping not allowed!')
                .setDescription(`<@${userId}>, you cannot use ping in this channel.`)
                .addFields(
                    {
                        name: '📋 Possible reasons',
                        value: '• You are not the owner of the slot\n• You have already used all your daily pings\n• Your slot has expired',
                        inline: false
                    }
                )
                .setTimestamp()
                .setFooter({ text: 'Naams Slot Bot' });

            await message.reply({ embeds: [pingEmbed] });
            
            // Supprimer le message original
            try {
                await message.delete();
            } catch (error) {
                console.error('Unable to delete message:', error);
            }
        }
    }
});

// Nettoyer les slots expirés toutes les heures
setInterval(() => {
    const expiredSlots = client.slotManager.cleanupExpiredSlots();
    if (expiredSlots.length > 0) {
        console.log(`Expired slots removed: ${expiredSlots.length}`);
    }
}, 60 * 60 * 1000); // Toutes les heures

// Mettre à jour tous les salons membercount toutes les 5 minutes
setInterval(() => {
    client.guilds.cache.forEach(guild => {
        if (client.memberCountChannel.has(guild.id)) {
            updateMemberCountChannel(guild);
        }
    });
}, 5 * 60 * 1000); // Toutes les 5 minutes

// Fonction pour mettre à jour le nom du salon membercount
async function updateMemberCountChannel(guild) {
    try {
        if (!client.memberCountChannel) return;
        
        const channelId = client.memberCountChannel.get(guild.id);
        if (!channelId) return;
        
        const channel = guild.channels.cache.get(channelId);
        if (!channel) {
            console.log(`❌ Salon membercount introuvable pour ${guild.name} (ID: ${channelId})`);
            return;
        }
        
        const memberCount = guild.memberCount;
        const newName = `👥 ┆Users : ${memberCount}`;
        
        if (channel.name !== newName) {
            await channel.setName(newName, 'Mise à jour automatique du nombre de membres');
            console.log(`✅ Nombre de membres mis à jour pour ${guild.name}: ${memberCount} (${channel.name} → ${newName})`);
        } else {
            console.log(`ℹ️ Nombre de membres déjà à jour pour ${guild.name}: ${memberCount}`);
        }
    } catch (error) {
        console.error('❌ Erreur lors de la mise à jour du salon membercount:', error);
    }
}

// Événement quand un membre rejoint le serveur
client.on('guildMemberAdd', async (member) => {
    await updateMemberCountChannel(member.guild);
});

// Événement quand un membre quitte le serveur
client.on('guildMemberRemove', async (member) => {
    await updateMemberCountChannel(member.guild);
});

// Connexion du bot
client.login(process.env.DISCORD_TOKEN); 