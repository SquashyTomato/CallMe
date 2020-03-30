// Node Modules
const chalk = require ('chalk');

// Event Module
module.exports = (client, config, guild) => {
    conn.getConnection(function (err, con) {
        con.query("INSERT INTO `servers` (`id`) VALUES (" + guild.id + ")", function (err, result) { if (err) throw err; });
    });
    console.log(chalk.bgCyan('LOG') + ' Joined Guild ' + guild.name + ' (' + guild.id + ')');
};