// Node Modules
const Discord = require('discord.js');
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');

momentDurationFormatSetup(moment);

// Event Module
module.exports = {
    // Command Information
    name: 'info',
    alias: [],
    description: 'Get Information About Me',
    category: 'Core',
    arguments: [],
    permission: 'ALL',
    
    // Command Script
    async execute(client, config, msg, args, raw) {
        // Get Package File Contents
        let pkgFile = require('../../package.json');
        let owner = client.users.cache.get(config.permissions.owner);

        const guildPromise = client.shard.fetchClientValues('guilds.cache.size');
        const channelPromise = client.shard.fetchClientValues('channels.cache.size');
        const userPromise = client.shard.fetchClientValues('users.cache.size');

        Promise.all([guildPromise, channelPromise, userPromise]).then(function(values) {
            let gSize = values[0].reduce((prev, count) => prev + count, 0);
            let cSize = values[1].reduce((prev, count) => prev + count, 0);
            let uSize = values[2].reduce((prev, count) => prev + count, 0);

            // Create Embed
            const embed = new Discord.MessageEmbed()
                .setAuthor(client.user.username + ' v' + pkgFile.version, client.user.avatarURL)
                .setColor(config.misc.color)
                .addField(':spy: Developer', owner.tag, true)
                .addField(':gem: Shard', msg.guild.shardID + '/' + client.shard.count, true)
                .addField(':scroll: Commands', client.commands.size, true)
                .addField(':shield: Guilds', gSize, true)
                .addField(':notebook_with_decorative_cover: Channels', cSize, true)
                .addField(':busts_in_silhouette: Users', uSize, true)
                .addField(':clock1: Uptime', moment.duration(client.uptime).format('d[d ]h[h ]m[m ]s[s]'), false)

            // Send Embed
            msg.channel.send({embed: embed});
        });
    }
};