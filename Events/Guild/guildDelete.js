// Node Modules
const chalk = require ('chalk');

// Event Module
module.exports = (client, config, guild) => {
    conn.getConnection(function (err, con) {
        con.query("DELETE FROM `servers` WHERE `id` = " + guild.id, function (err, result) { if (err) throw err; });
    });
    console.log(chalk.bgCyan('LOG') + ' Left Guild ' + guild.name + ' (' + guild.id + ')');
};