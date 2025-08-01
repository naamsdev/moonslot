const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prices')
        .setDescription('Affiche les prix des slots'),
    
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor(0x2F3136)
            .setTitle('💰 SLOT PRICES 💰')
            .setDescription(`
**🎀 Co Seller 🎀**
• **Lifetime:** 30€ (3x @everyone pings daily)
• **Monthly:** 25€ (2x @everyone pings daily)
• **Weekly:** 20€ (3x @here pings daily)

**🔥 V.I.P 🔥**
• **Lifetime:** 25€ (3x @everyone pings daily)
• **Monthly:** 20€ (2x @everyone pings daily)
• **Weekly:** 15€ (3x @here pings daily)

**☁️ Category 1 ☁️**
• **Lifetime:** 20€ (2x @everyone pings daily)
• **Monthly:** 15€ (3x @here pings daily)
• **Weekly:** 10€ (2x @here pings daily)

**☁️ Category 2 ☁️**
• **Lifetime:** 15€ (2x @everyone pings daily)
• **Monthly:** 10€ (3x @here pings daily)
• **Weekly:** 5€ (2x @here pings daily)
            `)
            .setTimestamp()
            .setFooter({ text: 'Naams Slot Bot' });

        await interaction.reply({ embeds: [embed] });
    },
}; 