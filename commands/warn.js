const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption(option => option.setName('user').setDescription('User to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        
        const embed = new EmbedBuilder()
            .setColor('#FFA000')
            .setTitle('⚠️ User Warning')
            .setDescription(`${user} has been warned.`)
            .addFields(
                 { name: 'User', value: user.tag, inline: true },
                 { name: 'Moderator', value: interaction.user.tag, inline: true },
                 { name: 'Reason', value: reason, inline: false }
            )
            .setFooter({ text: 'Warning logged (Simulation)' });

        await interaction.reply({ embeds: [embed] });
    },
};
