#!/usr/bin/env node

const { applyPositionals } = require( "../src/cli" );
const Query = require( "../src/Query" );
const utils = require( "../src/utils" );

const config = utils.loadConfiguration();
if ( config === null ) {
	console.error( "Please add configuration in the form of `config.json`." );
	return;
}

const query = new Query(
	config.token,
	config.repositories || [],
);

const yargs = require( "yargs" )
	.scriptName( "./bin/cli.js" )
	.usage( "$0 <command> [arguments]" )
	.command(
		"repo [repo] [output]",
		"Retrieve repository information",
		yargs => applyPositionals( yargs, [ "repo", "output" ] ),
		yargv => utils.wrapRequest( query.repository( yargv ) )
	)
	.command(
		"labels [repo] [output]",
		"Retrieve labels",
		yargs => applyPositionals( yargs, [ "repo", "labelOutput" ] ),
		yargv => utils.wrapRequest( query.labels( yargv ) )
	)
	.command(
		"label <label> [repo] [searchIn] [output]",
		"Retrieve label information",
		yargs => applyPositionals( yargs, [ "label", "repo", "searchIn", "labelOutput" ] ),
		yargv => utils.wrapRequest( query.label( yargv ) )
	)
	.command(
		"milestones [repo] [output]",
		"Retrieve milestones",
		yargs => applyPositionals( yargs, [ "repo", "milestoneOutput" ] ),
		yargv => utils.wrapRequest( query.milestones( yargv ) )
	)
	.command(
		"milestone <milestone> [repo] [searchIn] [output]",
		"Retrieve milestone information",
		yargs => applyPositionals( yargs, [ "milestone", "repo", "searchIn", "milestoneOutput" ] ),
		yargv => utils.wrapRequest( query.milestone( yargv ) )
	)
	.command(
		"createIssue [repo] [fields]",
		"Create an issue",
		yargs => applyPositionals( yargs, [ "repo", "fields" ] ),
		yargv => utils.wrapRequest( query.createIssue( yargv ) )
	)
	.help()
	.argv;
