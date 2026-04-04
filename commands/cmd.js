const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cmd')
        .setDescription('VlaamsCore central command panel'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setAuthor({ name: 'VlaamsCore Utility Bot', iconURL: interaction.client.user.displayAvatarURL() })
            .setTitle('🚀 Global Command Center')
            .setDescription('Select a category to view the available roleplay and moderation utilities.')
            .setFooter({ text: 'VlaamsCore • Belgian Roleplay' })
            .setTimestamp();

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('cmd_category')
                    .setPlaceholder('Select a category...')
                    .addOptions([
                        { label: '🛡️ Moderation & Protection', description: 'Tools for server security and user management', value: 'cat_mod' },
                        { label: '🎫 Ticket System', description: 'Support management and ticket lifecycle', value: 'cat_ticket' },
                        { label: '🎉 Fun & Social', description: 'Entertainment and community engagement', value: 'cat_fun' },
                    ]),
            );

        await interaction.reply({ embeds: [embed], components: [row] });
    },
};
