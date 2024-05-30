import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, Toggle } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useEnableWormholeMainnet } from 'state/wormhole/enableTestnet'

export function WormholeEnvToggle() {
  const [enableMainnet, setEnableMainnet] = useEnableWormholeMainnet()
  const [isEnabled, setIsEnabled] = useState(false)

  const { t } = useTranslation()
  const { pathname } = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const { protocol } = window.location
    setIsEnabled(protocol === 'http:')
  }, [])

  if (pathname !== '/wormhole' || !isEnabled) {
    return null
  }

  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text fontSize="18px" mr="4px">
        {t('Mainnet')}
      </Text>
      <Toggle id="wormhole-toggle" scale="md" checked={enableMainnet} onChange={() => setEnableMainnet((s) => !s)} />
    </Flex>
  )
}
