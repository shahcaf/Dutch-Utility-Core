const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');

// Global in-memory storage (Resets on bot restart)
global.countingChannels = global.countingChannels || new Map();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('counting')
        .setDescription('Manage the counting system')
        .addSubcommand(subcmd => 
            subcmd.setName('setup')
                .setDescription('Set the channel for counting')
                .addChannelOption(opt => opt.setName('channel').setDescription('Channel').addChannelTypes(ChannelType.GuildText))
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

    async execute(interaction) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        
        global.countingChannels.set(interaction.guildId, {
            channelId: channel.id,
            currentNumber: 0,
            lastUser: null
        });

        await interaction.reply(`✅ Counting system enabled in ${channel}! **Starting with 1.**`);
    },
};
