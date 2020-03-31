// Node Modules
const chalk = require ('chalk');

// Event Module
module.exports = (client, config, guild) => {
    conn.getConnection(function (err, con) {
        con.query("INSERT INTO `servers` (`id`) VALUES (" + guild.id + ")", function (err, result) { if (err) throw err; });
    });
    guild.owner.send(':wave: Hey ' + guild.owner.user.username + ', I am CallMe!\nI am a bot that allows you to speak to other servers to make friends, have a conversation and etc.\n\nTo get started, type `' + config.general.prefix + 'setup` in the channel you would like to use for CallMe.\nFor more commands, type `' + config.general.prefix + 'help` in a server I am in!');
    console.log(chalk.bgCyan('LOG') + ' Joined Guild ' + guild.name + ' (' + guild.id + ')');
};