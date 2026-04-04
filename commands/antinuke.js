const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

global.antinuke = global.antinuke || new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('antinuke')
        .setDescription('Toggle anti-nuke protection (Limit rapid deletions/creations)')
        .addStringOption(opt => opt.setName('state').setDescription('State').setRequired(true).addChoices({ name: 'Enabled', value: 'on' }, { name: 'Disabled', value: 'off' }))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        const state = interaction.options.getString('state');
        global.antinuke.set(interaction.guildId, state === 'on');
        await interaction.reply(`☢️ **Anti-Nuke** protocol is now **${state === 'on' ? 'Active' : 'Standby'}**.`);
    },
};
