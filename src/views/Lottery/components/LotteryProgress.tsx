import React from 'react'
import styled from 'styled-components'
import { Text, Progress } from 'greenteaswap-ui-kit'
import useI18n from 'hooks/useI18n'
import useGetLotteryHasDrawn from 'hooks/useGetLotteryHasDrawn'
import { useCurrentTime } from 'hooks/useTimer'
import {
  getLotteryDrawTime,
  getLotteryDrawStep,
  getTicketSaleTime,
  getTicketSaleStep,
} from '../helpers/CountdownHelpers'

const ProgressWrapper = styled.div`
  display: block;
  width: 100%;
`

const TopTextWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const BottomTextWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
`

const StyledPrimaryText = styled(Text)`
  margin-right: 16px;
`

const TextDetail = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 20px;
  font-weight: bold;
`

const LotteryProgress = () => {
  const TranslateString = useI18n()
  const lotteryHasDrawn = useGetLotteryHasDrawn()
  const currentMillis = useCurrentTime()
  const timeUntilTicketSale = getTicketSaleTime(currentMillis)
  const timeUntilLotteryDraw = getLotteryDrawTime(currentMillis)

  return (
    <ProgressWrapper>
      <Progress primaryStep={getLotteryDrawStep(currentMillis)} secondaryStep={getTicketSaleStep()} showProgressBunny />
      <TopTextWrapper>
        <StyledPrimaryText fontSize="20px" bold color="contrast">
          {lotteryHasDrawn ? timeUntilTicketSale : timeUntilLotteryDraw}
        </StyledPrimaryText>
        <TextDetail>
          {lotteryHasDrawn ? TranslateString(0, 'Until ticket sale') : TranslateString(0, 'Until lottery draw')}
        </TextDetail>
      </TopTextWrapper>
      {lotteryHasDrawn && (
        <BottomTextWrapper>
          <TextDetail >
            {timeUntilLotteryDraw} {TranslateString(0, 'Until lottery draw')}
          </TextDetail>
        </BottomTextWrapper>
      )}
    </ProgressWrapper>
  )
}

export default LotteryProgress
