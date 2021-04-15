import React from 'react'
import { Text, Flex, Box, Image, CheckmarkCircleIcon, FlexProps, HelpIcon, useTooltip } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { Ifo, IfoStatus } from 'config/constants/types'
import { PoolCharacteristics, UserPoolCharacteristics } from 'hooks/ifo/v2/types'
import useI18n from 'hooks/useI18n'
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

interface IfoCardTokensProps {
  ifo: Ifo
  status: IfoStatus
  distribution: number
  publicPoolCharacteristics: PoolCharacteristics
  userPoolCharacteristics: UserPoolCharacteristics
  hasProfile: boolean
  isLoading: boolean
}

const IfoCardTokens: React.FC<IfoCardTokensProps> = ({
  ifo,
  status,
  distribution,
  userPoolCharacteristics,
  publicPoolCharacteristics,
  hasProfile,
  isLoading,
}) => {
  const { account } = useWeb3React()
  const TranslateString = useI18n()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    'Sorry, you didn’t contribute enough LP tokens to meet the minimum threshold. You didn’t buy anything in this sale, but you can still reclaim your LP tokens.',
    'bottom',
  )
  const { currency, token, saleAmount } = ifo
  const { hasClaimed } = userPoolCharacteristics

  const renderTokenSection = () => {
    if (isLoading) {
      return <SkeletonCardTokens />
    }
    if (account && !hasProfile) {
      return (
        <Text textAlign="center">
          {TranslateString(999, 'You need an active PancakeSwap Profile to take part in an IFO!')}
        </Text>
      )
    }
    if (status === 'coming_soon') {
      return (
        <>
          <TokenSection img="/images/bunny-placeholder.svg">
            <Label>{TranslateString(999, 'On sale')}</Label>
            <Text bold fontSize="20px">
              {saleAmount}
            </Text>
          </TokenSection>
          <Text fontSize="14px" color="textSubtle" pl="48px">{`${distribution * 100}% of total sale`}</Text>
        </>
      )
    }
    if (status === 'live') {
      return (
        <>
          <TokenSection img="/images/farms/cake-bnb.svg" mb="24px">
            <Label>{`Your ${currency.symbol} committed`}</Label>
            <Text bold fontSize="20px">
              {getBalanceNumber(userPoolCharacteristics.amountTokenCommittedInLP, currency.decimals)}
            </Text>
            <PercentageOfTotal
              userAmount={userPoolCharacteristics.amountTokenCommittedInLP}
              totalAmount={publicPoolCharacteristics.totalAmountPool}
            />
          </TokenSection>
          <TokenSection img={`/images/tokens/${token.symbol.toLocaleLowerCase()}.png`}>
            <Label>{`${token.symbol} to receive`}</Label>
            <Text bold fontSize="20px">
              {getBalanceNumber(userPoolCharacteristics.offeringAmountInToken, token.decimals)}
            </Text>
          </TokenSection>
        </>
      )
    }
    if (status === 'finished') {
      return userPoolCharacteristics.amountTokenCommittedInLP.isEqualTo(0) ? (
        <Flex flexDirection="column" alignItems="center">
          <Image src="/images/bunny-placeholder.svg" width={80} height={80} mb="16px" />
          <Text>{TranslateString(999, 'You didn’t participate in this sale!')}</Text>
        </Flex>
      ) : (
        <>
          <TokenSection img="/images/farms/cake-bnb.svg" mb="24px">
            <Label>{hasClaimed ? `Your ${currency.symbol} RECLAIMED` : `Your ${currency.symbol} TO RECLAIM`}</Label>
            <Flex alignItems="center">
              <Text bold fontSize="20px">
                {getBalanceNumber(userPoolCharacteristics.refundingAmountInLP, currency.decimals)}
              </Text>
              {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
            </Flex>
            <PercentageOfTotal
              userAmount={userPoolCharacteristics.amountTokenCommittedInLP}
              totalAmount={publicPoolCharacteristics.totalAmountPool}
            />
          </TokenSection>
          <TokenSection img={`/images/tokens/${token.symbol.toLocaleLowerCase()}.png`}>
            <Label>{hasClaimed ? `${token.symbol} received` : `${token.symbol} to received`}</Label>
            <Flex alignItems="center">
              <Text bold fontSize="20px">
                {getBalanceNumber(userPoolCharacteristics.offeringAmountInToken, token.decimals)}
              </Text>
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
