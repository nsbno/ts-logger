# Vy frontend logging library for TypeScript

This library makes is simple to log messages, errors and other data to Vy's frontend logging service.

## Installation

```bash
npm install @vygruppen/ts-logger
```

## Usage

Create a logger instance and use it to log whatever you want. You have to specify what app you are logging from.

```ts
import { getLogger } from '@vygruppen/ts-logger';
const logger = getLogger({ source: 'my-app' });

try {
  logger.debug('Details details');
  logger.info('This is going fine');
  logger.warn({ message: 'Oh crap wait' }));
}
catch (e) {
  logger.error({ message: 'Ah shucks.', data: e }));
}
```

Note that you can both pass a single string argument, or an object in the shape of `{ message: string, data?: any }` to the logging functions.

You can also specify what environment you are logging from, if you want to override that for whatever reason:

```ts
import { getLogger } from "@vygruppen/ts-logger";
const logger = getLogger({ source: "my-app", environment: "wonky" });
```

### Neat things to know

Since this triggers a network request, the logging functions are async. There shouldn't be any reasons to wait for the request to finish, but you can if you have a particular reason to do so.

The logger is a singleton, so you can create it as many times as you like without any performance penalty.

## Development

This package is based on Vite, and uses TypeScript. To get started, clone the repo, install dependencies with `npm install` and run the dev server:

```bash
npm run dev
```

This will open a live-reloading dev server, with an interactive playground where you can test your changes.

## Release

This project uses Changesets for releases. [Read more about Changesets here](https://github.com/changesets/changesets).

To create a new release, open a pull request, and add a changeset file. Typically, you'd want to do this through the GitHub UI, or you can run `npx changeset` locally to get started.

Once you've added a changeset, you can merge your pull request. This will trigger a GitHub Action that will create a new pull request, which, when merged, will trigger a new release. The release will be published to NPM, and a new GitHub release will be created.

## Questions?

If you have any questions, get in touch with @selbekk.
