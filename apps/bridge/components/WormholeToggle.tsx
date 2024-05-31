import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Toggle } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useEnableWormholeMainnet } from 'state/wormhole/enableTestnet'
import { isDev } from './WormHole/constants'

export function WormholeEnvToggle() {
  const [enableMainnet, setEnableMainnet] = useEnableWormholeMainnet()
  const { t } = useTranslation()
  const { pathname } = useRouter()

  if (pathname !== '/wormhole' || !isDev) return null

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text fontSize="18px" mr="4px">
        {t('Mainnet')}
      </Text>
      <Toggle id="wormhole-toggle" scale="md" checked={enableMainnet} onChange={() => setEnableMainnet((s) => !s)} />
    </Flex>
  )
}
