import { Box, Spinner } from '@pancakeswap/uikit'
import GeneralRiskAcceptModal from 'components/GeneralDisclaimerModal/GeneralRiskAcceptModal'
import { BridgeDisclaimerConfigs } from 'components/GeneralDisclaimerModal/config'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { useTheme } from 'styled-components'
import Page from './components/Page'
import { WORMHOLE_NETWORKS, getBridgeTokens, getRpcUrls, pcsLogo } from './constants'
import { Themes } from './theme'
import { WidgetEnvs, type ExtendedWidgetConfig } from './types'

const WormholeBridge = dynamic(() => import('@wormhole-foundation/wormhole-connect'), {
  loading: () => (
    <Box position="absolute" top="35%" left="45%">
      <Spinner />
    </Box>
  ),
  ssr: false,
})
export const WormholeBridgeWidget = ({ isAptos }: { isAptos: boolean }) => {
  const theme = useTheme()

  const wormholeConfig: ExtendedWidgetConfig = useMemo(() => {
    const widgetEnv = WidgetEnvs.mainnet
    const networks = WORMHOLE_NETWORKS.filter((n) => (isAptos ? true : n.name !== 'Aptos')).map((n) => n[widgetEnv])

    const rpcs = getRpcUrls(widgetEnv)
    const tokens = getBridgeTokens(widgetEnv)

    const config: ExtendedWidgetConfig = {
      env: 'mainnet',
      rpcs,
      networks,
      tokens,
      bridgeDefaults: {
        fromNetwork: isAptos ? 'aptos' : 'ethereum',
        toNetwork: 'bsc',
        token: 'WETH',
        requiredNetwork: isAptos ? 'aptos' : undefined,
      },
      showHamburgerMenu: true,
      partnerLogo: pcsLogo,
    }
    return config
  }, [isAptos])

  return (
    <>
      <GeneralRiskAcceptModal bridgeConfig={BridgeDisclaimerConfigs.Wormhole} />
      <Page>
        <Box minHeight="100vh">
          <Box mt={-45}>
            <WormholeBridge
              config={wormholeConfig}
              theme={theme.isDark ? Themes.dark.customTheme : Themes.light.customTheme}
            />
          </Box>
        </Box>
      </Page>
    </>
  )
}
