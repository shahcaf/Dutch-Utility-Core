const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('credit')
        .setDescription('Shows the developers of the bot'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#2B2D31')
            .setTitle('👨‍💻 Bot Credits')
            .setDescription('VlaamsCore was developed with passion to provide high-end server utilities.')
            .addFields(
                { name: 'Developer', value: '<@1414542711683289152>', inline: true },
                { name: 'Core System', value: 'VlaamsCore Framework', inline: true }
            )
            .setFooter({ text: 'VlaamsCore • Powered by High-End Technology' });

        await interaction.reply({ embeds: [embed] });
    },
};
