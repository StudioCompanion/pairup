---
title: Initial setup
sidebar_position: 1
---

## Clone the repo

```sh
$ git clone git@github.com:StudioCompanion/pairup.git
```

## Prerequisites

For all the packages you are working on you must have `nodejs` installed.

- [NodeJs](https://nodejs.org/en/)

However, the other prerequesites you require depend on the package you're working on:

### API

- [Docker](https://www.docker.com/)

### CMS

- Be added to the project in [Sanity](https://www.sanity.io/)

### Native

Follow [this guide](https://reactnative.dev/docs/environment-setup) to get your ENV setup

## Set up the env

Currently there are `.env.examples` in most packages, it's advised to fill these out. Whilst not all the `env` keys are required to run each target e.g Analytic keys it is required to set up your version of the `env`.

Ask the tech lead for access to the `env` variables which will be kept somewhere.

## Install your dependencies

:::caution
This project uses `yarn` workspaces to run. Therefore it is a requirement that an individual uses yarn. Beyond this, the `*.lock` file is incredibly important in larger codebases as mismatched dependencies can cause unexpected bugs that are incredibly difficult to navigate through.
:::

```sh
$ yarn install
```

This will link up the [`husky hooks`](/getting-started/house-rules#husky) & then [`patch-package`](/getting-started/house-rules#patch-package) will run to apply any `node_module` fixes we've implemented.

## Get going!

Now you're ready to start developing, here's a breakdown of the root commands of the project that you should be aware of.

```json
"scripts": {
    // Runs the CMS
    "cms:start": "yarn workspace @pairup/cms start",
    // Runs this documentation!?
    "docs": "yarn workspace @pairup/docs start",
    // Generates all types for the API and Native package using various methods
    "generate": "yarn generate:api && yarn generate:cms && yarn run generate:graphql-codegen",
    // Runs the native app on android
    "native:android": "yarn workspace @pairup/native android && yarn native:start",
    // Runs the native app on ios
    "native:ios": "yarn workspace @pairup/native ios && yarn native:start",
    // Runs all tests
    "test": "yarn test:ts && yarn test:unit",
},
```

:::warning
If you're developing the API server you must use `docker-compose up` as the dev command and then `yarn api:migrate` from the root of the project to initialize the postgres database we require.
:::

There are other scripts such as `lint` and `prettier:check` but the above are enough to get you developing the project.

The **three most important commands** you'll run frequently during development:

- `yarn generate`: Generates the Prisma client ([docs](https://www.prisma.io/docs/concepts/components/prisma-client)), which Nexus uses and generates the GraphQL schema ([docs](https://nexusjs.org/docs/guides/generated-artifacts)), which GraphQL Codegen uses and generates the urql hooks ([docs](https://graphql-code-generator.com/docs/plugins/typescript-urql)). Run this whenever you change the database schema, GraphQL schema or GraphQL queries.

- `yarn api:migrate`: Creates migration files from your Prisma schema changes and runs those migrations on your local dev db ([docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)). Run this whenever you change your database schema.

- `yarn api:studio`: Starts [Prisma Studio](https://prisma.io/studio) on `localhost:5555` where you can inspect your local development database.

All the others are used in CI or by those three main scripts, but you should only rarely need to run them manually.
