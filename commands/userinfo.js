const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('userinfo')
        .setDescription('View detailed information about a user')
        .addUserOption(option => option.setName('user').setDescription('User to inspect').setRequired(false)),

    async execute(interaction) {
        const member = interaction.options.getMember('user') || interaction.member;
        const user = member.user;
        
        const embed = new EmbedBuilder()
            .setColor(member.displayHexColor || '#2B2D31')
            .setTitle(`👤 ${user.tag} - Dossier`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'ID', value: user.id, inline: true },
                { name: 'Nickname', value: member.nickname || 'None', inline: true },
                { name: 'Join Date', value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`, inline: true },
                { name: 'Creation Date', value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
                { name: 'Highest Role', value: member.roles.highest.toString(), inline: true },
                { name: 'Permissions', value: member.permissions.has('Administrator') ? 'Administrator' : 'Standard', inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    },
};
