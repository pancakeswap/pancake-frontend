# @pancakeswap/awgmi

connect to Aptos with similar [wagmi](https://github.com/wagmi-dev/wagmi) React hooks.


```jsx
import {
  createClient,
  AwgmiConfig,
  useConnect,
} from '@pancakeswap/awgmi';
import {
  getDefaultProviders,
  MartianConnector,
  PetraConnector,
} from '@pancakeswap/awgmi/core';

export const client = createClient({
  connectors: [new PetraConnector(), new MartianConnector()],
  provider: getDefaultProviders,
  autoConnect: true,
});


function App() {
  return (
    <AwgmiConfig client={client}>
      <YourApp>
    </AwgmiConfig>
  )
}
```
