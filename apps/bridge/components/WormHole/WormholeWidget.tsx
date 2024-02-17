import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, QuestionHelper, Text, Toggle, useMatchBreakpoints } from '@pancakeswap/uikit'
import WormholeBridge, { WormholeConnectConfig } from '@wormhole-foundation/wormhole-connect'
import GeneralRiskAcceptModal from 'components/GeneralDisclaimerModal/GeneralRiskAcceptModal'
import { BridgeDisclaimerConfigs } from 'components/GeneralDisclaimerModal/config'
import { useMemo } from 'react'
import { useEnableWormholeMainnet } from 'state/wormhole/enableTestnet'
import { useTheme } from 'styled-components'
import Page from './components/Page'
import { MAINNET_RPCS, MAINNET_TOKEN_KEYS, NETWORK_CONFIG, TESTNET_RPCS, TESTNET_TOKEN_KEYS } from './constants'
import { wormHoleDarkTheme, wormHoleLightTheme } from './theme'

export const WormholeBridgeWidget = () => {
  const [enableMainnet, setEnableMainnet] = useEnableWormholeMainnet()

  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const theme = useTheme()

  const wormholeConfig: WormholeConnectConfig | undefined = useMemo(() => {
    const rpcs = enableMainnet ? MAINNET_RPCS : TESTNET_RPCS
    const networks = Object.values(NETWORK_CONFIG).map((n) => (enableMainnet ? n.mainnet : n.testnet))
    const tokens = enableMainnet ? MAINNET_TOKEN_KEYS : TESTNET_TOKEN_KEYS
    const mode = theme.isDark ? 'dark' : 'light'
    const customTheme = theme.isDark ? wormHoleDarkTheme : wormHoleLightTheme

    const config: WormholeConnectConfig = {
      env: enableMainnet ? 'mainnet' : 'testnet',
      rpcs,
      networks,
      tokens,
      mode,
      customTheme,
      bridgeDefaults: {
        fromNetwork: enableMainnet ? 'solana' : 'bsc',
        toNetwork: enableMainnet ? 'bsc' : 'solana',
        token: enableMainnet ? 'SOL' : 'BNB',
      },
      showHamburgerMenu: false,
    }
    return config
  }, [theme.isDark, enableMainnet])

  return (
    <>
      <GeneralRiskAcceptModal bridgeConfig={BridgeDisclaimerConfigs.Wormhole} />
      <Page>
        <Box maxWidth="690px" m="auto">
          <Flex
            flexDirection="row"
            borderRadius={[0, null, 24]}
            alignItems="center"
            justifyContent={isMobile ? 'center' : 'right'}
          >
            <Flex justifyContent="space-between" alignItems="center" paddingTop="24px" paddingX="24px">
              <Flex alignItems="center" justifyContent="center" paddingX="8px">
                <Text fontSize="20px">{t('Enable Mainnet')}</Text>
                <QuestionHelper
                  text={t(
                    'Testnet is set by default. If you are unfamiliar with bridging please try a testnet transaction first',
                  )}
                  size="20px"
                  ml="4px"
                  mt="2px"
                  zIndex={999}
                />
              </Flex>
              <Toggle
                id="toggle-enable-mainnet-button"
                scale="md"
                checked={enableMainnet}
                onChange={() => {
                  setEnableMainnet((s) => !s)
                }}
              />
            </Flex>
          </Flex>
        </Box>
        <Box mt={isMobile ? -20 : -70} minHeight="780px">
          {wormholeConfig && <WormholeBridge config={wormholeConfig} key={JSON.stringify(wormholeConfig)} />}
        </Box>
      </Page>
    </>
  )
}
