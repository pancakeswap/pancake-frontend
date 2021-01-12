# Contributing to the Pancake ecosystem 🥞

Thanks for taking the time to contribute !
You can start by reading our [Contribution guidelines](https://docs.pancakeswap.finance/code/contributing) first.

## Setup

Install the dependencies

```shell
yarn
```

This project uses [Storybook](https://storybook.js.org/). To start development run

```shell
yarn storybook
```

Don't forget to setup your IDE with `eslint` and `prettier`.

## Typing

The whole project is built with TypeScript. Make sure you export only the types needed on the client.
Prefer [using interface over types](https://www.typescriptlang.org/docs/handbook/advanced-types.html#interfaces-vs-type-aliases).

## Projet structure

The entry point is `src/index.ts`, you can find all the exports in this file.

- **components** contains all the atomic and generic components of the UIkit.
- **widgets** contains more complex components with business logic.
- **theme** is where you can find all the styling configuration. It follows the [System UI Theme Specification](https://system-ui.com/theme)
- **hooks** contains generic hooks.
- **utils** contains internal utils functions. It's not meant to be exported.

## Tests

Run tests with `yarn test`.
When you create a component, don't forget to create a snapshot test.
