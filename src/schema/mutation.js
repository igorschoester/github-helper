const mutation = ( input, content ) => `mutation($input:${ input }) { ${ content } }`;
const createIssue = ( output = "clientMutationId" ) => mutation( "CreateIssueInput!", `createIssue(input:$input) { ${ output } }` );

module.exports = {
	mutation,
	createIssue,
};
