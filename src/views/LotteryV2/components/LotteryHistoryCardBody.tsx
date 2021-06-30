import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { CardBody, Heading, Flex, Skeleton } from '@pancakeswap/uikit'
import { fetchLottery } from 'state/lottery/helpers'
import { LotteryRound } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import WinningNumbers from './WinningNumbers'

const StyledCardBody = styled(CardBody)``

const LotteryHistoryCardBody: React.FC<{ lotteryData: LotteryRound }> = ({ lotteryData }) => {
  const { t } = useTranslation()

  return (
    <StyledCardBody>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Heading mb="24px">{t('Winning Number')}</Heading>
        {lotteryData ? (
          <WinningNumbers number={lotteryData?.finalNumber.toString()} />
        ) : (
          <Skeleton width="240px" height="34px" />
        )}
      </Flex>
    </StyledCardBody>
  )
}

export default LotteryHistoryCardBody
