module.exports.determineRepository = ( input, repositories = [] ) => {
	switch ( typeof input ) {
		case "number":
			if ( input >= 0 && input < repositories.length ) return { ...repositories[ input ] };
			break;
		case "object":
			if ( input.owner && input.name ) return {
				owner: input.owner,
				name: input.name,
			};
			else if ( repositories.length > 0 ) return {
				owner: input.owner || repositories[ 0 ].owner,
				name: input.name || repositories[ 0 ].name,
			};
			break;
	}
	return {};
};

module.exports.wrapRequest = request => request
	.then( response => console.log( response ) )
	.catch( error => console.error( error ) )

module.exports.determinePaginationVariables = input => {
	const name = input.last ? "last" : "first";
	return {
		query: `$${ name }:Int!`,
		label: `${ name }:$${ name }`,
	};
}

module.exports.filterArrayObjectKeys = ( input, whitelist ) => input.map( raw => {
	return Object.keys( raw )
		.filter( key => whitelist.includes( key ) )
		.reduce( ( obj, key ) => {
			obj[ key ] = raw[ key ];
			return obj;
		}, {} );
} );
