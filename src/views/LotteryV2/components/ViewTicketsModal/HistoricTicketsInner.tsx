import React, { useEffect, useState } from 'react'
import { Box, Text, Flex, Button, Skeleton } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { fetchLottery, ProcessLotteryResponse } from 'state/lottery/helpers'
import { LotteryRound } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import WinningNumbers from '../WinningNumbers'

const ScrollBox = styled(Box)`
  /* max-height: 300px; */
  overflow-y: scroll;
  margin-top: 24px;
`

const HistoricTicketsInner: React.FC<{ roundId: string }> = ({ roundId }) => {
  const [lotteryInfo, setLotteryInfo] = useState<LotteryRound>(null)
  const { t } = useTranslation()
  const { theme } = useTheme()

  useEffect(() => {
    const fetchData = async () => {
      const lotteryData = await fetchLottery(roundId)
      const processedLotteryData = ProcessLotteryResponse(lotteryData)
      setLotteryInfo(processedLotteryData)
    }

    fetchData()
  }, [roundId])

  return (
    <>
      <Flex pb="16px" borderBottom={`1px solid ${theme.colors.cardBorder}`} flexDirection="column">
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" mb="4px">
          {t('Winning number')}
        </Text>
        {lotteryInfo?.finalNumber ? (
          <WinningNumbers number={lotteryInfo.finalNumber.toString()} />
        ) : (
          <Skeleton width="240px" height="34px" />
        )}
      </Flex>
      <ScrollBox>
        <Text bold textTransform="uppercase" color="secondary" fontSize="12px" mb="16px">
          {t('Your tickets')}
        </Text>
      </ScrollBox>
      <Flex borderTop={`1px solid ${theme.colors.cardBorder}`} alignItems="center" justifyContent="center">
        <Button mt="24px" width="100%">
          Test
        </Button>
      </Flex>
    </>
  )
}

export default HistoricTicketsInner
