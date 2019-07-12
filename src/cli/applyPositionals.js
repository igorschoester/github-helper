/* global require, module */

const positionals = require( "./positionals" );

module.exports = ( yargs, names ) => {
	names.forEach( name => {
		if ( ! positionals[ name ] ) {
			return;
		}
		yargs = yargs.positional( name, positionals[ name ] );
	} );
	return yargs;
};
