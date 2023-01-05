import { Currency } from '@pancakeswap/aptos-swap-sdk'
import { useAccount } from '@pancakeswap/awgmi'
import { getBalanceNumber, getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'

import {
  Text,
  Flex,
  Box,
  CheckmarkCircleIcon,
  FlexProps,
  HelpIcon,
  useTooltip,
  BunnyPlaceholderIcon,
  Message,
  MessageText,
} from '@pancakeswap/uikit'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { Ifo, PoolIds } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { getStatus } from 'views/Ifos/hooks/helpers'
import PercentageOfTotal from './PercentageOfTotal'
import { SkeletonCardTokens } from './Skeletons'
import VestingAvailableToClaim from './VestingAvailableToClaim'

interface TokenSectionProps extends FlexProps {
  primaryToken?: Currency
  secondaryToken?: Currency
}

const TokenSection: React.FC<React.PropsWithChildren<TokenSectionProps>> = ({
  primaryToken,
  secondaryToken,
  children,
  ...props
}) => {
  const renderTokenComponent = () => {
    if (!primaryToken) {
      return <BunnyPlaceholderIcon width={32} mr="16px" />
    }

    if (primaryToken && secondaryToken) {
      return (
        <TokenPairImage
          variant="inverted"
          primaryToken={primaryToken}
          height={32}
          width={32}
          secondaryToken={secondaryToken}
          mr="16px"
        />
      )
    }

    return <TokenImage token={primaryToken} height={32} width={32} mr="16px" />
  }

  return (
    <Flex {...props}>
      {renderTokenComponent()}
      <div>{children}</div>
    </Flex>
  )
}

const CommitTokenSection: React.FC<React.PropsWithChildren<TokenSectionProps & { commitToken: Currency }>> = ({
  commitToken,
  ...props
}) => {
  return <TokenSection primaryToken={commitToken} {...props} />
}

const Label = (props) => <Text bold fontSize="12px" color="secondary" textTransform="uppercase" {...props} />

const Value = (props) => <Text bold fontSize="20px" style={{ wordBreak: 'break-all' }} {...props} />

interface IfoCardTokensProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  isLoading: boolean
}

const OnSaleInfo = ({ token, saleAmount, distributionRatio }) => {
  const { t } = useTranslation()
  return (
    <TokenSection primaryToken={token}>
      <Flex flexDirection="column">
        <Label textTransform="uppercase">{t('On sale')}</Label>
        <Value>{saleAmount}</Value>
        <Text fontSize="14px" color="textSubtle">
          {t('%ratio%% of total sale', { ratio: distributionRatio })}
        </Text>
      </Flex>
    </TokenSection>
  )
}

const IfoCardTokens: React.FC<React.PropsWithChildren<IfoCardTokensProps>> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  isLoading,
}) => {
  const { account } = useAccount()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Sorry, you didn’t contribute enough CAKE to meet the minimum threshold. You didn’t buy anything in this sale, but you can still reclaim your CAKE.',
    ),
    { placement: 'bottom' },
  )

  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]

  const { startTime, endTime } = publicIfoData

  const currentTime = Date.now() / 1000

  const status = getStatus(currentTime, startTime, endTime)

  const { currency, token, version } = ifo
  const { hasClaimed } = userPoolCharacteristics
  const distributionRatio = ifo[poolId].distributionRatio * 100

  const renderTokenSection = () => {
    if (isLoading) {
      return <SkeletonCardTokens />
    }
    if (!account) {
      return <OnSaleInfo token={token} distributionRatio={distributionRatio} saleAmount={ifo[poolId].saleAmount} />
    }

    const message = null

    if (status === 'coming_soon') {
      return (
        <>
          <TokenSection primaryToken={ifo.token}>
            <Label>{t('On sale')}</Label>
            <Value>{ifo[poolId].saleAmount}</Value>
          </TokenSection>
          <Text fontSize="14px" color="textSubtle" pl="48px">
            {t('%ratio%% of total sale', { ratio: distributionRatio })}
          </Text>
          {message}
        </>
      )
    }

    if (status === 'live') {
      return (
        <>
          <CommitTokenSection commitToken={ifo.currency} mb="24px">
            <Label>{t('Your %symbol% committed', { symbol: currency.symbol })}</Label>
            <Value>{getBalanceNumber(userPoolCharacteristics.amountTokenCommittedInLP, currency.decimals)}</Value>
            <PercentageOfTotal
              userAmount={userPoolCharacteristics.amountTokenCommittedInLP}
              totalAmount={publicPoolCharacteristics.totalAmountPool}
            />
          </CommitTokenSection>
          <TokenSection primaryToken={ifo.token}>
            <Label>{t('%symbol% to receive', { symbol: token.symbol })}</Label>

            <Value>
              {getFullDisplayBalance(userPoolCharacteristics.offeringAmountInToken, token.decimals, token.decimals)}
            </Value>
            {version >= 3.2 && publicPoolCharacteristics.vestingInformation.percentage > 0 && (
              <VestingAvailableToClaim
                amountToReceive={userPoolCharacteristics.offeringAmountInToken}
                percentage={publicPoolCharacteristics.vestingInformation.percentage}
                decimals={token.decimals}
              />
            )}
          </TokenSection>
          {message}
        </>
      )
    }

    if (status === 'finished') {
      return userPoolCharacteristics.amountTokenCommittedInLP.isEqualTo(0) ? (
        <Flex flexDirection="column" alignItems="center">
          <BunnyPlaceholderIcon width={80} mb="16px" />
          <Text fontWeight={600}>{t('You didn’t participate in this sale!')}</Text>
        </Flex>
      ) : (
        <>
          <CommitTokenSection commitToken={ifo.currency} mb="24px">
            <Label>
              {hasClaimed
                ? t('Your %symbol% RECLAIMED', { symbol: currency.symbol })
                : t('Your %symbol% TO RECLAIM', { symbol: currency.symbol })}
            </Label>
            <Flex alignItems="center">
              <Value>
                {getFullDisplayBalance(
                  userPoolCharacteristics.refundingAmountInLP,
                  currency.decimals,
                  currency.decimals,
                )}
              </Value>
              {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
            </Flex>
            <PercentageOfTotal
              userAmount={userPoolCharacteristics.amountTokenCommittedInLP}
              totalAmount={publicPoolCharacteristics.totalAmountPool}
            />
          </CommitTokenSection>
          <TokenSection primaryToken={ifo.token}>
            <Label>
              {' '}
              {hasClaimed
                ? t('%symbol% received', { symbol: token.symbol })
                : t('%symbol% to receive', { symbol: token.symbol })}
            </Label>
            <Flex alignItems="center">
              <Value>
                {getFullDisplayBalance(userPoolCharacteristics.offeringAmountInToken, token.decimals, token.decimals)}
              </Value>
              {!hasClaimed && userPoolCharacteristics.offeringAmountInToken.isEqualTo(0) && (
                <div ref={targetRef} style={{ display: 'flex', marginLeft: '8px' }}>
                  <HelpIcon />
                </div>
              )}
              {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
            </Flex>
          </TokenSection>
          {hasClaimed && (
            <Message my="24px" p="8px" variant="success">
              <MessageText>{t('You’ve successfully claimed tokens back.')}</MessageText>
            </Message>
          )}
        </>
      )
    }
    return null
  }
  return (
    <Box>
      {tooltipVisible && tooltip}
      {renderTokenSection()}
    </Box>
  )
}

export default IfoCardTokens
