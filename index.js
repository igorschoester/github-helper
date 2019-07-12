const config = require( "./config.json" );
const { applyPositionals } = require( "./src/cli" );
const Query = require( "./src/Query" );
const { wrapRequest } = require( "./src/utils" );

const query = new Query(
	config.token,
	config.repositories || [],
);

const yargs = require( "yargs" )
	.scriptName( "yarn start" )
	.usage( "$0 <command> [arguments]" )
	.command(
		"repo [repo] [output]",
		"Retrieve repository information",
		yargs => applyPositionals( yargs, [ "repo", "output" ] ),
		yargv => wrapRequest( query.repository( yargv ) )
	)
	.command(
		"labels [repo] [output]",
		"Retrieve labels",
		yargs => applyPositionals( yargs, [ "repo", "labelOutput" ] ),
		yargv => wrapRequest( query.labels( yargv ) )
	)
	.command(
		"label <label> [repo] [searchIn] [output]",
		"Retrieve label information",
		yargs => applyPositionals( yargs, [ "label", "repo", "searchIn", "labelOutput" ] ),
		yargv => wrapRequest( query.label( yargv ) )
	)
	.command(
		"milestones [repo] [output]",
		"Retrieve milestones",
		yargs => applyPositionals( yargs, [ "repo", "milestoneOutput" ] ),
		yargv => wrapRequest( query.milestones( yargv ) )
	)
	.command(
		"milestone <milestone> [repo] [searchIn] [output]",
		"Retrieve milestone information",
		yargs => applyPositionals( yargs, [ "milestone", "repo", "searchIn", "milestoneOutput" ] ),
		yargv => wrapRequest( query.milestone( yargv ) )
	)
	.command(
		"createIssue [repo] [fields]",
		"Create an issue",
		yargs => applyPositionals( yargs, [ "repo", "fields" ] ),
		yargv => wrapRequest( query.createIssue( yargv ) )
	)
	.help()
	.argv;
