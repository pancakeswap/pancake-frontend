import React from 'react'
import { Text, Flex, Box, Image, CheckmarkCircleIcon, FlexProps, HelpIcon, useTooltip } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { Ifo, PoolIds } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'hooks/ifo/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import PercentageOfTotal from './PercentageOfTotal'
import { SkeletonCardTokens } from './Skeletons'

interface TokenSectionProps extends FlexProps {
  img: string
}

const TokenSection: React.FC<TokenSectionProps> = ({ img, children, ...props }) => {
  return (
    <Flex {...props}>
      <Image src={img} width={32} height={32} mr="16px" />
      <div>{children}</div>
    </Flex>
  )
}

const Label = (props) => <Text bold fontSize="12px" color="secondary" textTransform="uppercase" {...props} />

const Value = (props) => <Text bold fontSize="20px" style={{ wordBreak: 'break-all' }} {...props} />

interface IfoCardTokensProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  hasProfile: boolean
  isLoading: boolean
}

const IfoCardTokens: React.FC<IfoCardTokensProps> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  hasProfile,
  isLoading,
}) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Sorry, you didn’t contribute enough LP tokens to meet the minimum threshold. You didn’t buy anything in this sale, but you can still reclaim your LP tokens.',
    ),
    { placement: 'bottom' },
  )

  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]

  const { currency, token } = ifo
  const { hasClaimed } = userPoolCharacteristics
  const distributionRatio = ifo[poolId].distributionRatio * 100
  const tokenImage = `/images/tokens/${ifo.token.symbol.toLowerCase()}.png`

  const renderTokenSection = () => {
    if (isLoading) {
      return <SkeletonCardTokens />
    }
    if (account && !hasProfile) {
      return <Text textAlign="center">{t('You need an active PancakeSwap Profile to take part in an IFO!')}</Text>
    }
    if (publicIfoData.status === 'coming_soon') {
      return (
        <>
          <TokenSection img="/images/bunny-placeholder.svg">
            <Label>{t('On sale')}</Label>
            <Value>{ifo[poolId].saleAmount}</Value>
          </TokenSection>
          <Text fontSize="14px" color="textSubtle" pl="48px">{`${distributionRatio}% of total sale`}</Text>
        </>
      )
    }
    if (publicIfoData.status === 'live') {
      return (
        <>
          <TokenSection img="/images/farms/cake-bnb.svg" mb="24px">
            <Label>{`Your ${currency.symbol} committed`}</Label>
            <Value>{getBalanceNumber(userPoolCharacteristics.amountTokenCommittedInLP, currency.decimals)}</Value>
            <PercentageOfTotal
              userAmount={userPoolCharacteristics.amountTokenCommittedInLP}
              totalAmount={publicPoolCharacteristics.totalAmountPool}
            />
          </TokenSection>
          <TokenSection img={tokenImage}>
            <Label>{`${token.symbol} to receive`}</Label>
            <Value>{getBalanceNumber(userPoolCharacteristics.offeringAmountInToken, token.decimals)}</Value>
          </TokenSection>
        </>
      )
    }
    if (publicIfoData.status === 'finished') {
      return userPoolCharacteristics.amountTokenCommittedInLP.isEqualTo(0) ? (
        <Flex flexDirection="column" alignItems="center">
          <Image src="/images/bunny-placeholder.svg" width={80} height={80} mb="16px" />
          <Text>{t('You didn’t participate in this sale!')}</Text>
        </Flex>
      ) : (
        <>
          <TokenSection img="/images/farms/cake-bnb.svg" mb="24px">
            <Label>{hasClaimed ? `Your ${currency.symbol} RECLAIMED` : `Your ${currency.symbol} TO RECLAIM`}</Label>
            <Flex alignItems="center">
              <Value>{getBalanceNumber(userPoolCharacteristics.refundingAmountInLP, currency.decimals)}</Value>
              {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
            </Flex>
            <PercentageOfTotal
              userAmount={userPoolCharacteristics.amountTokenCommittedInLP}
              totalAmount={publicPoolCharacteristics.totalAmountPool}
            />
          </TokenSection>
          <TokenSection img={tokenImage}>
            <Label>{hasClaimed ? `${token.symbol} received` : `${token.symbol} to received`}</Label>
            <Flex alignItems="center">
              <Value>{getBalanceNumber(userPoolCharacteristics.offeringAmountInToken, token.decimals)}</Value>
              {!hasClaimed && userPoolCharacteristics.offeringAmountInToken.isEqualTo(0) && (
                <div ref={targetRef} style={{ display: 'flex', marginLeft: '8px' }}>
                  <HelpIcon />
                </div>
              )}
              {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
            </Flex>
          </TokenSection>
        </>
      )
    }
    return null
  }
  return (
    <Box pb="24px">
      {tooltipVisible && tooltip}
      {renderTokenSection()}
    </Box>
  )
}

export default IfoCardTokens
