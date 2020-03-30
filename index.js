// Strict Mode
'use strict';

// Node Modules
const { ShardingManager } = require('discord.js');
const fs = require('fs');
const mysql = require('mysql');
const chalk = require('chalk');

// Utilities
const config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
const packageFile = JSON.parse(fs.readFileSync('./package.json', 'utf-8'));
const shardManager = new ShardingManager('./bot.js', { token: config.general.token, autoSpawn: true });

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

// Console Out
console.log(chalk.gray('----------------------'));
console.log(chalk.cyan('CallMe v' + packageFile.version));
console.log(chalk.red('By SquashyTomato'));
console.log(chalk.gray('----------------------'));
// Database Connection
conn.getConnection(function (err, con) {
    if (err) throw err;
    console.log(chalk.bgGreen('SUCCESS') + ' Connected to Database');
});
console.log(chalk.bgYellow('NOTICE') + ' Spawning Shards...');

// Spawn Shards
shardManager.spawn();

// Launch Event
shardManager.on('launch', (shard) => {
    // Log Out
    console.log(chalk.bgGreen('SUCCESS') + ' Launched Shard ' + shard.id);
});