import { useTranslation } from '@pancakeswap/localization'
import { Percent } from '@pancakeswap/swap-sdk-core'
import { Balance, Box, Flex, Text } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import styled from 'styled-components'
import { useVotedPower } from '../hooks/useVotedPower'

const StyledBox = styled(Box)`
  border-radius: 16px;
  background: linear-gradient(229deg, #1fc7d4 -13.69%, #7645d9 91.33%);
  padding: 18px;
  display: inline-flex;
  align-items: center;
  min-width: 100%;
  flex-direction: row;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 460px;
  }
`

export const RemainVeCakeBalance = () => {
  const { t } = useTranslation()
  const votedPower = useVotedPower() ?? 0
  const { balance: veCake } = useVeCakeBalance()
  const votePower = useMemo(() => {
    return new BN(new Percent(10000 - (Number(votedPower) || 0), 10000).multiply(veCake.toString()).toString())
  }, [veCake, votedPower])

  return (
    <StyledBox>
      <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="58px" />
      <Flex flexDirection={['column', 'column', 'row']} justifyContent="space-between" width="100%" ml="4px">
        <Text fontSize="20px" bold color="white" lineHeight="120%">
          {t('Remaining veCAKE')}
        </Text>
        <Balance
          fontSize="24px"
          bold
          color="white"
          lineHeight="110%"
          value={getBalanceNumber(votePower) || 0}
          decimals={2}
        />
      </Flex>
    </StyledBox>
  )
}
