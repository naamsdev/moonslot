const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletemembercount')
        .setDescription('Supprime le salon vocal membercount')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        try {
            const guild = interaction.guild;
            
            // Vérifier si un salon membercount existe
            const existingChannel = guild.channels.cache.find(
                channel => channel.name.includes('Users') && channel.type === ChannelType.GuildVoice
            );

            if (!existingChannel) {
                const embed = new EmbedBuilder()
                    .setColor(0xFF0000)
                    .setTitle('❌ Aucun salon Membercount trouvé')
                    .setDescription(`Aucun salon membercount n'existe sur ce serveur.`)
                    .setTimestamp()
                    .setFooter({ text: 'Naams Slot Bot' });

                return await interaction.reply({ embeds: [embed], ephemeral: true });
            }

            // Supprimer le salon
            await existingChannel.delete('Suppression du salon membercount');

            // Supprimer de la Map du client
            if (interaction.client.memberCountChannel) {
                interaction.client.memberCountChannel.delete(guild.id);
            }

            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ Salon Membercount supprimé')
                .setDescription(`Le salon vocal membercount a été supprimé avec succès !`)
                .addFields(
                    {
                        name: '🗑️ Salon supprimé',
                        value: `Le salon membercount a été supprimé définitivement.`,
                        inline: false
                    },
                    {
                        name: '📝 Note',
                        value: 'Vous pouvez recréer un salon membercount avec la commande `/membercount`',
                        inline: false
                    }
                )
                .setTimestamp()
                .setFooter({ text: 'Naams Slot Bot' });

            await interaction.reply({ embeds: [embed] });

        } catch (error) {
            console.error('Erreur lors de la suppression du salon membercount:', error);
            await interaction.reply({ 
                content: '❌ Une erreur est survenue lors de la suppression du salon membercount. Vérifiez que le bot a les permissions nécessaires.', 
                ephemeral: true 
            });
        }
    },
}; 