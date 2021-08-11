# PairUp Web App

The main pair-up web application monorepo, with CMS and web app.

## Authors

- [Josh Ellis](https://www.github.com/joshuaellis)

## Environments

Make a list of the ENVs we have

- Staging –

## Developing

### Prerequisites

- node@16.2.0

### Initial setup

You'll need certain environment variables to run PairUp's functionality in local development. The first step is to:

- Sign up for [Postmark](https://postmarkapp.com), used for sending emails

Then, copy `.env.example` to `.env` and fill out the `.env` file with your environment variables!

```sh
cp .env.example .env
```

Now you're ready to set everything up locally:

1. **Install Docker** by following their [installation instructions for your OS](https://docs.docker.com/get-docker/). Bedrock uses Docker to start the local development database.

2. Then, **install the dependencies** with `yarn`:

```sh
yarn
```

3. **Start the local development database** as well as the Stripe CLI webhook listener (to make payments work) with `docker-compose`:

```sh
docker-compose up
```

4. **Migrate your local development database** to the base schema:

```sh
yarn prisma:migrate
```

### Setting up Dev

We're using yarn workspaces to seperate the packages, yet have a single `node_modules` space (easier to tidy up)

To develop your app, you always need to have two commands running concurrently:

1. **Start the development database** with:

```sh
docker-compose up
```

2. **Start the development process**, which also runs all the necessary code generators:

```sh
yarn web:dev
```

That's it! Now you should have Bedrock running locally and should be able to visit http://localhost:3000 🎉

#### Scripts

The **three most important commands** you'll run frequently during development:

- `yarn web:generate`: Generates the Prisma client ([docs](https://www.prisma.io/docs/concepts/components/prisma-client)), which Nexus uses and generates the GraphQL schema ([docs](https://nexusjs.org/docs/guides/generated-artifacts)), which GraphQL Codegen uses and generates the urql hooks ([docs](https://graphql-code-generator.com/docs/plugins/typescript-urql)). Run this whenever you change the database schema, GraphQL schema or GraphQL queries.

- `yarn web:prisma:migrate`: Creates migration files from your Prisma schema changes and runs those migrations on your local dev db ([docs](https://www.prisma.io/docs/concepts/components/prisma-migrate)). Run this whenever you change your database schema.

- `yarn web:prisma:studio`: Starts [Prisma Studio](https://prisma.io/studio) on `localhost:5555` where you can inspect your local development database.

- `yarn web:cypress:open`: Opens Cypress so you can write and run your end-to-end tests. ([docs](https://docs.cypress.io/guides/getting-started/installing-cypress.html#Adding-npm-scripts))

All the others are used in CI or by those three main scripts, but you should only rarely need to run them manually.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](/tags).

## Documentation

- [DOC]()
