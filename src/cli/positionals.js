/* global module */

module.exports = {
	repo: {
		type: "object",
		default: {},
		describe: "Object containing the [owner] and [name] of the repository",
	},
	label: {
		type: "string",
		describe: "query labels by name and description",
	},
	milestone: {
		type: "string",
		describe: "query milestones by title and description",
	},
	output: {
		type: "string",
		describe: "the fields to retrieve",
		default: "id",
		optional: true,
	},
	labelOutput: {
		type: "array",
		describe: "the label fields to retrieve",
		default: [ "node_id", "name", "description" ],
		optional: true,
	},
	milestoneOutput: {
		type: "array",
		describe: "the milestone fields to retrieve",
		default: [ "node_id", "title", "description" ],
		optional: true,
	},
	fields: {
		type: "object",
		describe: "Object containing any fields",
		default: {},
		optional: true,
	},
	pagination: {
		type: "object",
		describe: "Object containing pagination",
		default: { last: 100 },
		optional: true,
	},
	searchIn: {
		type: "array",
		describe: "Fields to search in",
		default: [ "name", "title", "description" ],
		optional: true,
	},
};
