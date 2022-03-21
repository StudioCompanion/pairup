---
title: Deployment
sidebar_position: 6
---

Both the database & API are deployed to [fly.io](https://fly.io/). Migrating the database to the latest version happens as part of the API server's release pipeline through `fly`, this is because it needs to use the exact credentials and database set up when the postgres cluster was connected to the API's server.

## Github Action

For actual deployment you can either use the CLI or preferably, you should just let our Github Action handle it. The action is set up to only run on `push` to the `main` branch. This is because currently we do not have a staging env set up. Although this may come soon. We also check to see if the files changed are inside the `api` or `shared` packages to again, avoid deploying when nothing has changed e.g. we're working on the solely on the native app. This is handled by this section of the `yaml`

```yml
on:
  push:
    branches:
      - 'main'
    paths:
      - 'packages/api/**'
      - 'packages/shared/**'
```

## Docker

Our production `Dockerfile` is designed to hopefully create the smallest final image possible. It installs all deps & production deps in two seperate spaces, builds the app and then copies the production required files to the final image space.

### Deps setup

```Dockerfile
FROM base as deps

WORKDIR /api

# Copy cache & packages required for app build
ADD .yarnrc.yml yarn.lock package.json ./
COPY .yarn/ ./.yarn/
ADD packages/shared/ ./packages/shared/
ADD packages/api/package.json ./packages/api/package.json
RUN yarn install
```

### Prod deps setup

```Dockerfile
FROM base as production-deps

WORKDIR /api

COPY --from=deps /api/node_modules /api/node_modules
ADD .yarnrc.yml yarn.lock package.json ./
COPY .yarn/ ./.yarn/
ADD packages/shared/ ./packages/shared/
ADD packages/api/package.json ./packages/api/package.json
RUN yarn workspaces focus @pairup/api --production
```

### Build

```Dockerfile
FROM base as build

WORKDIR /api

COPY --from=deps /api/node_modules /api/node_modules
ADD packages/shared/ ./packages/shared/
ADD packages/api/ ./packages/api/
ADD tsconfig.json babel.config.js package.json ./

RUN yarn preconstruct:build && yarn generate:api && yarn api:build
```

### Put it together

```Dockerfile
FROM base

WORKDIR /api

COPY --from=production-deps /api/node_modules /api/node_modules
COPY --from=build /api/node_modules/.prisma /api/node_modules/.prisma
COPY --from=build /api/node_modules/nexus-prisma /api/node_modules/nexus-prisma
COPY --from=build /api/packages/api/dist /api/dist
COPY --from=build /api/packages/api/pairup-firebase.json /api/pairup-firebase.json
COPY --from=build /api/packages/shared /api/node_modules/@pairup/shared

ADD packages/api/src/db ./db

CMD ["node", "/api/dist/server/index.js"]
```

We carry the `db` files over so we can run `npx prisma migrate deploy --schema /api/db/schema.prisma` to migrate the database.
