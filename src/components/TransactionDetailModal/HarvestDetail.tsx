import { useMemo } from 'react'
import { Flex, Text, LinkExternal, useTooltip, InfoIcon, RefreshIcon, WarningIcon } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { BigNumber } from 'bignumber.js'
import Balance from 'components/Balance'
import { chains } from 'utils/wagmi'
import { ChainLogo } from 'components/Logo/ChainLogo'
import { verifyBscNetwork } from 'utils/verifyBscNetwork'
import { useGetBnbBalance, useGetCakeBalance } from 'hooks/useTokenBalance'
import { formatBigNumber } from 'utils/formatBalance'
import { getBlockExploreLink, getBlockExploreName } from 'utils'

interface HarvestDetailProps {
  chainId: number
}

const HarvestDetail: React.FC<React.PropsWithChildren<HarvestDetailProps>> = ({ chainId }) => {
  const { t } = useTranslation()

  const { balance: bnbBalance } = useGetBnbBalance()
  const { balance: cakeBalance } = useGetCakeBalance()

  const isBscNetwork = verifyBscNetwork(chainId)
  const chainInfo = useMemo(() => chains.find((chain) => chain.id === chainId), [chainId])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Any CAKE harvested will be on BNB smart chain only.'), {
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
        {/* <Text color="primary" bold fontSize="14px">Loading</Text> */}
        <LinkExternal href={getBlockExploreLink('0x12313', 'transaction', chainId)}>
          {getBlockExploreName(chainId)}
        </LinkExternal>
      </Flex>
      <Flex justifyContent="space-between">
        {isBscNetwork ? (
          <>
            <Text color="textSubtle">BNB Balance</Text>
            <Text>{formatBigNumber(bnbBalance, 3)}</Text>
          </>
        ) : (
          <>
            <Text color="textSubtle">ETH Balance</Text>
            <Text>0.145</Text>
          </>
        )}
      </Flex>
      <Flex justifyContent="space-between">
        <Text color="textSubtle">CAKE Balance</Text>
        {isBscNetwork ? (
          <>
            <Text>{formatBigNumber(cakeBalance, 3)}</Text>
            {/* <WarningIcon color="failure" /> */}
            {/* <RefreshIcon spin /> */}
          </>
        ) : (
          <>
            {tooltipVisible && tooltip}
            <div ref={targetRef}>
              <InfoIcon />
            </div>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default HarvestDetail
