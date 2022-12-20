import { useMemo } from 'react'
import { useAccount, useAccountBalance } from '@pancakeswap/awgmi'
import { Currency } from '@pancakeswap/aptos-swap-sdk'
import useBridgeInfo from 'components/Swap/hooks/useBridgeInfo'
import { Message, Flex, Text, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const LiquidityBridgeWarning = ({ currency }: { currency?: Currency }) => {
  const { account } = useAccount()
  const { t } = useTranslation()
  const bridgeResult = useBridgeInfo({ currency })

  const { data, isLoading } = useAccountBalance({
    address: account?.address,
    coin: currency?.wrapped?.address,
    enabled: !!currency,
    watch: true,
  })

  const showBridgeWarning = useMemo(
    () => bridgeResult && !isLoading && Number(data?.formatted) <= 0,
    [data, isLoading, bridgeResult],
  )

  return (
    <>
      {showBridgeWarning && (
        <Message variant="warning" mb="20px">
          <Flex>
            <Text fontSize="12px" color="warning" m="auto">
              {t('Use')}
            </Text>
            <Link
              external
              m="0 4px"
              fontSize="12px"
              color="warning"
              href={bridgeResult?.url}
              style={{ textDecoration: 'underline' }}
            >
              {bridgeResult?.platform}
            </Link>
            <Text fontSize="12px" color="warning" m="auto">
              {t('to bridge this asset.')}
            </Text>
          </Flex>
        </Message>
      )}
    </>
  )
}

export default LiquidityBridgeWarning
