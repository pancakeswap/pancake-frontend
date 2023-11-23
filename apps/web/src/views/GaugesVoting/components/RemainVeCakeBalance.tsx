import { useTranslation } from '@pancakeswap/localization'
import { Balance, Box, Flex, Text } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useMemo } from 'react'
import styled from 'styled-components'
import { useEpochVotePower } from '../hooks/useEpochVotePower'

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

export const RemainVeCakeBalance: React.FC<{
  votedPercent: number
}> = ({ votedPercent }) => {
  const { t } = useTranslation()

  const totalPower = useEpochVotePower()

  const votePower = useMemo(() => {
    return new BN(totalPower.toString()).times(10000 - votedPercent * 100).dividedBy(10000)
  }, [totalPower, votedPercent])

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
