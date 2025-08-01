const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Affiche l\'aide du bot'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x2F3136)
            .setTitle('🤖 Aide - Naams Slot Bot')
            .setDescription('Voici les commandes disponibles :')
            .addFields(
                { 
                    name: '/prices', 
                    value: 'Affiche les prix des différents types de slots', 
                    inline: false 
                },
                { 
                    name: '/createslot', 
                    value: 'Crée un nouveau slot (Administrateur uniquement)', 
                    inline: false 
                },
                { 
                    name: '/pingstatus', 
                    value: 'Affiche le statut des pings de vos slots', 
                    inline: false 
                },
                { 
                    name: '/help', 
                    value: 'Affiche cette page d\'aide', 
                    inline: false 
                }
            )
            .addFields(
                {
                    name: '📋 Catégories disponibles',
                    value: `
🎀 **Co Seller** - Slots premium
🔥 **V.I.P** - Slots très importants
☁️ **Category 1** - Slots standards
☁️ **Category 2** - Slots basiques
                    `,
                    inline: false
                }
            )
            .addFields(
                {
                    name: '⏰ Durées disponibles',
                    value: `
📅 **Weekly** - 7 jours
📅 **Monthly** - 30 jours
📅 **Lifetime** - Permanent
                    `,
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: 'Naams Slot Bot - Gestion des slots Discord' });

        await interaction.reply({ embeds: [embed] });
    },
}; 