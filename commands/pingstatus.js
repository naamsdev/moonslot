const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pingstatus')
        .setDescription('Affiche le statut des pings de vos slots')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('L\'utilisateur dont vous voulez voir les pings (optionnel)')
                .setRequired(false)),
    
    async execute(interaction) {
        const targetUser = interaction.options.getUser('user') || interaction.user;
        
        // Vérifier si l'utilisateur a des slots
        const userSlots = interaction.client.slotManager.getUserSlots(targetUser.id);
        
        if (userSlots.length === 0) {
            const embed = new EmbedBuilder()
                .setColor(0xFF6B6B)
                .setTitle('❌ Aucun slot trouvé')
                .setDescription(`${targetUser} n'a aucun slot actif.`)
                .setTimestamp()
                .setFooter({ text: 'Naams Slot Bot' });

            await interaction.reply({ embeds: [embed] });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor(0x4ECDC4)
            .setTitle(`📊 Statut des pings - ${targetUser.username}`)
            .setThumbnail(targetUser.displayAvatarURL())
            .setDescription(`Voici le statut des pings pour tous les slots de ${targetUser}:`);

        for (const slot of userSlots) {
            const pingStatus = interaction.client.slotManager.getPingStatus(slot.channelId);
            const channel = interaction.guild.channels.cache.get(slot.channelId);
            const channelName = channel ? channel.name : 'Salon supprimé';
            
            const expiryText = slot.expiryDate ? 
                `<t:${Math.floor(new Date(slot.expiryDate).getTime() / 1000)}:R>` : 
                'Jamais';

            embed.addFields({
                name: `${slot.categoryEmoji || '📋'} ${slot.category} - ${channelName}`,
                value: `**Pings:** ${pingStatus.used}/${pingStatus.max} (${pingStatus.remaining} restants)\n**Durée:** ${slot.duration}\n**Expiration:** ${expiryText}\n**Type:** ${slot.pings === 'everyone' ? '@everyone' : '@here'}`,
                inline: true
            });
        }

        embed.setTimestamp()
            .setFooter({ text: 'Naams Slot Bot' });

        await interaction.reply({ embeds: [embed] });
    },
}; 