import React from 'react'
import BigNumber from 'bignumber.js'
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
  useModal,
  Link,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import { Token } from '@pancakeswap/sdk'
import { Ifo, PoolIds } from 'config/constants/types'
import tokens from 'config/constants/tokens'
import { cakeBnbLpToken } from 'config/constants/ifo'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import VaultStakeModal from 'views/Pools/components/CakeVaultCard/VaultStakeModal'
import { useIfoPoolVault, useIfoPoolCredit, useIfoWithApr } from 'state/pools/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import { EnableStatus } from '../types'
import PercentageOfTotal from './PercentageOfTotal'
import { SkeletonCardTokens } from './Skeletons'

interface TokenSectionProps extends FlexProps {
  primaryToken?: Token
  secondaryToken?: Token
}

const TokenSection: React.FC<TokenSectionProps> = ({ primaryToken, secondaryToken, children, ...props }) => {
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

const CommitTokenSection: React.FC<TokenSectionProps & { commitToken: Token }> = ({ commitToken, ...props }) => {
  if (commitToken.equals(cakeBnbLpToken)) {
    return <TokenSection primaryToken={tokens.cake} secondaryToken={tokens.wbnb} {...props} />
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
}

const OnSaleInfo = ({ token, saleAmount, distributionRatio }) => {
  const { t } = useTranslation()
  return (
    <TokenSection primaryToken={token}>
      <Flex flexDirection="column">
        <Label>{t('On sale').toUpperCase()}</Label>
        <Value>{saleAmount}</Value>
        <Text fontSize="14px" color="textSubtle">
          {t('%ratio%% of total sale', { ratio: distributionRatio })}
        </Text>
      </Flex>
    </TokenSection>
  )
}

const MessageTextLink = styled(Link)`
  display: inline;
  text-decoration: underline;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
`

const IfoCardTokens: React.FC<IfoCardTokensProps> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  hasProfile,
  isLoading,
  onApprove,
  enableStatus,
}) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Sorry, you didn’t contribute enough CAKE to meet the minimum threshold. You didn’t buy anything in this sale, but you can still reclaim your CAKE.',
    ),
    { placement: 'bottom' },
  )

  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]

  const { currency, token } = ifo
  const { hasClaimed } = userPoolCharacteristics
  const distributionRatio = ifo[poolId].distributionRatio * 100

  const ifoPoolVault = useIfoPoolVault()
  const { pool } = useIfoWithApr()
  const credit = useIfoPoolCredit()

  const stakingTokenBalance = pool?.userData?.stakingTokenBalance
    ? new BigNumber(pool.userData.stakingTokenBalance)
    : BIG_ZERO

  const [onPresentStake] = useModal(
    <VaultStakeModal
      stakingMax={stakingTokenBalance}
      performanceFee={ifoPoolVault.fees.performanceFeeAsDecimal}
      pool={pool}
    />,
  )

  const renderTokenSection = () => {
    if (isLoading) {
      return <SkeletonCardTokens />
    }
    if (!account) {
      return <OnSaleInfo token={token} distributionRatio={distributionRatio} saleAmount={ifo[poolId].saleAmount} />
    }

    let message

    if (account && !hasProfile) {
      message = (
        <Message my="24px" p="8px" variant="warning">
          <Box>
            <MessageText display="inline">
              {publicIfoData.status === 'finished'
                ? t('Activate PancakeSwap Profile to take part in next IFO‘s!')
                : t('You need an active PancakeSwap Profile to take part in an IFO!')}
            </MessageText>{' '}
            <MessageTextLink href="#ifo-how-to" color="#D67E0A" display="inline">
              {t('How does it work?')} »
            </MessageTextLink>
          </Box>
        </Message>
      )
    }

    if (ifo.version === 3 && getBalanceNumber(credit) === 0) {
      message = (
        <Message my="24px" p="8px" variant="danger">
          <Box>
            <MessageText display="inline">
              {t('You don’t have any average CAKE balance available to commit in the IFO CAKE pool.')}
            </MessageText>{' '}
            <MessageTextLink display="inline" fontWeight={700} href="#ifo-how-to" color="failure">
              {t('How does it work?')} »
            </MessageTextLink>
          </Box>
        </Message>
      )
    }
    if (account && !hasProfile) {
      return (
        <>
          <OnSaleInfo token={token} distributionRatio={distributionRatio} saleAmount={ifo[poolId].saleAmount} />
          {message}
        </>
      )
    }
    if (publicIfoData.status === 'coming_soon') {
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
          {enableStatus !== EnableStatus.ENABLED && account && (
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
            <Value>{getBalanceNumber(userPoolCharacteristics.amountTokenCommittedInLP, currency.decimals)}</Value>
            <PercentageOfTotal
              userAmount={userPoolCharacteristics.amountTokenCommittedInLP}
              totalAmount={publicPoolCharacteristics.totalAmountPool}
            />
          </CommitTokenSection>
          <TokenSection primaryToken={ifo.token}>
            <Label>{t('%symbol% to receive', { symbol: token.symbol })}</Label>
            <Value>{getBalanceNumber(userPoolCharacteristics.offeringAmountInToken, token.decimals)}</Value>
          </TokenSection>
        </>
      )
    }
    if (publicIfoData.status === 'finished') {
      return userPoolCharacteristics.amountTokenCommittedInLP.isEqualTo(0) ? (
        <Flex flexDirection="column" alignItems="center">
          <BunnyPlaceholderIcon width={80} mb="16px" />
          <Text fontWeight={600}>{t('You didn’t participate in this sale!')}</Text>
          <Text textAlign="center" fontSize="14px">
            {t('To participate in the next IFO, stake some CAKE in the IFO CAKE pool!')}
          </Text>
          <MessageTextLink href="#ifo-how-to" textAlign="center">
            {t('How does it work?')} »
          </MessageTextLink>
          {!pool.isFinished && (
            <Button mt="24px" onClick={onPresentStake}>
              {t('Stake CAKE in IFO pool')}
            </Button>
          )}
        </Flex>
      ) : (
        <>
          <CommitTokenSection commitToken={ifo.currency} mb="24px">
            <Label>
              {t(hasClaimed ? 'Your %symbol% RECLAIMED' : 'Your %symbol% TO RECLAIM', { symbol: currency.symbol })}
            </Label>
            <Flex alignItems="center">
              <Value>{getBalanceNumber(userPoolCharacteristics.refundingAmountInLP, currency.decimals)}</Value>
              {hasClaimed && <CheckmarkCircleIcon color="success" ml="8px" />}
            </Flex>
            <PercentageOfTotal
              userAmount={userPoolCharacteristics.amountTokenCommittedInLP}
              totalAmount={publicPoolCharacteristics.totalAmountPool}
            />
          </CommitTokenSection>
          <TokenSection primaryToken={ifo.token}>
            <Label> {t(hasClaimed ? '%symbol% received' : '%symbol% to receive', { symbol: token.symbol })}</Label>
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
