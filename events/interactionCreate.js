const { Events, EmbedBuilder, ChannelType, PermissionFlagsBits, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        // Handle Select Menus and Buttons
        if (interaction.isStringSelectMenu() || interaction.isButton()) {
            const embed = new EmbedBuilder().setColor('#2B2D31').setTimestamp();
            const customId = interaction.isStringSelectMenu() ? interaction.values[0] : interaction.customId;
            
            if (customId === 'cmd_category') return; 

            // Ticket Opening Logic
            if (customId.startsWith('open_ticket')) {
                await interaction.deferReply({ ephemeral: true });
                const parts = interaction.customId.split(':');
                const categoryId = parts[1] === 'none' ? null : parts[1];
                const staffRoleId = parts[2] === 'none' ? null : parts[2];

                try {
                    const overwrites = [
                        {
                            id: interaction.guild.roles.everyone.id,
                            deny: [PermissionFlagsBits.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        },
                    ];

                    if (staffRoleId) {
                        overwrites.push({
                            id: staffRoleId,
                            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.ManageMessages],
                        });
                    }

                    const ticketChannel = await interaction.guild.channels.create({
                        name: `ticket-${interaction.user.username}`,
                        type: ChannelType.GuildText,
                        parent: categoryId,
                        permissionOverwrites: overwrites,
                    });

                    // Database persistence
                    if (client.prisma) {
                        await client.prisma.tickets.create({
                            data: {
                                user_id: interaction.user.id,
                                channel_id: ticketChannel.id,
                                status: 'open'
                            }
                        }).catch(e => console.error('[DB Error]', e.message));
                    }

                    const ticketEmbed = new EmbedBuilder()
                        .setColor('#2B2D31')
                        .setTitle('🎫 Ticket Opened')
                        .setDescription(`Hello ${interaction.user}, welcome to your ticket! Please describe your issue clearly.\n\nOur staff will be with you shortly.`)
                        .setFooter({ text: 'VlaamsCore • Ticket System' });

                    const row = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder().setCustomId('claim_ticket').setLabel('Claim Ticket').setStyle(ButtonStyle.Success).setEmoji('🙋‍♂️'),
                            new ButtonBuilder().setCustomId('close_ticket').setLabel('Close Ticket').setStyle(ButtonStyle.Danger).setEmoji('🔒')
                        );

                    await ticketChannel.send({ content: `${interaction.user} | @here`, embeds: [ticketEmbed], components: [row] });
                    return interaction.editReply({ content: `✅ Ticket created: ${ticketChannel}` });
                } catch (error) {
                    console.error('[Ticket Error]', error);
                    return interaction.editReply({ content: '❌ Failed to create ticket. Check permissions.' });
                }
            }

            // General Component Switch
            switch (customId) {
                case 'claim_ticket':
                    if (interaction.message.content.includes('Claimed by:')) {
                         return interaction.reply({ content: '❌ This ticket is already claimed!', ephemeral: true });
                    }
                    const claimEmbed = EmbedBuilder.from(interaction.message.embeds[0])
                         .addFields({ name: 'Claimed By', value: `${interaction.user} (${interaction.user.tag})`, inline: true });
                    
                    await interaction.message.edit({ embeds: [claimEmbed] });
                    return interaction.reply({ content: `✅ You have claimed this ticket!`, ephemeral: true });

                case 'close_ticket':
                    if (!interaction.channel.name.startsWith('ticket-')) return;
                    await interaction.reply('🔒 This ticket will be closed in 5 seconds...');
                    
                    // Update DB status if possible
                    if (client.prisma) {
                        await client.prisma.tickets.updateMany({
                            where: { channel_id: interaction.channel.id },
                            data: { status: 'closed' }
                        }).catch(() => {});
                    }

                    setTimeout(() => interaction.channel.delete().catch(() => {}), 5000);
                    return;

                case 'cat_mod':
                    embed.setTitle('🛡️ Moderation & Protection')
                        .setDescription('Top-tier moderation and server security tools.')
                        .addFields(
                            { name: '🛡️ Protection', value: '`/antispam`, `/antinuke`, `/lock`, `/unlock`, `/slowmode`', inline: false },
                            { name: '🔨 Moderation', value: '`/ban`, `/unban`, `/softban`, `/kick`, `/timeout`, `/warn`, `/clear`, `/nick`', inline: false },
                            { name: '🔊 Voice Mod', value: '`/vckick`, `/vcmute`, `/vcunmute`', inline: false }
                        );
                    break;
                case 'cat_ticket':
                    embed.setTitle('🎫 Ticket System')
                        .setDescription('Complete support management suite.')
                        .addFields(
                            { name: '🎫 Tickets', value: '`/ticket setup`, `/ticket close`, `/ticket add`, `/ticket remove`', inline: false }
                        );
                    break;
                case 'cat_fun':
                    embed.setTitle('🎉 Fun & Social')
                        .setDescription('Entertainment for your community members.')
                        .addFields(
                            { name: '🎮 Games', value: '`/counting setup`, `/8ball`, `/coinflip`, `/rps`', inline: false },
                            { name: '🫂 Social', value: '`/slap`, `/hug`, `/truth`, `/dare`', inline: false }
                        );
                    break;
                default:
                    return; // Silently ignore unknown custom IDs
            }
            
            // For help categories, reply to the select menu interaction
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Handle Slash Commands
        if (!interaction.isChatInputCommand()) return;

        console.log(`[Interaction] Received Command: /${interaction.commandName} from ${interaction.user.tag}`);

        const command = client.commands.get(interaction.commandName);
        if (!command) {
            console.error(`[Error] No command matching ${interaction.commandName} was found.`);
            return interaction.reply({ content: '❌ Command not found or still loading.', ephemeral: true });
        }

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            const errorEmbed = new EmbedBuilder()
                .setColor('#FF0000')
                .setTitle('❌ Execution Error')
                .setDescription('There was an error while executing this command!');

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ embeds: [errorEmbed], ephemeral: true });
            } else {
                await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
            }
        }
    },
};

