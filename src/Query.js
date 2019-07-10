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

	repository( { repo, output = "id" } ) {
		return this._api(
			schema.query(
				"$owner:String! $name:String!",
				schema.repository( output )
			),
			utils.determineRepository( repo, this._repositories )
		)
			.then( ( { repository } ) => repository );
	}

	label( { label, repo, pagination, output = "id name description" } ) {
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

	milestones( { repo, output = [ "id", "number", "title", "description" ] } ) {
		const repositoryInfo = utils.determineRepository( repo, this._repositories );
		return this._rest.issues.listMilestonesForRepo( {
			owner: repositoryInfo.owner,
			repo: repositoryInfo.name,
		} )
			.then( ( { data } ) => utils.filterArrayObjectKeys( data, output ) );
	}

	milestone( { milestone, repo, output = [ "id", "number", "title", "description" ] } ) {
		const repositoryInfo = utils.determineRepository( repo, this._repositories );
		return this._rest.issues.listMilestonesForRepo( {
			owner: repositoryInfo.owner,
			repo: repositoryInfo.name,
		} )
			.then( ( { data } ) => {
				const matches = [];
				const needle = milestone.toLowerCase();
				data.forEach( milestone => {
					if (
						milestone.title.toLowerCase().indexOf( needle ) !== -1 ||
						milestone.description.toLowerCase().indexOf( needle ) !== -1
					) {
						matches.push( milestone );
					}
				} );
				return utils.filterArrayObjectKeys( matches, output );
			} );
	}

	createIssue( { repo, fields } ) {
		return this.repository( { repo } )
			.then( ( { id } ) => this._api(
				schema.createIssue(),
				{
					input: {
						repositoryId: id,
						...fields,
					}
				}
			) );
	}
}

module.exports = Query;
