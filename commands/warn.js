const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user and log it in the database')
        .addUserOption(option => option.setName('user').setDescription('User to warn').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for warning').setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction, client) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        
        let dbStatus = 'Simulation Mode';

        // Persistence logic
        if (client.prisma) {
            try {
                // Ensure user exists in users table
                await client.prisma.users.upsert({
                    where: { id: user.id },
                    update: {},
                    create: { id: user.id, warnings_count: 0 }
                });

                // Create warning
                await client.prisma.warnings.create({
                    data: {
                        user_id: user.id,
                        moderator_id: interaction.user.id,
                        reason: reason
                    }
                });

                // Increment count
                await client.prisma.users.update({
                    where: { id: user.id },
                    data: { warnings_count: { increment: 1 } }
                });

                dbStatus = 'Logged to Database';
            } catch (e) {
                console.error('[DB Error] Warn command:', e.message);
                dbStatus = 'Error saving to DB';
            }
        }
        
        const embed = new EmbedBuilder()
            .setColor('#FFA000')
            .setTitle('⚠️ User Warning')
            .setDescription(`${user} has been warned.`)
            .addFields(
                 { name: 'User', value: user.tag, inline: true },
                 { name: 'Moderator', value: interaction.user.tag, inline: true },
                 { name: 'Reason', value: reason, inline: false }
            )
            .setFooter({ text: `Status: ${dbStatus}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};

