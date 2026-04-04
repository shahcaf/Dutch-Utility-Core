const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Ticket management system')
        .addSubcommand(subcmd => 
            subcmd.setName('setup')
                .setDescription('Setup a custom ticket opening panel')
                .addChannelOption(opt => opt.setName('channel').setDescription('Channel to send panel').addChannelTypes(ChannelType.GuildText))
                .addChannelOption(opt => opt.setName('category').setDescription('Category to create tickets in').addChannelTypes(ChannelType.GuildCategory))
                .addRoleOption(opt => opt.setName('staff_role').setDescription('Role allowed to see and manage tickets').setRequired(false))
                .addStringOption(opt => opt.setName('title').setDescription('The title of the ticket panel').setRequired(false))
                .addStringOption(opt => opt.setName('description').setDescription('The description of the ticket panel').setRequired(false))
                .addStringOption(opt => opt.setName('button_label').setDescription('The text on the open button').setRequired(false))
                .addStringOption(opt => 
                    opt.setName('button_color')
                        .setDescription('Color of the button')
                        .setRequired(false)
                        .addChoices(
                            { name: 'Blue (Primary)', value: 'Primary' },
                            { name: 'Green (Success)', value: 'Success' },
                            { name: 'Gray (Secondary)', value: 'Secondary' },
                            { name: 'Red (Danger)', value: 'Danger' }
                        )
                )
        )
        .addSubcommand(subcmd => subcmd.setName('close').setDescription('Close the current ticket channel'))
        .addSubcommand(subcmd => subcmd.setName('add').setDescription('Add a user to the ticket').addUserOption(opt => opt.setName('user').setDescription('User to add').setRequired(true)))
        .addSubcommand(subcmd => subcmd.setName('remove').setDescription('Remove a user from the ticket').addUserOption(opt => opt.setName('user').setDescription('User to remove').setRequired(true)))
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {
        const sub = interaction.options.getSubcommand();
        
        if (sub === 'setup') {
            const channel = interaction.options.getChannel('channel') || interaction.channel;
            const category = interaction.options.getChannel('category');
            const staffRole = interaction.options.getRole('staff_role');
            const title = interaction.options.getString('title') || '🎫 Community Support';
            const description = interaction.options.getString('description') || 'Need help? Open a ticket below to talk with our staff team.';
            const btnLabel = interaction.options.getString('button_label') || 'Open Ticket';
            const btnColor = interaction.options.getString('button_color') || 'Primary';

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor('#2B2D31')
                .setFooter({ text: 'VlaamsCore • Support System' });
            
            const catId = category ? category.id : 'none';
            const roleId = staffRole ? staffRole.id : 'none';
            const customId = `open_ticket:${catId}:${roleId}`;

            const btn = new ButtonBuilder()
                .setCustomId(customId)
                .setLabel(btnLabel)
                .setStyle(ButtonStyle[btnColor])
                .setEmoji('🎫');

            const row = new ActionRowBuilder().addComponents(btn);
            
            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: '✅ Custom ticket panel sent!', ephemeral: true });
        } else if (sub === 'close') {
            if (!interaction.channel.name.startsWith('ticket-')) {
                return interaction.reply({ content: '❌ You can only close ticket channels.', ephemeral: true });
            }
            await interaction.reply('🔒 Closing ticket in 5 seconds...');
            setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
        } else if (sub === 'add') {
             if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Use this in a ticket!', ephemeral: true });
             const user = interaction.options.getUser('user');
             await interaction.channel.permissionOverwrites.create(user, { ViewChannel: true, SendMessages: true });
             interaction.reply(`✅ Added ${user} to the ticket.`);
        } else if (sub === 'remove') {
             if (!interaction.channel.name.startsWith('ticket-')) return interaction.reply({ content: '❌ Use this in a ticket!', ephemeral: true });
             const user = interaction.options.getUser('user');
             await interaction.channel.permissionOverwrites.delete(user);
             interaction.reply(`❌ Removed ${user} from the ticket.`);
        }
    },
};
