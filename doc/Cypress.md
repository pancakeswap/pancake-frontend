# Cypress tests

### Run all tests

```bash
yarn build
yarn integration-test
```

### Run just one test

If you want to run single test you first need to build an app and then serve it

```bash
yarn build
serve -s build -p 3000
```

After that you can specify the test to run with the following command

```bash
cypress run --spec cypress/integration/exchange/add-liquidity.test.ts
```

Remember that if you modify the code under test (e.g. adding id to some element) you need to rebuild the app.

### Cypress GUI

Cypress GUI is a nice tool to use if screenshots don't tell enough information.

You open it with

```bash
cypress open
```

It might ask you to update by installing latest GUI version - this will download normal MacOS app which you can open normally without `cypress open`

### Tips and tricks

- If you are trying to debug something in GUI console be sure to switch to context of iFramed app (Click "top &#9660;" and then "Your App: pancake-frontend")
