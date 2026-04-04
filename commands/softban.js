const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('softban')
        .setDescription('Kick a user and delete their messages')
        .addUserOption(opt => opt.setName('user').setDescription('The user').setRequired(true))
        .addStringOption(opt => opt.setName('reason').setDescription('Reason'))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Softban';

        await interaction.guild.members.ban(user.id, { deleteMessageSeconds: 604800, reason: reason });
        await interaction.guild.members.unban(user.id, 'Softban reset');
        
        await interaction.reply({ content: `🔨 **${user.tag}** has been softbanned (messages cleared and kicked).` });
    },
};
