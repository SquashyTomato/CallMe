// Node Modules
const Discord = require('discord.js');

// Event Module
module.exports = {
    // Command Information
    name: 'phone',
    alias: ['call'],
    description: 'Call a random server',
    category: 'Phone',
    arguments: [],
    permission: 'ALL',
    
    // Command Script
    async execute(client, config, msg, args, raw) {
        conn.getConnection(function (err, con) {
            // Check Setup & Call Channel
            con.query("SELECT * FROM `servers` WHERE `id` = " + msg.guild.id, function (err, result) {
                // If Not Set Up
                if (!(result[0].channel)) return msg.channel.send(':no_entry_sign: | Phone as not been set up, run `' + config.general.prefix + 'setup` to begin calling!');
                // If Not In Call Channel
                if (!(result[0].channel == msg.channel.id)) return msg.channel.send(':no_entry_sign: | Command can only be ran in <#' + result[0].channel + '>');

                // Check If In Existing Session Slot
                con.query("SELECT * FROM `sessions` WHERE " + msg.channel.id + " IN(`server1`, `server2`)", function (err, result) {
                    if (result.length > 0) {
                        if (result[0].status === 1) return msg.channel.send(':exclamation: | You are waiting for a session! Run `' + config.general.prefix + 'disconnect` to end.');
                        if (result[0].status === 2) return msg.channel.send(':exclamation: | You are in a session! Run `' + config.general.prefix + 'disconnect` to end.');
                    }

                    // Check Slot Availability
                    con.query("SELECT * FROM `sessions` WHERE `status` = 2", function (err, result) {
                        if (!(result)) return msg.channel.send(':no_entry_sign: | No slots available, try again later!');

                        msg.channel.send(':telephone: | Calling...');

                        // Check Waiting Slots
                        con.query("SELECT * FROM `sessions` WHERE `status` = 1", function (err, resultWaiting) {
                            // Get Next Slot
                            if (resultWaiting.length > 0) {
                                con.query("UPDATE `sessions` SET `server2` = " + msg.channel.id + ", `status` = 2 WHERE `slot` = " + resultWaiting[0].slot, function (err, result) { if (err) throw err; });
                                msg.channel.send(':telephone: | You are now in session, say hi!');
                                client.channels.cache.get(resultWaiting[0].server1).send(':telephone: | You are now in session, say hi!');
                                return;
                            } else {
                                // No Waiting Slots, Join Empty Slot
                                con.query("SELECT * FROM `sessions` WHERE `server1` = 0", function (err, resultFree) {
                                    if (resultFree.length > 0) {
                                        con.query("UPDATE `sessions` SET `server1` = " + msg.channel.id + ", `status` = 1 WHERE `slot` = " + resultFree[0].slot, function (err, result) { if (err) throw err; });
                                    
                                        setTimeout(function(){
                                            con.query("SELECT * FROM `sessions` WHERE " + msg.channel.id + " IN(`server1`, `server2`)", function (err, resultTimeout) {
                                                if (resultTimeout.length > 0) {
                                                    if (resultTimeout[0].status == 1) return msg.channel.send(':no_entry_sign: | Nobody has joined your session, closing...');
                                                    con.query("UPDATE `sessions` SET `server1` = 0, `server2` = 0, `status` = 0 WHERE `slot` = " + resultFree[0].slot, function (err, result) { if (err) throw err; });
                                                }
                                            });
                                        }, 30000);
                                    }
                                });
                            }
                        });

                    });

                });

            });

        });
    }
};