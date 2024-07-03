import GeneralRiskAcceptModal from 'components/GeneralDisclaimerModal/GeneralRiskAcceptModal'
import { BridgeDisclaimerConfigs } from 'components/GeneralDisclaimerModal/config'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { useEnableWormholeMainnet } from 'state/wormhole/enableTestnet'
import { useTheme } from 'styled-components'
import Page from './components/Page'
import { getConfigEnv, pcsLogo, widgetConfigs } from './constants'
import { Themes } from './theme'

const WormholeWidget = dynamic(() => import('@wormhole-foundation/wormhole-connect'), { ssr: false })

export const WormholeBridgeWidget = () => {
  const [enableMainnet] = useEnableWormholeMainnet()
  const theme = useTheme()

  const wormholeConfig = useMemo(() => {
    const widgetEnv = getConfigEnv({ enableMainnet })
    const baseConfig = widgetConfigs[widgetEnv]
    return { ...baseConfig, showHamburgerMenu: false, partnerLogo: pcsLogo }
  }, [enableMainnet])

  const wormholeTheme = useMemo(() => {
    return theme.isDark ? Themes.dark : Themes.light
  }, [theme.isDark])

  return (
    <Page>
      <GeneralRiskAcceptModal bridgeConfig={BridgeDisclaimerConfigs.Wormhole} />
      <WormholeWidget config={wormholeConfig} theme={wormholeTheme} key={JSON.stringify(wormholeConfig)} />
    </Page>
  )
}
