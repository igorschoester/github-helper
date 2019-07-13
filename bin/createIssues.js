#!/usr/bin/env node
/* global require, process */

const readline = require( "readline" );
const Query = require( "../src/Query" );
const utils = require( "../src/utils" );

const { log, error, warn } = console;

const config = utils.loadConfiguration();
if ( config === null ) {
	error( "Please add configuration in the form of `config.json`." );
	return;
}
if ( ! config.repositories || config.repositories.length < 1 ) {
	error( "Please supply the repositories in your `config.json`." );
	return;
}
for ( let i = 0; i < config.repositories.length; i++ ) {
	const { owner, name, points } = config.repositories[ i ];
	if ( ! owner || ! name || ! points ) {
		error( "Please supply each repository with an 'owner', 'name' and 'points' entry." );
		return;
	}
}

let type = process.argv[ 2 ];
type = type && type.toLowerCase();
if ( ! [ "release", "rc", "rc+" ].includes( type ) ) {
	error( "Please supply the type of the issues to create: 'release', 'rc' or 'rc+'." );
	return;
}

const version = process.argv[ 3 ];
if ( ! version || version.length < 1 ) {
	error( "Please supply the version for the issue." );
	return;
}

const determineOptions = ( type, repository ) => {
	if ( ! repository.points[ type ] ) {
		error( `Please supply the points for '${ type }' in the '${ repository.name }' repository.` );
		return null;
	}

	const options = {};
	if ( repository.project ) {
		options.project = repository.project;
	}

	switch ( type ) {
		case "release":
			options.title = `Release ${ version }`;
			options.labels = [ "in sprint", repository.points[ type ] ];
			options.milestone = version;
			break;
		case "rc":
			options.title = `Create ${ version }`;
			options.labels = [ "in sprint", repository.points[ type ] ];
			options.milestone = version.split( "-" )[ 0 ];
			break;
		case "rc+":
			options.title = `Create ${ version }`;
			options.labels = [ "in sprint", repository.points[ type ] ];
			options.milestone = version.split( "-" )[ 0 ];
			break;
	}
	return options;
};

const query = new Query(
	config.token,
	config.repositories,
);

const createIssue = async ( repository ) => {
	const options = determineOptions( type, repository );
	const data = {
		repo: {
			owner: repository.owner,
			name: repository.name,
		},
		fields: {
			title: options.title,
		},
	};
	const requests = [ query.labels( { repo: repository } ), query.milestones( { repo: repository } ) ];

	if ( options.project ) {
		requests.push( query.project( { project: options.project, repo: repository, pagination: { first: 1 } } ) );
	}

	let [ labels, milestones, projects ] = await Promise.all( requests );

	data.fields.labelIds = [];
	labels = utils.arrayToObject( labels, "name" );
	for ( let i = 0; i < options.labels.length; i++ ) {
		const label = labels[ options.labels[ i ] ];
		if ( ! label ) {
			warn( `Label '${ options.labels[ i ] }' not found in '${ repository.name }'. Skipping.` );
			return;
		}
		data.fields.labelIds.push( label.node_id );
	}

	milestones = utils.arrayToObject( milestones, "title" );
	if ( ! milestones[ options.milestone ] ) {
		warn( `Milestone '${ options.milestone }' not found in ${ repository.name }. Skipping.` );
		return;
	}
	data.fields.milestoneId = milestones[ options.milestone ].node_id;

	if ( projects && projects.length > 0 ) {
		projects = utils.arrayToObject( projects, "name" );
		if ( ! projects[ options.project ] ) {
			warn( `Project '${ options.project }' not found in ${ repository.owner }. Skipping.` );
			return;
		}
		data.fields.projectIds = [ projects[ options.project ].id ];
	}

	query.createIssue( data )
		.then( () => log( "Issue created successfully." ) )
		.catch( e => error( "Error trying to create issue.", e ) );
};

// See: https://nodejs.org/api/readline.html#readline_readline_createinterface_options
const readlineInterface = readline.createInterface( {
	input: process.stdin,
	output: process.stdout,
} );

const askQuestion = ( index ) => {
	const next = () => {
		index++;
		if ( index >= config.repositories.length ) {
			return readlineInterface.close();
		}
		askQuestion( index );
	};

	readlineInterface.question( `Create issue for ${ config.repositories[ index ].name }? [Y/n/x] `, async answer => {
		answer = answer.toString().toLowerCase().trim();
		switch ( answer ) {
			default:
				await createIssue( config.repositories[ index ] );
				next();
				break;
			case "n":
				next();
				break;
			case "x":
				readlineInterface.close();
				break;
		}
	} );
};

askQuestion( 0 );
