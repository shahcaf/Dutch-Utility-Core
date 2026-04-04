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

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    try {
        console.log(`Started refreshing ${commandsArray.length} application (/) commands.`);

        // The put method is used to fully refresh all commands
        // If GUILD_ID is provided, register for testing. Otherwise, global.
        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                { body: commandsArray },
            );
            console.log('Successfully reloaded local guild (/) commands.');
        } else {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commandsArray },
            );
            console.log('Successfully reloaded global (/) commands.');
        }

    } catch (error) {
        console.error(error);
    }
};
