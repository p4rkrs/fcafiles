const chalk = require('chalk');

/**
 * Class for logging with custom colours.
 */
class Logger {
	/**
     * Generic information logger
     * @param {String} message Message to print.
     * @static
     */
	static info(message) {
		console.log(`ℹ️ [${chalk.green('info')}] ${chalk.green(message)}`);
	}

	/**
     * Generic warnings. Used for non-fatal errors.
     * @param {String} message Message to print.
     * @static
     */
	static warn(message) {
		console.log(`⚠ [${chalk.yellow('warn')}] ${chalk.yellow(message)}`);
	}

	/**
     * Generic error logging.
     * @param {String} message Message to print.
     * @static
     */
	static error(message) {
		console.log(`🔥 [${chalk.red('err')}] ${chalk.red(message)}`);
	}

	/**
     * Command logging.
     * @param {String} message Message to print.
     */
	static cmd(message) {
		console.log(`🆗 [${chalk.magenta('cmd')}} ${chalk.magenta(message)}`);
	}

	/**
     * Custom logging using custom colours (within chalk range)
     * @param {String} colour Colour to use. Must be a valid chalk colour.
     * @param {String} name Text to display before the message.
     * @param {String} message Message to print.
     * @static
     */
	static custom(colour, name, message) {
		if (!chalk[colour]) throw new Error('colour is not a valid chalk colour.');
		console.log(`🆗 ${chalk[`bg${colour.toLowerCase().charAt(0).toUpperCase()}${colour.toLowerCase().slice(1)}`](name)} ${chalk[colour](message)}`);
	}


	/**
     * Custom error logging
     * @param {String} name Text to display before the message.
     * @param {String} message Message to print.
     * @static
     */
	static customError(name, message) {
		console.error(`🔥 ${chalk.bgRed(name)} ${chalk.red(message)}`);
	}
}

module.exports = Logger;
