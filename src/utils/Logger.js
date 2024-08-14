const colors = require('colors');
const config = require('../config/config');

class Logger {
    static info(message) {
        console.log(colors.green('[INFO]') + colors.white(` ${message}`));
    }

    static debug(message) {
        if (!config.server.debug) return;
        console.log(colors.blue('[DEBUG]') + colors.white(` ${message}`));
    }

    static warn(message) {
        console.log(colors.yellow('[WARN]') + colors.white(` ${message}`));
    }

    static error(message) {
        console.error(colors.red('[ERROR]') + colors.white(` ${message}`));
    }
}

module.exports = Logger;