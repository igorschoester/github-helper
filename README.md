# Node GitHub helper

See for more information:
- GitHub [GraphQL API v4](https://developer.github.com/v4/).
- GitHub [GraphQL API v3](https://developer.github.com/v3/).
- Client [@octokit/graphql](https://github.com/octokit/graphql.js).
- Client [@octokit/rest](https://github.com/octokit/rest.js).
- CLI [yargs](https://github.com/yargs/yargs).

## Setup
- Copy `config.example.json` and name it `config.json`.
- Fill in your [GitHub developer token](https://help.github.com/en/articles/creating-a-personal-access-token-for-the-command-line).
- The configuration has a `repositories` entry for ease of use, you can provide an index (defaults to 0) instead of `owner` and `name`.
- The `project` and `points` are for use with the `createIssue` binary.

## CLI
Interact with GitHub through the CLI: `./bin/cli.js --help`.
Pretty limited as the goal was `createIssue`.

## createIssue
Usage: `./bin/createIssue.js <type of release> <version>`.
- The type of release can be one of: `release`, `rc` and `rc+`.
- The version is used in the title and milestone.

This command loops through all the repository entries in your configuration and prompts whether or not to create an issue for it.
- The title is: `Release <version>` for the `release` or `Create <version>` for `rc` or `rc+`.
- The labels are set to `in sprint` and what the config's `points` entry is set to.
- The milestone is set to the `version` for `release` and a split version (it splits on `-`) for `rc` or `rc+`. When the version is `12.3-RC4` the milestone will be `12.3`.
- The project is set to the config's repository entry `project`. This entry is optional.
