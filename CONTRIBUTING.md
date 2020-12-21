# Contributing to PancakeSwap

Thank you for expressing your interest in contributing to PancakeSwap!

## Development

### Submitting a PR

- Create a [draft PR](https://github.blog/2019-02-14-introducing-draft-pull-requests/) as soon as possible so we can view your ongoing progress.
- All pull requests **must** have a description of what the PR is trying to accomplish. Where applicable please provide a checklist of deliverables.
- Keep pull requests as small as possible. Larger pull requests should be broken up into smaller chunks with a dedicated base branch. Please tag the PR's that are merging into your base branch with the `epic` tag.
- If possible self-review your PR and add comments where additional clarification is needed

#### Forking

1. Fork the repository and an [add upstream remote](https://docs.github.com/en/free-pro-team@latest/github/collaborating-with-issues-and-pull-requests/configuring-a-remote-for-a-fork). E.g.

   ```bash
     $ git remote add upstream git@github.com:pancakeswap/pancake-frontend.git
   ```

2. Make sure you have the latest version of `develop` (or applicable base branch)

   ```bash
   $ git checkout develop
   $ git pull upstream develop
   ```

3. Create your own branch `git checkout -b branch-name` and install dependencies
4. When you're ready, create draft PR and happy coding!

### Coding Style

Please follow the style of the project. Most active projects use Typescript, prettier, and eslint to ensure code stays clean and consistent.

#### React

- Keep components as small and ["dumb"](https://en.wikipedia.org/wiki/Pure_function) as possible.
- [Composition over Ineritance](https://reactjs.org/docs/composition-vs-inheritance.html)
- Please check [the UI Kit](https://github.com/pancakeswap/pancake-uikit) before creating a component

### Committing

Our commit message follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) using [commitlint](https://commitlint.js.org/#/).

[From Angular's guidlines](https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#-commit-message-guidelines)

| Type         | Description                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------------- |
| **build**    | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)         |
| **ci**       | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| **docs**     | Documentation only changes                                                                                  |
| **feat**     | A new feature                                                                                               |
| **fix**      | A bug fix                                                                                                   |
| **perf**     | A code change that improves performance                                                                     |
| **refactor** | A code change that neither fixes a bug nor adds a feature                                                   |
| **style**    | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)      |
| **test**     | Adding missing tests or correcting existing tests                                                           |

## License

By contributing your code to the PancakeSwap GitHub repository, you agree to license your contribution under the MIT license.
