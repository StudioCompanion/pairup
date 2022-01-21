---
title: House rules
sidebar_position: 2
---

As with most projects, we've set up [`eslint`](https://eslint.org/), [`prettier`](https://prettier.io/) & [`husky`](https://typicode.github.io/husky/#/). This helps keep our code uniform and easy to read.

The latter enables little work of the developer to ensure it's adhered to. Although if you use VSCode as your IDE then there's probably a high chance that you'll have the `eslint` and `prettier` extensions installed meaning as you work the code will lint & prettify.

## Husky

> Modern native git hooks made easy (taken from their website)

We currently have two hooks running, a [pre-commit](/getting-started/house-rules#pre-commit) hook and a [commit-msg](/getting-started/house-rules#commit-message) hook.

### Pre-Commit

Our pre-commit hook runs `lint-staged` which in itself runs a few specific commands in the repo. Why do we use `lint-staged` instead of calling the commands directly? Well if you run `yarn prettier:write` it'll prettify every file in the repo. But that takes time, and assuming you've had this all set up from the start, it's a waste of your time. `lint-staged` only runs the scripts on the staged files that are being commited – saving you time!

Our config looks like this:

```js
{
  '*.{js,ts,tsx,css,md}': 'yarn prettier:write',
  '*.{js,ts,tsx}': 'yarn run eslint',
  '*.{ts,tsx}': () => 'yarn run test:ts',
  '*.prisma': () => 'yarn workspace @pairup/api prisma format',
}
```

#### Prettier

`'*.{js,ts,tsx,css,md}': 'yarn prettier:write'`

Prettify any files with the above extensions.

#### Linting

`'*.{js,ts,tsx}': 'yarn run eslint'`

This runs eslint on any `js`, `ts` or `tsx` file we have staged.

#### Type Checking

`'*.{ts,tsx}': () => 'yarn run test:ts'`

This runs typechecking only on the typescript files.

#### Prisma

`'*.prisma': () => 'yarn workspace @pairup/api prisma format'`

Prisma has it's own formatting workflow, so we just run that instead.

### Commit Message

Our commit message hook runs [`commitlint`](https://github.com/conventional-changelog/commitlint) which in combination with the [`conventional commits config`](https://www.conventionalcommits.org/en/v1.0.0/) ensures that commit messages are clear to their purpose. It also helps you mentally seperate those commits so you don't just do a commit like "fixes" which are ambiguous and if you push a breakage in the app (we all do it dw), you can easily identify the commit you need to revert!

To help you write good commit messages, here's some examples:

- fix: articles need Tags to get correct URL
- chore: add env to main.yml
- feat: add image for search hit with no result

## Patch Package

[patch-package](https://github.com/ds300/patch-package) isn't something we actively encourage using, but needs must. In short, patch-package helps you fix bugs in your node_modules instantly, without having to push the fix upstream (although, I would encourage you to do so because it's nice) and then wait for the release. You commonly have to do this with an unmaintained project that you find yourself using.

An up to date list of the packages we patch and why can be found below:

- `react-spring` - legacy patch for 9.4.0-alpha.0 when we were originally transitioning items in `HighlightersArticle`

## Tests

:::caution
Make sure you run these tests before commiting changes because we do run a github action and it'll only catch you then.
There's no escape from the testing suite!
:::

The test command `yarn test` will run typecheck, unit and e2e tests in the terminal for you.

### Unit

We have a few unit tests that test some of our functions. But realistically this isn't the biggest priority for the project. However, we use [`jest`](https://jestjs.io/) in conjunction with [`@testing-library/react`](https://testing-library.com/docs/react-testing-library/intro) for any unit tests we do write, the latter only being used when testing components. To simulate API calls to our services e.g. Klaviyo, we use [`msw`](https://mswjs.io/).

There's also a small test suite for the `SiteNewsletter` as there were a couple of issues on the previous site where form feedback was not given to the client which ended up leaving them confused.

:::note
If you're bored, looking for something to do, wanting some practice on test writing, why not write a unit test or two for other form components to ensure the feedback works as inteded.
:::

### E2E

The real meat of our test suite is the end-to-end (e2e) tests we run against our `web` target. This simulates a real user performing actions on the site and more importantly, ensures that core business flows can still be achieved. The list is ever evolving but currently the test suite handles these key areas:

- Purchasing - can a user quickly add to cart from the three key places?
- Cart - can they remove, can they add, can they increase quantity and checkout?
- Search - can a user find the content they need to?
- Accounts - can a user create / signup / login / reset-password?

## Code Convention

There are a few bits of code convention we like to keep to, a couple of small rules that are wanting to be implemented because of mishaps in the project.

### Exports

:::warning
Do not `export default` unless it's absolutely mandatory e.g a `nextjs` page route.
:::

Instead `export const`. This helps with refactoring and shuffling around a major codebase, it also makes you actually think about the name in the file.

### Styled Components

Give you `styled` components descriptive names, when you're trying to debug a 100 component page a descriptive name will help you dramatically e.g. `Wrap` whilst makes sense in the context of the component you're making, is not helpful in the page, if it's for a carousel why not call it `CarouselWrap`? Few extra characters help you read it back later.
