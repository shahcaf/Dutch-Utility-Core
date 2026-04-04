const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vcunmute')
        .setDescription('Server-unmute a user in voice')
        .addUserOption(opt => opt.setName('user').setDescription('The user to unmute').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);

        if (!member.voice.channel) return interaction.reply({ content: '❌ User is not in a voice channel!', ephemeral: true });

        await member.voice.setMute(false);
        await interaction.reply({ content: `🎵 **${user.tag}** has been server-unmuted.` });
    },
};
