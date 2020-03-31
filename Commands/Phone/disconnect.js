// Node Modules
const Discord = require('discord.js');

// Event Module
module.exports = {
    // Command Information
    name: 'disconnect',
    alias: ['dc', 'hangup'],
    description: 'Disconnect from the call',
    category: 'Phone',
    arguments: [],
    permission: 'ALL',
    
    // Command Script
    async execute(client, config, msg, args, raw) {
        conn.getConnection(function (err, con) {

            // Check If In Existing Session Slot
            con.query("SELECT * FROM `sessions` WHERE " + msg.channel.id + " IN(`server1`, `server2`)", function (err, result) {
                if (result.length === 0) return msg.channel.send(':exclamation: | You are not in a session!');

                if (result[0].status === 1) {
                    msg.channel.send(':telephone: | You have ended the session!');
                } else if (result[0].status === 2) {
                    let sendTo;
                    if (result[0].server1 === msg.channel.id) sendTo = result[0].server2;
                    else sendTo = result[0].server1;

                    let recChannel = client.channels.cache.get(sendTo);

                    msg.channel.send(':telephone: | You have ended the session!');
                    recChannel.send(':telephone: | The session has been terminated by the remote user!')
                }
                con.query("UPDATE `sessions` SET `server1` = 0, `server2` = 0, `status` = 0 WHERE `slot` = " + result[0].slot, function (err, result) { if (err) throw err; });
                return;
            });
        });
    }
};