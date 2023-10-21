import { AutoRow, Button, Text, Flex, Message, MessageText, Box, Link } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { LightGreyCard } from 'components/Card'
import { CurrencyLogo } from '@pancakeswap/widgets-internal'

import useMerkl from '../../hooks/useMerkl'

export function MerklSection({ poolAddress }: { poolAddress: string | null }) {
  const { t } = useTranslation()

  const { claimTokenReward, isClaiming, rewardsPerToken } = useMerkl(poolAddress)

  if (!rewardsPerToken.length) return null

  return (
    <Box width="100%" ml={[0, 0, 0, '16px']} mt="24px">
      <AutoRow justifyContent="space-between" mb="8px">
        <Text fontSize="12px" color="secondary" bold textTransform="uppercase">
          {t('Merkl Rewards')}
        </Text>
        <Button disabled={isClaiming} scale="sm" onClick={claimTokenReward}>
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
              <Text small>{tokenAmount.toSignificant(6)}</Text>
            </Flex>
          </AutoRow>
        ))}
      </LightGreyCard>
      <Message variant="primary">
        <MessageText>
          This liquidity position is currently earning rewards on Merkl. Check details{' '}
          <Link external style={{ display: 'inline-flex' }} href="https://merkl.angle.money/">
            {t('here')}
          </Link>{' '}
          <br />
          <Link external style={{ display: 'inline-flex' }} href="https://merkl.angle.money/">
            {t('Learn more about Merkl')}
          </Link>
        </MessageText>
      </Message>
    </Box>
  )
}
