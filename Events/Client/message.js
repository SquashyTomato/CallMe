// Node Modules
const Discord = require('discord.js');
const fs = require('fs'); 
const chalk = require ('chalk');

// Event Module
module.exports = (client, config, msg) => {
    // Command Variables
    let command = msg.content.split(' ')[0];
    command = command.slice(config.general.prefix.length);
    let args = msg.content.split(' ').slice(1);
    let raw = msg.content.split(' ').slice(1).join(' ');

    // User & Channel Checks
    if (msg.author.bot || msg.channel.type == 'dm') return;

    if (!(msg.content.startsWith(config.general.prefix))) {
        conn.getConnection(function (err, con) {
            // Check Setup & Call Channel
            con.query("SELECT * FROM `servers` WHERE `id` = " + msg.guild.id, function (err, result) {
                if (!(result[0].channel == msg.channel.id)) return;

                // Check If In Existing Session Slot
                con.query("SELECT * FROM `sessions` WHERE " + msg.channel.id + " IN(`server1`, `server2`)", function (err, result) {
                    if (result.length > 0) {
                        let sendTo;
                        if (result[0].server1 === msg.channel.id) sendTo = result[0].server2;
                        else sendTo = result[0].server1;

                        let recChannel = client.channels.cache.get(sendTo);

                        if (msg.content.length > 1900) return msg.react('❌');

                        if (msg.author.id === config.permissions.owner) return recChannel.send('<' + config.misc.emote + '> | <' + config.misc.devEmote + '> **' + msg.author.username + '**#' + msg.author.discriminator + ': ' + msg.content);
                        else return recChannel.send('<' + config.misc.emote + '> | **' + msg.author.username + '**#' + msg.author.discriminator + ': ' + msg.content);
                    }
                });
            });
        });
    } else if (msg.content.startsWith(config.general.prefix)) {
        // Execute Command
        try {
            // Check If Command
            if (client.commands.has(command)) command = client.commands.get(command);
            // Check If Alias
            else if (client.alias.has(command)) command = client.commands.get(client.alias.get(command));
            // Command Is Not Command Or Alias
            else return;

            // Check Command Permissions
            let hasPermission = false;
            let alertPrompt = false;
            switch (command.permission.toUpperCase()) {
                case 'OWNER':
                    if (msg.author.id == config.permissions.owner) hasPermission = true;
                    break;
                case 'ALL':
                    hasPermission = true;
                    break;
                default:
                    if (msg.author.id == config.permissions.owner) hasPermission = true;
                    else if (msg.member.hasPermission(command.permission.toUpperCase(), false, false)) hasPermission = true;
                    alertPrompt = true;
                    break;
            }

            if (hasPermission == false) {
                if (alertPrompt == true) return msg.channel.send(':negative_squared_cross_mark: | You require the `' + command.permission.toUpperCase() + '` permission to do this.');
                else return;
            }

            // Check If Command Has Arguments
            if (command.arguments.length > 0) {
                // Loop Through Arguments
                let argCount = 0;
                for (const argu of command.arguments) {
                    if (command.arguments[argCount].p != '') {
                        // Check If Argument Was Entered
                        if (!args[argCount]) return msg.channel.send(':negative_squared_cross_mark: | ' + command.arguments[argCount].p);
                    }
                    argCount++;
                }
            }

            // Execute Command & Log
            command.execute(client, config, msg, args, raw);
            console.log(chalk.bgCyan('LOG') + ' Command Executed by ' + msg.author.tag + ' in guild ' + msg.guild.name + ' : ' + msg.content);
        } catch (err) {
            // Catch Errors
            if (err.message.startsWith('Cannot find module')) return;
            console.log(chalk.bgRed('ERROR') + ' ' + err);
        }
    }
};