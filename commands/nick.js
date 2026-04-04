const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nick')
        .setDescription('Change a user nickname')
        .addUserOption(opt => opt.setName('user').setDescription('The user').setRequired(true))
        .addStringOption(opt => opt.setName('name').setDescription('The new nickname').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const member = await interaction.guild.members.fetch(user.id);
        const name = interaction.options.getString('name');

        await member.setNickname(name);
        await interaction.reply({ content: `🏷️ **${user.tag}** nicknamed to **${name}**.` });
    },
};
