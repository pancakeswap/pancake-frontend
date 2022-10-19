# @pancakeswap/awgmi

connect to Aptos with similar [wagmi](https://github.com/wagmi-dev/wagmi) React hooks.


```jsx
import {
  createClient,
  AwgmiConfig,
  useConnect,
  getDefaultProviders,
} from '@pancakeswap/awgmi';
import { PetraConnector } from '@pancakeswap/awgmi/connectors/petra'
import { MartianConnector } from '@pancakeswap/awgmi/connectors/martain'

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
