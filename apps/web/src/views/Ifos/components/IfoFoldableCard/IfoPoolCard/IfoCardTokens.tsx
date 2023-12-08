import { useMemo, ReactNode } from 'react'
import {
  Text,
  Flex,
  Box,
  CheckmarkCircleIcon,
  FlexProps,
  HelpIcon,
  useTooltip,
  Button,
  AutoRenewIcon,
  BunnyPlaceholderIcon,
  Message,
  MessageText,
  ErrorIcon,
  BalanceWithLoading,
  IfoSkeletonCardTokens,
  IfoPercentageOfTotal,
  IfoVestingAvailableToClaim,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { Token } from '@pancakeswap/sdk'
import { Ifo, PoolIds, cakeBnbLpToken } from '@pancakeswap/ifos'
import { bscTokens } from '@pancakeswap/tokens'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber, formatNumber } from '@pancakeswap/utils/formatBalance'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { isBasicSale } from 'views/Ifos/hooks/v7/helpers'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

import { EnableStatus } from '../types'
import IFORequirements from './IFORequirements'
import { TextLink } from '../../IfoCardStyles'
import StakeVaultButton from '../StakeVaultButton'
import { ICakeTips } from './ICakeTips'

interface TokenSectionProps extends FlexProps {
  primaryToken?: Token
  secondaryToken?: Token
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

const CommitTokenSection: React.FC<React.PropsWithChildren<TokenSectionProps & { commitToken: Token }>> = ({
  commitToken,
  ...props
}) => {
  if (commitToken.equals(cakeBnbLpToken)) {
    return <TokenSection primaryToken={bscTokens.cake} secondaryToken={bscTokens.wbnb} {...props} />
  }
  return <TokenSection primaryToken={commitToken} {...props} />
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
  onApprove: () => Promise<any>
  enableStatus: EnableStatus
  criterias?: any
  isEligible?: boolean
}

const OnSaleInfo = ({ token, saleAmount, distributionRatio }) => {
  const { t } = useTranslation()
  return (
    <TokenSection primaryToken={token}>
      <Flex flexDirection="column">
        <Label textTransform="uppercase">{t('On sale')}</Label>
        <Value>
          {typeof saleAmount === 'string'
            ? saleAmount
            : `${formatNumber(getBalanceNumber(saleAmount, token.decimals), 0, 1)} ${token.symbol}`}
        </Value>
        <Text fontSize="14px" color="textSubtle">
          {t('%ratio%% of total sale', { ratio: distributionRatio })}
        </Text>
      </Flex>
    </TokenSection>
  )
}

const IfoCardTokens: React.FC<React.PropsWithChildren<IfoCardTokensProps>> = ({
  criterias,
  isEligible,
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  hasProfile,
  isLoading,
  onApprove,
  enableStatus,
}) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Sorry, you didn’t contribute enough CAKE to meet the minimum threshold. You didn’t buy anything in this sale, but you can still reclaim your CAKE.',
    ),
    { placement: 'bottom' },
  )

  const publicPoolCharacteristics = publicIfoData[poolId]
  const isPublicPoolBasicSale = isBasicSale(publicPoolCharacteristics?.saleType)
  const userPoolCharacteristics = walletIfoData[poolId]
  const offeringAmountInToken = userPoolCharacteristics?.offeringAmountInToken
  const amountTokenCommittedInLP = userPoolCharacteristics?.amountTokenCommittedInLP
  const refundingAmountInLP = userPoolCharacteristics?.refundingAmountInLP
  const spentAmount = amountTokenCommittedInLP?.minus(refundingAmountInLP || BIG_ZERO)

  const { currency, token, version } = ifo
  const hasClaimed = userPoolCharacteristics?.hasClaimed
  const distributionRatio =
    (ifo.version >= 3 ? publicIfoData[poolId]?.distributionRatio ?? 0 : ifo[poolId]?.distributionRatio ?? 0) * 100

  const tooltipContentOfSpent = t(
    'Based on "overflow" sales method. %refundingAmount% unspent %spentToken% are available to claim after the sale is completed.',
    {
      refundingAmount: getBalanceNumber(refundingAmountInLP || BIG_ZERO, ifo.currency.decimals).toFixed(4),
      spentToken: ifo.currency.symbol,
    },
  )
  const {
    targetRef: tagTargetRefOfSpent,
    tooltip: tagTooltipOfSpent,
    tooltipVisible: tagTooltipVisibleOfSpent,
  } = useTooltip(tooltipContentOfSpent, {
    placement: 'bottom',
  })

  const hasNFT = useMemo(() => {
    const data = criterias.find((obj) => obj.type === 'isQualifiedNFT')
    const userHasNFT = data?.value
    return userHasNFT
  }, [criterias])

  const renderTokenSection = () => {
    if (isLoading) {
      return <IfoSkeletonCardTokens />
    }
    if (!account) {
      return (
        <OnSaleInfo
          token={token}
          distributionRatio={distributionRatio}
          saleAmount={ifo.version >= 3 ? publicIfoData[poolId]?.offeringAmountPool : ifo[poolId]?.saleAmount}
        />
      )
    }

    let message: ReactNode | undefined

    const ifov31Msg =
      ifo.version >= 3.1 && poolId === PoolIds.poolBasic && criterias?.length > 0 ? (
        <Box mt="16px">
          {!isEligible && (
            <Message mb="24px" p="8px" variant="warning" icon={<ErrorIcon color="warning" width="24px" />}>
              <MessageText small display="inline">
                {t('Meet any one of the following requirements to be eligible.')}
              </MessageText>
            </Message>
          )}
          <IFORequirements
            criterias={criterias}
            admissionProfile={publicPoolCharacteristics?.admissionProfile}
            pointThreshold={publicPoolCharacteristics?.pointThreshold}
          />
          {isEligible && (
            <Message mt="24px" p="8px" variant="success">
              <MessageText small display="inline">
                {hasNFT
                  ? t('Using eligible NFT for entry. Do not remove or edit your profile avatar before claiming.')
                  : t('You are eligible to participate in this Private Sale!')}
              </MessageText>
            </Message>
          )}
        </Box>
      ) : null

    if (
      (ifo.version === 3 || (ifo.version >= 3.1 && poolId === PoolIds.poolUnlimited)) &&
      publicIfoData.status !== 'finished' &&
      hasProfile
    ) {
      message = <ICakeTips ifoId={ifo.id} ifoChainId={ifo.chainId} ifoAddress={ifo.address} />
    }

    if (account && !hasProfile && !isPublicPoolBasicSale && publicIfoData.status !== 'finished') {
      return (
        <>
          <OnSaleInfo
            token={token}
            distributionRatio={distributionRatio}
            saleAmount={ifo.version >= 3 ? publicIfoData[poolId]?.offeringAmountPool : ifo[poolId]?.saleAmount}
          />
          {message}
        </>
      )
    }

    message = ifov31Msg || message

    if (publicIfoData.status === 'coming_soon') {
      return (
        <>
          <TokenSection primaryToken={ifo.token}>
            <Label>{t('On sale')}</Label>
            <Value>{`${formatNumber(
              getBalanceNumber(publicIfoData[poolId]?.offeringAmountPool, ifo.token.decimals),
              0,
              1,
            )} ${token.symbol}`}</Value>
          </TokenSection>
          <Text fontSize="14px" color="textSubtle" pl="48px">
            {t('%ratio%% of total sale', { ratio: distributionRatio })}
          </Text>
          {message}
          {enableStatus !== EnableStatus.ENABLED && account && chainId === ifo.chainId && (
            <Button
              width="100%"
              mt="16px"
              onClick={onApprove}
              isLoading={enableStatus === EnableStatus.IS_ENABLING}
              endIcon={enableStatus === EnableStatus.IS_ENABLING ? <AutoRenewIcon spin color="currentColor" /> : null}
            >
              {t('Enable')}
            </Button>
          )}
        </>
      )
    }
    if (publicIfoData.status === 'live') {
      return (
        <>
          <CommitTokenSection commitToken={ifo.currency} mb="24px">
            <Label>{t('Your %symbol% committed', { symbol: currency.symbol })}</Label>
            <Value>{getBalanceNumber(amountTokenCommittedInLP, currency.decimals)}</Value>
            <IfoPercentageOfTotal
              userAmount={amountTokenCommittedInLP || BIG_ZERO}
              totalAmount={publicPoolCharacteristics?.totalAmountPool || BIG_ZERO}
            />
            <Flex>
              <Box>
                <Flex>
                  <Label>{t('Your %symbol% spent', { symbol: currency.symbol })}</Label>
                  {tagTooltipVisibleOfSpent && tagTooltipOfSpent}
                  <span ref={tagTargetRefOfSpent}>
                    <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
                  </span>
                </Flex>
                <BalanceWithLoading
                  bold
                  decimals={4}
                  fontSize="20px"
                  value={getBalanceNumber(spentAmount, currency.decimals)}
                />
              </Box>
            </Flex>
          </CommitTokenSection>
          <TokenSection primaryToken={ifo.token}>
            <Label>{t('%symbol% to receive', { symbol: token.symbol })}</Label>
            <Value>{getBalanceNumber(offeringAmountInToken, token.decimals)}</Value>
            {version >= 3.2 &&
              publicPoolCharacteristics?.vestingInformation?.percentage &&
              publicPoolCharacteristics.vestingInformation.percentage > 0 && (
                <IfoVestingAvailableToClaim
                  amountToReceive={offeringAmountInToken || BIG_ZERO}
                  percentage={publicPoolCharacteristics.vestingInformation.percentage}
                  decimals={token.decimals}
                  displayDecimals={2}
                />
              )}
          </TokenSection>
          {message}
        </>
      )
    }

    if (publicIfoData.status === 'finished') {
      return amountTokenCommittedInLP?.isEqualTo(0) ? (
        <Flex flexDirection="column" alignItems="center">
          <BunnyPlaceholderIcon width={80} mb="16px" />
          <Text fontWeight={600}>{t('You didn’t participate in this sale!')}</Text>
          {!isPublicPoolBasicSale &&
            (ifov31Msg || (
              <>
                <Text textAlign="center" fontSize="14px">
                  {t('To participate in the next IFO, lock some CAKE in the fixed-term staking CAKE pool!')}
                </Text>
                <TextLink href="/ifo#ifo-how-to" textAlign="center">
                  {t('How does it work?')} »
                </TextLink>
                <StakeVaultButton mt="24px" />
              </>
            ))}
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
              <Value>{getBalanceNumber(refundingAmountInLP, currency.decimals)}</Value>
              {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
            </Flex>
            <IfoPercentageOfTotal
              userAmount={amountTokenCommittedInLP || BIG_ZERO}
              totalAmount={publicPoolCharacteristics?.totalAmountPool || BIG_ZERO}
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
              <Value>{getBalanceNumber(offeringAmountInToken, token.decimals)}</Value>
              {!hasClaimed && offeringAmountInToken?.isEqualTo(0) && (
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
