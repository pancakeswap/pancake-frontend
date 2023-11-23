import { useTranslation } from '@pancakeswap/localization'
import { Balance, Box, ErrorIcon, Flex, FlexGap, Text } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import { useVeCakeBalance } from 'hooks/useTokenBalance'
import { useMemo } from 'react'
import styled from 'styled-components'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'
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

export const RemainingVotePower: React.FC<{
  votedPercent: number
}> = ({ votedPercent }) => {
  const { t } = useTranslation()

  const { balance: veCakeBalance } = useVeCakeBalance()
  const totalPower = useEpochVotePower()

  // @note: real power is EpochEndPower * (10000 - PercentVoted)
  // use veCakeBalance as cardinal number for better UX understanding
  const votePower = useMemo(() => {
    return veCakeBalance.times(10000 - votedPercent * 100).dividedBy(10000)
  }, [veCakeBalance, votedPercent])

  const realPower = useMemo(() => {
    return new BN(totalPower.toString()).times(10000 - votedPercent * 100).dividedBy(10000)
  }, [totalPower, votedPercent])

  return (
    <StyledBox>
      <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="58px" />
      <Flex flexDirection={['column', 'column', 'row']} justifyContent="space-between" width="100%" ml="4px">
        <Text fontSize="20px" bold color="white" lineHeight="2">
          {t('Remaining veCAKE')}
        </Text>
        {realPower.gt(0) ? (
          <Balance
            fontSize="24px"
            bold
            color="white"
            lineHeight="110%"
            value={getBalanceNumber(votePower) || 0}
            decimals={2}
          />
        ) : (
          <FlexGap gap="4px" alignItems="center">
            <Text textTransform="uppercase" color="warning" bold fontSize={24}>
              {t('unlocking')}
            </Text>
            <Tooltips
              content={
                <>
                  {t(
                    'Your positions are unlocking soon. Therefore, you have no veCAKE balance at the end of the current voting epoch while votes are being tallied. ',
                  )}
                  <br />
                  <br />
                  {t('Extend your lock to cast votes.')}
                </>
              }
            >
              <ErrorIcon color="warning" style={{ marginBottom: '-2.5px' }} />
            </Tooltips>
          </FlexGap>
        )}
      </Flex>
    </StyledBox>
  )
}
