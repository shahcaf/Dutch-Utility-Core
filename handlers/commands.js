const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

module.exports = async (client) => {
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    const commandsArray = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commandsArray.push(command.data.toJSON());
            console.log(`[Command] Loaded ${command.data.name}`);
        } else {
            console.log(`[Warning] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    // Command registration logic
    if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
        console.warn('[Notice] Skipping command registration: Missing DISCORD_TOKEN or CLIENT_ID.');
        return;
    }

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    try {
        console.log(`[Registration] Started refreshing ${commandsArray.length} application (/) commands.`);

        // Register for a specific guild if GUILD_ID is provided (fastest for development)
        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commandsArray },
            );
            console.log(`[Registration] Successfully reloaded local guild (/) commands for ${process.env.GUILD_ID}.`);
        } else {
            // Global registration (can take up to 1 hour to propagate, but usually faster)
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commandsArray },
            );
            console.log('[Registration] Successfully reloaded global (/) commands.');
        }

    } catch (error) {
        console.error('[Registration Error]', error);
    }
};

