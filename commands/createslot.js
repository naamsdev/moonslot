const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType, PermissionsBitField } = require('discord.js');
const { SLOT_OWNER_PERMISSIONS, EVERYONE_DENIED_PERMISSIONS } = require('../config/permissions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createslot')
        .setDescription('Crée un nouveau slot')
        .addUserOption(option =>
            option.setName('owner')
                .setDescription('Le propriétaire du slot')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('category')
                .setDescription('La catégorie du slot')
                .setRequired(true)
                .addChoices(
                    { name: '🎀 Co Seller', value: 'Co Seller' },
                    { name: '🔥 V.I.P', value: 'V.I.P' },
                    { name: '☁️ Category 1', value: 'Category 1' },
                    { name: '☁️ Category 2', value: 'Category 2' }
                ))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('La durée du slot')
                .setRequired(true)
                .addChoices(
                    { name: 'Weekly', value: 'weekly' },
                    { name: 'Monthly', value: 'monthly' },
                    { name: 'Lifetime', value: 'lifetime' }
                ))
        .addStringOption(option =>
            option.setName('pings')
                .setDescription('Le type de pings autorisés')
                .setRequired(true)
                .addChoices(
                    { name: '@here', value: 'here' },
                    { name: '@everyone', value: 'everyone' }
                ))
        .addIntegerOption(option =>
            option.setName('ping_count')
                .setDescription('Nombre de pings par jour')
                .setRequired(true)
                .addChoices(
                    { name: '2x', value: 2 },
                    { name: '3x', value: 3 }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        try {
            const owner = interaction.options.getUser('owner');
            const category = interaction.options.getString('category');
            const duration = interaction.options.getString('duration');
            const pings = interaction.options.getString('pings');
            const pingCount = interaction.options.getInteger('ping_count');

        // Calculer la date d'expiration
        const now = new Date();
        let expiryDate;
        let expiryText;

        switch (duration) {
            case 'weekly':
                expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                expiryText = 'dans 7 jours';
                break;
            case 'monthly':
                expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                expiryText = 'dans 30 jours';
                break;
            case 'lifetime':
                expiryDate = null;
                expiryText = 'Jamais';
                break;
        }

        // Déterminer l'emoji de catégorie et le nom de la catégorie Discord
        let categoryEmoji;
        let discordCategoryName;
        switch (category) {
            case 'Co Seller':
                categoryEmoji = '🎀';
                discordCategoryName = '🎀 Co Seller';
                break;
            case 'V.I.P':
                categoryEmoji = '🔥';
                discordCategoryName = '🔥 V.I.P';
                break;
            case 'Category 1':
                categoryEmoji = '☁️';
                discordCategoryName = '☁️ Category 1';
                break;
            case 'Category 2':
                categoryEmoji = '☁️';
                discordCategoryName = '☁️ Category 2';
                break;
        }

        // Trouver ou créer la catégorie Discord
        let discordCategory = interaction.guild.channels.cache.find(
            channel => channel.type === ChannelType.GuildCategory && channel.name === discordCategoryName
        );

        if (!discordCategory) {
            discordCategory = await interaction.guild.channels.create({
                name: discordCategoryName,
                type: ChannelType.GuildCategory,
                reason: `Creation of the category for slots ${category}`
            });
        }

        // Créer le salon du slot
        const channelName = `slot-${owner.username}`;
        const slotChannel = await interaction.guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: discordCategory,
            permissionOverwrites: [
                {
                    id: interaction.guild.id, // @everyone
                    deny: EVERYONE_DENIED_PERMISSIONS
                },
                {
                    id: owner.id, // Propriétaire du slot
                    allow: SLOT_OWNER_PERMISSIONS
                },
                {
                    id: interaction.client.user.id, // Bot
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.ManageMessages,
                        PermissionsBitField.Flags.EmbedLinks
                    ]
                }
            ],
            reason: `Creation of the slot for ${owner.tag}`
        });

        // Créer le slot dans le gestionnaire
        interaction.client.slotManager.createSlot(
            owner.id,
            slotChannel.id,
            category,
            duration,
            pings,
            pingCount,
            expiryDate
        );

        const embed = new EmbedBuilder()
            .setColor(0x2F3136)
            .setTitle(`${duration.charAt(0).toUpperCase() + duration.slice(1)} Slot`)
            .setDescription(`Pings Allowed = ${pingCount}x ${pings === 'everyone' ? '@everyone' : '@here'}`)
            .addFields(
                { 
                    name: 'Slot Owner Id', 
                    value: owner.id, 
                    inline: false 
                },
                { 
                    name: 'Slot Owner Tag', 
                    value: `${owner.tag} 🐱`, 
                    inline: false 
                },
                { 
                    name: 'Must follow the slot rules strictly!', 
                    value: '', 
                    inline: false 
                },
                { 
                    name: 'Always accept middleman', 
                    value: '', 
                    inline: false 
                },
                { 
                    name: 'Category', 
                    value: `${categoryEmoji} ${category} ${categoryEmoji}`, 
                    inline: false 
                },
                { 
                    name: 'Expiry Date', 
                    value: duration === 'lifetime' ? 'Jamais' : `<t:${Math.floor(expiryDate.getTime() / 1000)}:R>`, 
                    inline: false 
                },
                { 
                    name: 'Slot Rules', 
                    value: 'Must follow Slot Rules, <#📜»slot-rules>', 
                    inline: false 
                }
            )
            .setTimestamp()
            .setFooter({ text: 'Naams Slot Bot' });

        // Ajouter l'avatar du bot si disponible
        if (interaction.client.user.displayAvatarURL()) {
            embed.setThumbnail(interaction.client.user.displayAvatarURL());
        }

        await interaction.reply({ embeds: [embed] });

        // Envoyer un message de bienvenue dans le nouveau salon
        const welcomeEmbed = new EmbedBuilder()
            .setColor(0x2F3136)
            .setTitle(`🎉 Welcome to your slot!`)
            .setDescription(`Congratulations ${owner}! Your slot has been created successfully.`)
            .addFields(
                {
                    name: '📋 Slot Information',
                    value: `**Category:** ${categoryEmoji} ${category} ${categoryEmoji}\n**Duration:** ${duration.charAt(0).toUpperCase() + duration.slice(1)}\n**Allowed Pings:** ${pingCount}x ${pings === 'everyone' ? '@everyone' : '@here'}\n**Expiration:** ${duration === 'lifetime' ? 'Never' : `<t:${Math.floor(expiryDate.getTime() / 1000)}:R>`}`,
                    inline: false
                },
                {
                    name: '📜 Important Rules',
                    value: '• Respect the server rules\n• Use your pings with moderation\n• Always accept a middleman for transactions',
                    inline: false
                }
            )
            .setTimestamp()
            .setFooter({ text: 'Naams Slot Bot' });

        await slotChannel.send({ embeds: [welcomeEmbed] });

        } catch (error) {
            console.error('Error creating slot:', error);
            await interaction.reply({ 
                content: '❌ An error occurred while creating the slot. Please check that the bot has the necessary permissions to create channels and categories.', 
                ephemeral: true 
            });
        }
    },
}; 