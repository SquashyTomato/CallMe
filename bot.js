// Strict Mode
'use strict';

// Node Modules
const Discord = require('discord.js');
const fs = require('fs');
const mysql = require('mysql');
const chalk = require('chalk');

// Utilities
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
const evnt = (cat, event) => require('./Events/' + cat + '/' + event);
const client = new Discord.Client({ autoReconnect: true, disableEveryone: true });
global.servers = [];

// Collections
client.commands = new Discord.Collection();
client.alias = new Discord.Collection();

// SQL Connection
const conn = mysql.createPool({
	host: config.database.host,
	port: config.database.port,
	user: config.database.username,
	password: config.database.password,
    database: config.database.database,
    connectionLimit: config.database.limit,
    supportBigNumbers: true,
    bigNumberStrings: true
});

// SQL Heartbeat
setInterval(function () {
    conn.query('SELECT 1');
}, 10000);

// Events
try {
    // Client Events
    client.on('ready', async () => evnt('Client', 'ready')(client, config));
    client.on('message', async (msg) => evnt('Client', 'message')(client, config, msg));
    client.on('disconnect', async () => evnt('Client', 'disconnect')(client));
    client.on('reconnecting', async () => evnt('Client', 'reconnecting')(client));

    // Guild Events
    client.on('guildCreate', async (guild) => evnt('Guild', 'guildCreate')(client, config, guild));
    client.on('guildDelete', async (guild) => evnt('Guild', 'guildDelete')(client, config, guild));
} catch (err) {
    console.log(chalk.bgRed('ERROR') + ' Unable To Load Event!\n' + err);
}

// Command Loader
const commandDir = fs.readdirSync('./Commands/');
for (const dir of commandDir) {
    if (fs.statSync('./Commands/' + dir).isDirectory()) {
        const commandFile = fs.readdirSync('./Commands/' + dir + '/');
        for (const file of commandFile) {
            const command = require('./Commands/' + dir + '/' + file);
            client.commands.set(command.name, command);
            if (command.alias.length !== 0) {
                command.alias.forEach(alias => {
                    client.alias.set(alias, command.name);
                });
            }
        }
    }
}

// Client Auth
client.login(config.general.token).catch(err => console.log(chalk.bgRed('ERROR') + ' Unable to log into Discord.'));