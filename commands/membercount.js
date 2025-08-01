const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Crée un salon vocal avec le nombre de membres en temps réel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        try {
            const guild = interaction.guild;
            const memberCount = guild.memberCount;
            
            // Vérifier si un salon membercount existe déjà
            const existingChannel = guild.channels.cache.find(
                channel => channel.name.includes('Users') && channel.type === ChannelType.GuildVoice
            );

            if (existingChannel) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('❌ Salon Membercount déjà existant')
                    .setDescription(`Un salon membercount existe déjà : ${existingChannel}`)
                    .setTimestamp()
                    .setFooter({ text: 'Naams Slot Bot' });

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Créer le salon vocal
            const channelName = `👥 ┆Users : ${memberCount}`;
            const memberCountChannel = await guild.channels.create({
                name: channelName,
                type: ChannelType.GuildVoice,
                permissionOverwrites: [
                    {
                        id: guild.id, // @everyone
                        deny: [
                            PermissionsBitField.Flags.Connect,
                            PermissionsBitField.Flags.Speak,
                            PermissionsBitField.Flags.Stream,
                            PermissionsBitField.Flags.UseVAD
                        ]
                    },
                    {
                        id: interaction.client.user.id, // Bot
                        allow: [
                            PermissionsBitField.Flags.ViewChannel,
                            PermissionsBitField.Flags.ManageChannels
                        ]
                    }
                ],
                reason: 'Création du salon membercount'
            });

            // Stocker l'ID du salon dans le client pour les mises à jour
            if (!interaction.client.memberCountChannel) {
                interaction.client.memberCountChannel = new Map();
            }
            interaction.client.memberCountChannel.set(guild.id, memberCountChannel.id);

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ Salon Membercount créé')
                .setDescription(`Le salon vocal a été créé avec succès !`)
                .addFields(
                    {
                        name: '📊 Salon créé',
                        value: `${memberCountChannel}`,
                        inline: false
                    },
                    {
                        name: '👥 Nombre de membres actuel',
                        value: `${memberCount}`,
                        inline: false
                    },
                    {
                        name: '🔄 Mise à jour automatique',
                        value: 'Le nombre sera mis à jour automatiquement quand des membres rejoignent ou quittent le serveur.',
                        inline: false
                    }
                )
                .setTimestamp()
                .setFooter({ text: 'Naams Slot Bot' });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Erreur lors de la création du salon membercount:', error);
            await interaction.reply({ 
                content: '❌ Une erreur est survenue lors de la création du salon membercount. Vérifiez que le bot a les permissions nécessaires.', 
                ephemeral: true 
            });
        }
    },
}; 