import { useMemo } from 'react'
import { Flex, Text, LinkExternal, useTooltip, InfoIcon, RefreshIcon, WarningIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { chains } from 'utils/wagmi'
import { useBalance } from 'wagmi'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { useGetBnbBalance, useGetCakeBalance } from 'hooks/useTokenBalance'
import { formatBigNumber } from 'utils/formatBalance'
import { getBlockExploreLink, getBlockExploreName } from 'utils'

interface HarvestDetailProps {
  tx: string
  nonce?: string
  account: string
  chainId: number
  isLoading: boolean
  isFail?: boolean
  sourceChainChainId?: number
  sourceChainTx?: string
}

const HarvestDetail: React.FC<React.PropsWithChildren<HarvestDetailProps>> = ({
  tx,
  account,
  chainId,
  isLoading,
  nonce,
  sourceChainChainId,
  sourceChainTx,
  isFail,
}) => {
  const { t } = useTranslation()
  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: cakeBalance } = useGetCakeBalance()
  const native = useNativeCurrency()
  const { data } = useBalance({ addressOrName: account })

  const isBscNetwork = verifyBscNetwork(chainId)
  const chainInfo = useMemo(() => chains.find((chain) => chain.id === chainId), [chainId])

  const tooltipsContainer = isBscNetwork ? (
    <Flex flexDirection="column">
      <Text mb="4px">
        {t(
          'The attempt to claim CAKE rewards did not succeed on the BNB Chain side. Please copy the transaction ID below and look for assistance from our helpful Community Admins or Chefs.',
        )}
      </Text>
      <LinkExternal href={getBlockExploreLink(sourceChainTx, 'transaction', sourceChainChainId)}>
        {getBlockExploreName(sourceChainChainId)}
      </LinkExternal>
    </Flex>
  ) : (
    <Text>{t('Any CAKE harvested will be on BNB smart chain only.')}</Text>
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipsContainer, {
    placement: 'top',
  })

  return (
    <Flex flexDirection="column">
      <Flex justifyContent="space-between">
        <Flex>
          <ChainLogo width={20} height={20} chainId={chainId} />
          <Text fontSize="14px" ml="4px">
            {chainInfo?.name}
          </Text>
        </Flex>
        {isLoading ? (
          <Text color="primary" bold fontSize="14px">
            {t('Loading')}
          </Text>
        ) : (
          <LinkExternal href={getBlockExploreLink(tx, 'transaction', chainId)}>
            {getBlockExploreName(chainId)}
          </LinkExternal>
        )}
      </Flex>
      {isBscNetwork ? (
        <>
          {nonce === '0' && (
            <Flex justifyContent="space-between">
              <Text color="textSubtle">{t('%symbol% Balance', { symbol: 'BNB' })}</Text>
              <Text>{formatBigNumber(bnbBalance, 3)}</Text>
            </Flex>
          )}
          <Flex justifyContent="space-between">
            <Text color="textSubtle">{t('%symbol% Balance', { symbol: 'CAKE' })}</Text>
            {isLoading ? (
              <RefreshIcon spin />
            ) : (
              <>
                {isFail ? (
                  <>
                    {tooltipVisible && tooltip}
                    <div ref={targetRef}>
                      <WarningIcon color="failure" />
                    </div>
                  </>
                ) : (
                  <Text>{formatBigNumber(cakeBalance, 3)}</Text>
                )}
              </>
            )}
          </Flex>
        </>
      ) : (
        <>
          <Flex justifyContent="space-between">
            <Text color="textSubtle">{t('%symbol% Balance', { symbol: native.symbol })}</Text>
            <Text>{formatBigNumber(data.value, 3)}</Text>
          </Flex>
          <Flex justifyContent="space-between">
            <Text color="textSubtle">{t('%symbol% Balance', { symbol: 'CAKE' })}</Text>
            {tooltipVisible && tooltip}
            <div ref={targetRef}>
              <InfoIcon />
            </div>
          </Flex>
        </>
      )}
    </Flex>
  )
}

export default HarvestDetail
