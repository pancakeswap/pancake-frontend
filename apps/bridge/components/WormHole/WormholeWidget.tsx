import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, QuestionHelper, Spinner, Text, Toggle, useMatchBreakpoints } from '@pancakeswap/uikit'
import WormholeBridge from '@wormhole-foundation/wormhole-connect'
import GeneralRiskAcceptModal from 'components/GeneralDisclaimerModal/GeneralRiskAcceptModal'
import { BridgeDisclaimerConfigs } from 'components/GeneralDisclaimerModal/config'
import { useMemo } from 'react'
import { useEnableWormholeMainnet } from 'state/wormhole/enableTestnet'
import { useTheme } from 'styled-components'
import Page from './components/Page'
import { WORMHOLE_NETWORKS, getBridgeTokens, getRpcUrls, pcsLogo } from './constants'
import { Themes } from './theme'
import { ExtendedWidgetConfig, WidgetEnvs } from './types'

export const WormholeBridgeWidget = ({ isAptos }: { isAptos: boolean }) => {
  const [enableMainnet, setEnableMainnet] = useEnableWormholeMainnet()
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const theme = useTheme()

  const wormholeConfig: ExtendedWidgetConfig = useMemo(() => {
    const widgetEnv = enableMainnet ? WidgetEnvs.mainnet : WidgetEnvs.testnet
    const { mode, customTheme } = theme.isDark ? Themes.dark : Themes.light
    const networks = WORMHOLE_NETWORKS.filter((n) => (isAptos ? true : n.name !== 'Aptos')).map((n) => n[widgetEnv])

    const rpcs = getRpcUrls(widgetEnv)
    const tokens = getBridgeTokens(widgetEnv)

    const config: ExtendedWidgetConfig = {
      env: enableMainnet ? 'mainnet' : 'testnet',
      rpcs,
      networks,
      tokens,
      mode,
      customTheme,
      bridgeDefaults: {
        fromNetwork: isAptos ? 'aptos' : enableMainnet ? 'ethereum' : 'goerli',
        toNetwork: 'bsc',
        token: 'ETH',
        requiredNetwork: isAptos ? 'aptos' : undefined,
      },
      showHamburgerMenu: false,
      partnerLogo: pcsLogo,
    }
    return config
  }, [theme.isDark, enableMainnet, isAptos])

  return (
    <>
      <GeneralRiskAcceptModal bridgeConfig={BridgeDisclaimerConfigs.Wormhole} />
      <Page>
        <Box minHeight="calc(100vh - 56px - 70px)">
          <Flex maxWidth="690px" m="auto" alignItems="center" justifyContent={isMobile ? 'center' : 'right'}>
            <Flex justifyContent="space-between" alignItems="center" paddingTop="24px" paddingX="24px">
              <Flex alignItems="center" justifyContent="center" paddingX="8px">
                <Text fontSize="20px">{t('Enable Mainnet')}</Text>
                <QuestionHelper
                  mt="2px"
                  size="20px"
                  text={t(
                    'Mainnet is set by default. If you are unfamiliar with bridging please try a testnet transaction first',
                  )}
                />
              </Flex>
              <Toggle
                id="toggle-enable-mainnet-button"
                scale="md"
                checked={enableMainnet}
                onChange={() => setEnableMainnet((s: boolean) => !s)}
              />
            </Flex>
          </Flex>

          <Box mt={-45}>
            <WormholeBridge config={wormholeConfig} key={JSON.stringify(wormholeConfig)} />
          </Box>
          <Box position="absolute" top="35%" left="45%" zIndex={-1}>
            <Spinner />
          </Box>
        </Box>
      </Page>
    </>
  )
}
