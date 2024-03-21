import { useTranslation } from '@pancakeswap/localization'
import { Balance, Box, Flex, Text } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useVaultApy } from 'hooks/useVaultApy'
import { useMemo } from 'react'
import { DeserializedPotteryUserData, DeserializedPublicData, PotteryDepositStatus } from 'state/types'
import { styled } from 'styled-components'
import { distanceToNowStrict } from 'utils/timeHelper'
import { weeksToSeconds } from 'views/Pools/components/utils/formatSecondsToWeeks'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.gradientCardHeader};
`

interface CardFooterProps {
  account?: string
  publicData: DeserializedPublicData
  userData: DeserializedPotteryUserData
}

const CardFooter: React.FC<React.PropsWithChildren<CardFooterProps>> = ({ account, publicData, userData }) => {
  const { t } = useTranslation()
  const { getBoostFactor } = useVaultApy()

  const boostFactor = useMemo(() => getBoostFactor(weeksToSeconds(10)), [getBoostFactor])
  const boostFactorDisplay = useMemo(() => `X${Number(boostFactor).toFixed(2)}`, [boostFactor])

  const totalValueLocked = getBalanceNumber(publicData.totalLockCake)

  const daysRemaining = useMemo(() => {
    const timerUntil = new BigNumber(publicData.lockStartTime).plus(weeksToSeconds(10)).times(1000).toNumber()
    return timerUntil
  }, [publicData])

  return (
    <Container>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold as="span">
            {t('weighted')}
          </Text>
          <Text fontSize="12px" ml="4px" color="secondary" textTransform="uppercase" bold as="span">
            {t('avg multiplier')}
          </Text>
        </Box>
        <Text bold>{account ? boostFactorDisplay : '-'}</Text>
      </Flex>
      {publicData.getStatus !== PotteryDepositStatus.BEFORE_LOCK && (
        <Box>
          <Flex justifyContent="space-between">
            <Box>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
                {t('Deposit')}
              </Text>
              <Text fontSize="12px" ml="4px" color="textSubtle" textTransform="uppercase" bold as="span">
                {t('by cohort')}
              </Text>
            </Box>
            <Box>
              {account ? (
                <Flex>
                  <Balance bold decimals={2} value={totalValueLocked} />
                  <Text ml="4px" color="textSubtle" as="span">
                    CAKE
                  </Text>
                </Flex>
              ) : (
                <Text bold as="span">
                  -
                </Text>
              )}
            </Box>
          </Flex>
          <Flex justifyContent="space-between">
            <Box>
              <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
                {t('remaining')}
              </Text>
              <Text fontSize="12px" ml="4px" color="textSubtle" textTransform="uppercase" bold as="span">
                {t('period')}
              </Text>
            </Box>
            <Box>
              {account ? (
                <>
                  <Text bold>{distanceToNowStrict(daysRemaining)}</Text>
                </>
              ) : (
                <Text bold as="span">
                  -
                </Text>
              )}
            </Box>
          </Flex>
        </Box>
      )}
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold as="span">
            {t('total #')}
          </Text>
          <Text fontSize="12px" ml="4px" color="secondary" textTransform="uppercase" bold as="span">
            {t('winnings')}
          </Text>
        </Box>
        <Text bold>{account ? userData.winCount : '-'}</Text>
      </Flex>
    </Container>
  )
}

export default CardFooter
