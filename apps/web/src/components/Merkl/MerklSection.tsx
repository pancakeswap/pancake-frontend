import { useTranslation } from '@pancakeswap/localization'
import {
  AutoRow,
  Box,
  Button,
  Flex,
  Link,
  Message,
  MessageText,
  Text,
  TooltipText,
  useTooltip,
} from '@pancakeswap/uikit'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'
import { LightGreyCard } from 'components/Card'

import { Currency, CurrencyAmount } from '@pancakeswap/swap-sdk-core'
import useMerkl from '../../hooks/useMerkl'

function TextWarning({ tokenAmount }: { tokenAmount: CurrencyAmount<Currency> }) {
  const { t } = useTranslation()
  const { tooltip, tooltipVisible, targetRef } = useTooltip(
    t('Combined number of rewards in %symbol% from ALL your positions which are eligible for Merkl rewards.', {
      symbol: tokenAmount.currency.symbol,
    }),
    {
      placement: 'top',
      trigger: 'hover',
    },
  )

  return (
    <>
      <TooltipText ref={targetRef} small>
        {tokenAmount.toSignificant(6)}
      </TooltipText>
      {tooltipVisible && tooltip}
    </>
  )
}

export function MerklSection({
  poolAddress,
  notEnoughLiquidity,
  isStakedInMCv3,
  outRange,
  disabled,
}: {
  outRange: boolean
  disabled: boolean
  poolAddress: string | null
  notEnoughLiquidity: boolean
  isStakedInMCv3: boolean
}) {
  const { t } = useTranslation()

  const { claimTokenReward, isClaiming, rewardsPerToken, hasMerkl } = useMerkl(poolAddress)

  if (!rewardsPerToken.length || (!hasMerkl && rewardsPerToken.every((r) => r.equalTo('0')))) return null

  const learnMoreComp = (
    <Link
      color="currentColor"
      fontSize="md"
      external
      style={{ display: 'inline-flex' }}
      href="https://docs.angle.money/merkl/introduction"
    >
      {t('Learn more about Merkl')}
    </Link>
  )

  return (
    <Box width="100%" ml={[0, 0, 0, '16px']} mt="24px">
      <AutoRow justifyContent="space-between" mb="8px">
        <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
          {t('Merkl Rewards')}
        </Text>
        <Button
          disabled={disabled || isClaiming || rewardsPerToken.every((r) => r.equalTo('0'))}
          scale="sm"
          onClick={claimTokenReward}
        >
          {isClaiming ? t('Claiming...') : t('Claim')}
        </Button>
      </AutoRow>
      <LightGreyCard
        mr="4px"
        style={{
          padding: '16px 8px',
          marginBottom: '8px',
        }}
      >
        {rewardsPerToken.map((tokenAmount) => (
          <AutoRow justifyContent="space-between" mb="8px">
            <Flex>
              <CurrencyLogo currency={tokenAmount.currency} />
              <Text small color="textSubtle" id="remove-liquidity-tokenb-symbol" ml="4px">
                {tokenAmount.currency.symbol}
              </Text>
            </Flex>
            <Flex justifyContent="center">
              <TextWarning tokenAmount={tokenAmount} />
            </Flex>
          </AutoRow>
        ))}
      </LightGreyCard>

      {isStakedInMCv3 ? (
        <Message variant="warning">
          <MessageText color="textSubtle">
            {t('To earn rewards on Merkl, unstake this position from PancakeSwap Farms.')}
            <br />
            {learnMoreComp}
          </MessageText>
        </Message>
      ) : outRange ? (
        <Message variant="warning">
          <MessageText color="textSubtle">
            {t('This Merkl campaign is NOT rewarding out-of-range liquidity. To earn rewards, adjust your position.')}
            <br />
            {learnMoreComp}
          </MessageText>
        </Message>
      ) : hasMerkl ? (
        <Message variant={notEnoughLiquidity ? 'warning' : 'primary'}>
          <MessageText color={notEnoughLiquidity ? 'textSubtle' : ''}>
            {notEnoughLiquidity
              ? t(
                  'This liquidity position will NOT earn any rewards on Merkl due to its total USD value being less than $20.',
                )
              : t('This liquidity position is currently earning rewards on Merkl.')}{' '}
            {t('Details')}{' '}
            <Link
              fontSize="md"
              external
              color="currentColor"
              style={{ display: 'inline-flex' }}
              href="https://merkl.angle.money/?times=active%2Cfuture%2C&phrase=PancakeSwap"
            >
              {t('here')}
            </Link>{' '}
            <br />
            {learnMoreComp}
          </MessageText>
        </Message>
      ) : null}
    </Box>
  )
}
