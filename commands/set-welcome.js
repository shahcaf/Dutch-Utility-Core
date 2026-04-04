const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-welcome')
        .setDescription('Set the channel for welcome messages')
        .addChannelOption(option => option.setName('channel').setDescription('The welcome channel').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');
        
        const embed = new EmbedBuilder()
            .setColor('#9C27B0')
            .setTitle('⚙️ Configuration Updated')
            .setDescription(`✅ **Welcome Messages** will now be sent to ${channel}.`)
            .setFooter({ text: 'VlaamsCore • Configuration' });
        
        await interaction.reply({ embeds: [embed] });
    },
};
