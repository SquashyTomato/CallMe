// Node Modules
const Discord = require('discord.js');

// Event Module
module.exports = {
    // Command Information
    name: 'support',
    alias: [],
    description: 'Need help?',
    category: 'Core',
    arguments: [],
    permission: 'ALL',
    
    // Command Script
    async execute(client, config, msg, args, raw) {
        msg.channel.send(':question: | Need some help? We can help! https://discord.gg/8XtxgAa');
    }
};