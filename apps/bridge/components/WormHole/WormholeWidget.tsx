import WormholeBridge from '@wormhole-foundation/wormhole-connect'
import { useMemo } from 'react'
import styled, { useTheme } from 'styled-components'
import {
  DEFAULT_MAINNET_RPCS,
  DEFAULT_TESTNET_RPCS,
  MAINNET_TOKEN_KEYS,
  NETWORKS,
  TESTNET_TOKEN_KEYS,
  devEnv,
} from './constants'
import { wormHoleDarkTheme, wormHoleLightTheme } from './theme'

const Page = styled.div`
  min-height: 100vh;
  height: max-content;
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`
export const WormholeBridgeWidget = () => {
  const theme = useTheme()

  const wormholeConfig = useMemo(() => {
    const rpcs = devEnv ? DEFAULT_TESTNET_RPCS : DEFAULT_MAINNET_RPCS
    const tokens = devEnv ? TESTNET_TOKEN_KEYS : MAINNET_TOKEN_KEYS
    const mode = theme.isDark ? 'dark' : 'light'
    const customTheme = theme.isDark ? wormHoleDarkTheme : wormHoleLightTheme

    const config = {
      env: devEnv ? 'testnet' : 'mainnet',
      rpcs,
      networks: NETWORKS.map((n) => (devEnv ? n.testnet : n.mainnet)),
      tokens,
      mode,
      customTheme,
      cta: undefined,
      bridgeDefaults: {
        fromNetwork: 'solana',
        toNetwork: 'bsc',
        token: 'SOL',
        requiredNetwork: 'bsc',
      },
      showHamburgerMenu: true,
    }
    return config
  }, [theme.isDark])

  return (
    <Page>
      <WormholeBridge config={wormholeConfig} key={JSON.stringify(wormholeConfig)} />
    </Page>
  )
}
