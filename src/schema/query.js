/* global module */

const query = ( variables, content ) => `query(${ variables }) { ${ content } }`;
const organization = content => `organization(login:$login) { ${ content } }`;
const repository = content => `repository(owner:$owner name:$name) { ${ content } }`;
const label = ( paginationVariable, content ) => `labels(query:$label ${ paginationVariable }) { nodes { ${ content } } }`;
const projects = ( variables, content ) => `projects(${ variables }) { nodes { ${ content } } }`;

module.exports = {
	query,
	organization,
	repository,
	label,
	projects,
};
