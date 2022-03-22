---
title: GraphQL
sidebar_position: 2
---

The GraphQL endpoint is the primary source of interaction for our application. In production it is protected with an API key middleware & some mutations require a Authorization Header containing a [`JWT`](https://jwt.io/introduction) for the logged in user for the mutations to take place.

## Infrastructure

To build out GraphQL schema we use the following libs:

- [apollo-server-express](https://www.npmjs.com/package/apollo-server-express)
- [nexus](https://nexusjs.org/)
- [nexus-prisma](https://github.com/prisma/nexus-prisma/)

Using nexus-prisma integrates our [prisma database](/api/database) into Nexus meaning our schema definitions when interacting with our database can be type-safe in development.

## Structure

The GraphQL schema is split up into distinct areas and the related queries & mutations are prefixed with said area e.g. the `userCreateAccessToken` mutation is part of the `User` section of the schema.

Within each section we have the following structure:

```
├── User
   ├─ enums
   ├─ index
   ├─ inputs
   ├─ mutations
   ├─ queries
   ├─ types
```

The `index` file collates the rest of the other files, pulling them together in an `Array` format for the nexus `createSchema` function. Tests then specific to the GraphQL section are nested within, we test the `queries` and `mutations` using [`jest`](https://jestjs.io/).

## Apollo Studio

When running in development, the server will direct you to [Apollo Studio](https://studio.apollographql.com/). Assuming you are running the API server in development mode you can click this link – [localhost:3000/graphql](http://localhost:3000/graphql). However, to preview the production graph see [here](https://studio.apollographql.com/graph/Pairup-shtrnb/home?variant=current) (note, you must be added to the companion studio organisation to view).

:::danger
This is connected to the production API server, as such mutations will be acted on in the production environment so be careful what actions you perform.
:::

When the API is redeployed to production this schema is automatically updated to reflect those changes.
