---
title: Overview
sidebar_position: 1
---

Our API server is built on Express, it uses a [`ApolloServer`](https://www.apollographql.com/docs/apollo-server/) to run the graphql endpoint at `/graphql` in conjuntion with a few REST API routes. These additional REST endpoints are documented [here](/api/rest-endpoints).

Both the database and api server run inside `Docker`, this makes the dev environment easier to set up with one simple command `docker-compose up`. When this command is called, the cli uses `docker-compose.override.yml` and then accesses the `Dockerfile.dev` configuration.
