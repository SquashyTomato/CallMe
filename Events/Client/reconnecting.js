// Node Modules
const chalk = require ('chalk');

// Event Module
module.exports = async (client) => {
    // Console Log
    console.log(chalk.bgYellow('NOTICE') + ' Reconnecting at ' + new Date());
};