const query = ( variables, content ) => `query(${ variables }) { ${ content } }`;
const repository = content => `repository(owner:$owner name:$name) { ${ content } }`;
const label = ( paginationVariable, content ) => `labels(query:$label ${ paginationVariable }) { nodes { ${ content } } }`;

module.exports = {
	query,
	repository,
	label,
};
