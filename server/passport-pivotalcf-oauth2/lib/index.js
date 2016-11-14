/**
 * Module dependencies.
 */

var Strategy = require('./strategy');

exports = module.exports = Strategy;

/**
 * Framework version.
 */
require('pkginfo')(module, 'version');

/**
 * Expose constructors.
 */
exports.Strategy = Strategy;
