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
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { Token } from '@pancakeswap/sdk'
import { Ifo, PoolIds } from 'config/constants/types'
import tokens from 'config/constants/tokens'
import { cakeBnbLpToken } from 'config/constants/ifo'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { useIfoCredit } from 'state/pools/hooks'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { EnableStatus } from '../types'
import PercentageOfTotal from './PercentageOfTotal'
import { SkeletonCardTokens } from './Skeletons'
import IFORequirements from './IFORequirements'
import { MessageTextLink } from '../../IfoCardStyles'
import StakeVaultButton from '../StakeVaultButton'
import VestingAvailableToClaim from './VestingAvailableToClaim'

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
  criterias?: any
  isEligible?: boolean
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

const IfoCardTokens: React.FC<IfoCardTokensProps> = ({
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

  const { currency, token, version } = ifo
  const { hasClaimed } = userPoolCharacteristics
  const distributionRatio = ifo[poolId].distributionRatio * 100
  const credit = useIfoCredit()

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
            <MessageTextLink href="/ifo#ifo-how-to" color="#D67E0A" display="inline">
              {t('How does it work?')} »
            </MessageTextLink>
          </Box>
        </Message>
      )
    }

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
                {t('You are eligible to participate in this Private Sale!')}
              </MessageText>
            </Message>
          )}
        </Box>
      ) : null

    if (
      (ifo.version === 3 || (ifo.version >= 3.1 && poolId === PoolIds.poolUnlimited)) &&
      getBalanceNumber(credit) === 0
    ) {
      message = (
        <Message my="24px" p="8px" variant="danger">
          <Box>
            <MessageText display="inline">{t('You don’t have any iCAKE available for IFO public sale.')}</MessageText>{' '}
            <MessageTextLink display="inline" fontWeight={700} href="/ifo#ifo-how-to" color="failure">
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

    message = ifov31Msg || message

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

    if (publicIfoData.status === 'finished') {
      return userPoolCharacteristics.amountTokenCommittedInLP.isEqualTo(0) ? (
        <Flex flexDirection="column" alignItems="center">
          <BunnyPlaceholderIcon width={80} mb="16px" />
          <Text fontWeight={600}>{t('You didn’t participate in this sale!')}</Text>
          {ifov31Msg || (
            <>
              <Text textAlign="center" fontSize="14px">
                {t('To participate in the next IFO, lock some CAKE in the fixed-term staking CAKE pool!')}
              </Text>
              <MessageTextLink href="/ifo#ifo-how-to" textAlign="center">
                {t('How does it work?')} »
              </MessageTextLink>
              <StakeVaultButton mt="24px" />
            </>
          )}
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
              <Value>{getBalanceNumber(userPoolCharacteristics.refundingAmountInLP, currency.decimals)}</Value>
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
