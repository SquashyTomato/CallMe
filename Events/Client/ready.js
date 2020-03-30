// Node Modules
const Discord = require('discord.js');
const fs = require('fs'); 
const chalk = require ('chalk');

// Event Module
module.exports = (client, config) => {
    // Set Client Presence & Array
    const presenceOne = [config.general.prefix + 'help', {type: 'PLAYING'}];
    const presenceTwo = ['for your calls!', {type: 'LISTENING'}];
    const presences = [presenceOne, presenceTwo];

    // Begin Presence Loop
    setInterval(() => {
        let p = Math.floor(Math.random() * presences.length);
        client.user.setActivity(...presences[p]);
    }, 30000);
    
    // Console Logging
    console.log(chalk.green('Guilds: ' + client.guilds.cache.size));
    console.log(chalk.green('Channels: ' + client.channels.cache.size));
    console.log(chalk.green('Users: ' + client.users.cache.size));
    console.log(chalk.green('Commands: ' + client.commands.size));
    console.log(chalk.gray('----------------------'));
};