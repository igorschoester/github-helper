/* global require, module */

const graphql = require( "@octokit/graphql" );
const Octokit = require( "@octokit/rest" );
const schema = require( "./schema" );
const utils = require( "./utils" );

class Query {
	constructor( token, repositories = [] ) {
		this._api = graphql.defaults( {
			headers: {
				authorization: `token ${ token }`
			}
		} );
		this._rest = new Octokit( {
			auth() {
				return `token ${ token }`;
			}
		} );
		this._repositories = repositories;
	}

	repository( { repo = {}, output = "id" } = {} ) {
		return this._api(
			schema.query(
				"$owner:String! $name:String!",
				schema.repository( output )
			),
			utils.determineRepository( repo, this._repositories )
		)
			.then( ( { repository } ) => repository );
	}

	labels( { repo = {}, output = [ "node_id", "name", "description" ] } = {} ) {
		const repositoryInfo = utils.determineRepository( repo, this._repositories );
		return this._rest.issues.listLabelsForRepo( {
			owner: repositoryInfo.owner,
			repo: repositoryInfo.name,
			per_page: 9999,
		} )
			.then( ( { data } ) => utils.filterArrayObjectKeys( data, output ) );
	}

	label( { label, repo = {}, searchIn = [ "name", "description" ], output = [ "node_id", "name", "description" ] } ) {
		const repositoryInfo = utils.determineRepository( repo, this._repositories );
		return this._rest.issues.listLabelsForRepo( {
			owner: repositoryInfo.owner,
			repo: repositoryInfo.name,
			per_page: 9999,
		} )
			.then( ( { data } ) => {
				const matches = utils.findObjectValuesInArray( label, data, searchIn );
				return utils.filterArrayObjectKeys( matches, output );
			} );
	}

	labelV4( { label, repo = {}, pagination = {}, output = "id name description" } ) {
		const page = utils.determinePaginationVariables( pagination );
		return this._api(
			schema.query(
				`$owner:String! $name:String! $label:String! ${ page.query }`,
				schema.repository(
					schema.label( page.label, output )
				)
			),
			{
				label,
				...utils.determineRepository( repo, this._repositories ),
				...pagination,
			}
		)
			.then( ( { repository: { labels: { nodes } } } ) => nodes );
	}

	milestones( { repo = {}, output = [ "node_id", "title", "description" ] } = {} ) {
		const repositoryInfo = utils.determineRepository( repo, this._repositories );
		return this._rest.issues.listMilestonesForRepo( {
			owner: repositoryInfo.owner,
			repo: repositoryInfo.name,
			per_page: 9999,
		} )
			.then( ( { data } ) => utils.filterArrayObjectKeys( data, output ) );
	}

	milestone( { milestone, repo = {}, searchIn = [ "title", "description" ], output = [ "node_id", "title", "description" ] } ) {
		const repositoryInfo = utils.determineRepository( repo, this._repositories );
		return this._rest.issues.listMilestonesForRepo( {
			owner: repositoryInfo.owner,
			repo: repositoryInfo.name,
			per_page: 9999,
		} )
			.then( ( { data } ) => {
				const matches = utils.findObjectValuesInArray( milestone, data, searchIn );
				return utils.filterArrayObjectKeys( matches, output );
			} );
	}

	projects( { state = "OPEN", repo = {}, pagination = {}, output = "id name" } = {} ) {
		const repositoryInfo = utils.determineRepository( repo, this._repositories );
		const page = utils.determinePaginationVariables( pagination );
		return this._api(
			schema.query(
				`$login:String! ${ page.query } $state:[ProjectState!]`,
				schema.organization(
					schema.projects(
						`states:$state ${ page.label }`,
						output
					)
				)
			),
			{
				login: repositoryInfo.owner,
				...pagination,
				state,
			}
		)
			.then( ( { organization: { projects: { nodes } } } ) => nodes );
	}

	project( { project, state = "OPEN", repo = {}, pagination = {}, output = "id name" } = {} ) {
		const repositoryInfo = utils.determineRepository( repo, this._repositories );
		const page = utils.determinePaginationVariables( pagination );
		return this._api(
			schema.query(
				`$login:String! ${ page.query } $state:[ProjectState!] $search:String!`,
				schema.organization(
					schema.projects(
						`states:$state ${ page.label } search:$search`,
						output
					)
				)
			),
			{
				login: repositoryInfo.owner,
				...pagination,
				state,
				search: project,
			}
		)
			.then( ( { organization: { projects: { nodes } } } ) => nodes );
	}

	createIssue( { repo = {}, fields = {} } = {} ) {
		return this.repository( { repo } )
			.then( ( { id } ) => this._api(
				schema.createIssue(),
				{
					input: {
						repositoryId: id,
						...fields,
					}
				}
			) )
			.then( ( { createIssue } ) => createIssue );
	}
}

module.exports = Query;
