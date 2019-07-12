/* global require, module */

module.exports.loadConfiguration = ( path = "../" ) => {
	try {
		return require( `${ path }config.json` );
	} catch {
		return null;
	}
};

module.exports.determineRepository = ( input, repositories = [] ) => {
	switch ( typeof input ) {
		case "number":
			if ( input >= 0 && input < repositories.length ) {
				return { ...repositories[ input ] };
			}
			break;
		case "object":
			if ( input.owner && input.name ) {
				return {
					owner: input.owner,
					name: input.name,
				};
			} else if ( repositories.length > 0 ) {
				return {
					owner: input.owner || repositories[ 0 ].owner,
					name: input.name || repositories[ 0 ].name,
				};
			}
			break;
	}
	return {};
};

module.exports.wrapRequest = request => request
	.then( response => console.log( response ) )
	.catch( error => console.error( error ) );

module.exports.determinePaginationVariables = input => {
	const name = input.last ? "last" : "first";
	return {
		query: `$${ name }:Int!`,
		label: `${ name }:$${ name }`,
	};
};

module.exports.findObjectValuesInArray = ( needle, haystack, searchIn = null ) => {
	const matches = [];
	const search = needle.toLowerCase();

	// It should be null or an array. Wrap in an array when it's not. It happens when passing one term via `yargs`.
	if ( searchIn !== null && ! Array.isArray( searchIn ) ) {
		searchIn = [ searchIn ];
	}

	haystack.forEach( entry => {
		const keys = searchIn === null ? Object.keys( entry ) : searchIn;
		let found = false;
		keys.forEach( key => {
			if ( entry[ key ] && entry[ key ].toString().toLowerCase().indexOf( search ) !== -1 ) {
				found = true;
			}
		} );
		if ( found ) {
			matches.push( entry );
		}
	} );

	return matches;
};

module.exports.filterArrayObjectKeys = ( input, whitelist ) => input.map( raw => {
	return Object.keys( raw )
		.filter( key => whitelist.includes( key ) )
		.reduce( ( obj, key ) => {
			obj[ key ] = raw[ key ];
			return obj;
		}, {} );
} );

module.exports.arrayToObject = ( input, key ) => {
	const obj = {};
	input.forEach( entry => {
		if ( entry[ key ] ) {
			obj[ entry[ key ] ] = entry;
		}
	} );
	return obj;
};
