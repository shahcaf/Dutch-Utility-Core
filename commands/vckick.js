const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vckick')
        .setDescription('Kick a user from a voice channel')
        .addUserOption(opt => opt.setName('user').setDescription('The user to kick').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);

        if (!member.voice.channel) return interaction.reply({ content: '❌ User is not in a voice channel!', ephemeral: true });

        await member.voice.setChannel(null);
        await interaction.reply({ content: `👢 **${user.tag}** has been kicked from the voice channel.` });
    },
};
