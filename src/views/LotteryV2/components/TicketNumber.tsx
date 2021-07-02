import React from 'react'
import { LotteryTicket } from 'config/constants/types'
import { Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { parseRetreivedNumber } from '../helpers'

const StyledNumberWrapper = styled(Flex)`
  position: absolute;
  padding: 4px 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.background};
  justify-content: space-between;
`

const RewardHighlighter = styled.div<{ numberMatches: number }>`
  position: absolute;
  border: 2px red;
`

interface TicketNumberProps extends LotteryTicket {
  localId?: number
  rewardBracket?: number
}

const TicketNumber: React.FC<TicketNumberProps> = ({ localId, id, number, rewardBracket }) => {
  const { t } = useTranslation()
  const reversedNumber = parseRetreivedNumber(number)
  const numberAsArray = reversedNumber.split('')
  const numberMatches = rewardBracket + 1

  return (
    <Flex flexDirection="column" mb="12px">
      <Flex justifyContent="space-between">
        <Text fontSize="12px" color="textSubtle">
          #{localId || id}
        </Text>
        {numberMatches && (
          <Text fontSize="12px">
            {t('Matched first')} {numberMatches}
          </Text>
        )}
      </Flex>
      <StyledNumberWrapper>
        {numberMatches && <RewardHighlighter numberMatches={numberMatches} />}
        {numberAsArray.map((digit) => (
          <Text fontSize="16px">{digit}</Text>
        ))}
      </StyledNumberWrapper>
    </Flex>
  )
}

export default TicketNumber
