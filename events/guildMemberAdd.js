const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(member) {
        // Welcome message logic
        const welcomeChannelId = 'YOUR_WELCOME_CHANNEL_ID'; // Hardcoded for now
        const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

        if (welcomeChannel) {
            const embed = new EmbedBuilder()
                .setColor('#2196F3')
                .setTitle('👋 Welcome to the Server!')
                .setDescription(`Welcome to **${member.guild.name}**, ${member}!`)
                .setThumbnail(member.user.displayAvatarURL())
                .addFields(
                    { name: 'Member Count', value: `${member.guild.memberCount}`, inline: true },
                    { name: 'Account Created', value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true }
                )
                .setFooter({ text: 'Enjoy your stay!' })
                .setTimestamp();

            welcomeChannel.send({ embeds: [embed] });
        }
        
        // Auto-role logic
        const autoroleId = 'YOUR_AUTOROLE_ID'; // Hardcoded for now
        const role = member.guild.roles.cache.get(autoroleId);
        if (role) {
            member.roles.add(role).catch(() => {});
        }
    },
};
