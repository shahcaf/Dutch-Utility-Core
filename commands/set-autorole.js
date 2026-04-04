const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-autorole')
        .setDescription('Set the role given to new members')
        .addRoleOption(option => option.setName('role').setDescription('The role').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const role = interaction.options.getRole('role');
        
        const embed = new EmbedBuilder()
            .setColor('#4CAF50')
            .setTitle('⚙️ Configuration Updated')
            .setDescription(`✅ **Autorole** has been set to ${role}. New members will automatically receive this role.`)
            .setFooter({ text: 'VlaamsCore • Configuration' });
        
        await interaction.reply({ embeds: [embed] });
    },
};
