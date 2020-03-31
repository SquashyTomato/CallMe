// Node Modules
const Discord = require('discord.js');

// Event Module
module.exports = {
    // Command Information
    name: 'setup',
    alias: [],
    description: 'Configure your server for calling',
    category: 'Core',
    arguments: [],
    permission: 'MANAGE_GUILD',
    
    // Command Script
    async execute(client, config, msg, args, raw) {
        // Variables
        let user = client.users.cache.get(msg.author.id);

        msg.channel.send(':gear: | Hey <@' + msg.author + '>! Let\'s get you all set up!\n\nWould you like to use <#' + msg.channel + '> for your CallMe sessions?\nType `confirm` to apply or `abort` to cancel. (You can run the command again in the appropiate channel if needed!)');

        // Create Collector
        const collector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { time: 25000 });
        collector.on('collect', msg => {
            if (msg.content == 'confirm') {
                conn.getConnection(function (err, con) {
                    con.query("UPDATE `servers` SET `channel` = " + msg.channel.id + " WHERE `id` = " + msg.guild.id, function (err, result) { if (err) throw err; });
                });
                msg.channel.send(':white_check_mark: | Channel is now configured for CallMe sessions! Type `' + config.general.prefix + 'phone` to begin calling!\nTo change the channel just type `' + config.general.prefix + 'setup` again.');
                return;
            } else if (msg.content == 'abort') {
                return msg.channel.send(':x: | Aborted');
            } else {
                return msg.channel.send(':x: | Aborted (Ran out of time)');
            }
        });
    }
};