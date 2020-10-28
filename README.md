[![Netlify Status](https://api.netlify.com/api/v1/badges/df24023e-4547-4d12-9d3c-77bde6c9463f/deploy-status)](https://app.netlify.com/sites/farm-preprod/deploys)
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

# Localisation

_In order for the Crowdin API queries to work - you will need `REACT_APP_CROWDIN_APIKEY` & `REACT_APP_CROWDIN_PROJECTID` env variables set in your root `.env.development.local` file - please contact a dev if you need these._

### Adding translations

There are two methods for adding translations, both are valid, and it depends on the context in which you are trying to implement the translation as to which you should use.

#### 1. Using `TranslateString` within `translateTextHelpers`

If you need to translate a string that exists within another string, i.e:

```js
<span>
  I need to translate this bit of the span. I don't need to translate this
  second sentence.
</span>
```

Or, a string that is being passed into a component as props, i.e.:

```js
<Component label="This text need translated" />
```

Then you should make use of the `TranslateString` method within `translateTextHelpers`.

It takes in the `translationId` (found in Crowdin) as the first argument, and a string of fallback text as the second argument, which is rendered if the translation isn't found, 


```js
import { TranslateString } from '../translateTextHelpers'
<StyledLink>🍯 {TranslateString(282, 'SYRUP Pool')}</StyledLink>
```

```js
import { TranslateString } from '../translateTextHelpers'
<Button text={`🔓 ${TranslateString(292, 'Unlock Wallet')}`} />
```

#### 2. Using `TranslatedText` component

This is a simple abstraction of the `TranslateString` method, wrapping it within a React Component - this can be a visually simpler pattern, if you are wanting to translate standalone piece of text.

It takes in a `translationId` prop and whatever is passed as `{children}` is used for the fallback, i.e.:

```js
<StyledLink to="/farms">
    <TranslatedText translationId={278}>Farm</TranslatedText>
</StyledLink>
<StyledLink to="/staking">
    <TranslatedText translationId={280}>Staking</TranslatedText>
</StyledLink>
```

### Variables

The translation component can handle variables being passed in from Crowdin, with no code changes.

It will only work if there is only **one** variable passed in, and if that variable within Crowdin is wrapped in **%** signs, i.e.:

Translation in crowdin: `%asset% Earned` [link](https://crowdin.com/translate/pancakeswap/8/en-de#330)

Code:

```js
<Label text={TranslateString(330, 'CAKE Earned')} />
```

---
