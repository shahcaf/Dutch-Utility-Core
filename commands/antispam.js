const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

global.antispam = global.antispam || new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antispam')
        .setDescription('Toggle anti-spam protection')
        .addStringOption(opt => opt.setName('state').setDescription('State').setRequired(true).addChoices({ name: 'Enabled', value: 'on' }, { name: 'Disabled', value: 'off' }))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const state = interaction.options.getString('state');
        global.antispam.set(interaction.guildId, state === 'on');
        await interaction.reply(`🛡️ **Anti-Spam** is now **${state === 'on' ? 'Enabled' : 'Disabled'}**.`);
    },
};
