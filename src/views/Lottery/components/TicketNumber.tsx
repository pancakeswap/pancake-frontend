import React from 'react'
import { LotteryTicket } from 'config/constants/types'
import { Flex, Text } from '@tovaswapui/uikit'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import _uniqueId from 'lodash/uniqueId'
import { parseRetrievedNumber } from '../helpers'

const StyledNumberWrapper = styled(Flex)`
  position: relative;
  padding: 4px 16px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.background};
  justify-content: space-between;
`

const RewardHighlighter = styled.div<{ numberMatches: number }>`
  z-index: 1;
  width: ${({ numberMatches }) => `${numberMatches < 6 ? numberMatches * 17.66 : 100}%`};
  height: 34px;
  border-radius: ${({ theme }) => theme.radii.default};
  top: 0;
  left: 0;
  position: absolute;
  border: 2px ${({ theme }) => theme.colors.primary} solid;
`

interface TicketNumberProps extends LotteryTicket {
  localId?: number
  rewardBracket?: number
}

const TicketNumber: React.FC<TicketNumberProps> = ({ localId, id, number, rewardBracket }) => {
  const { t } = useTranslation()
  const reversedNumber = parseRetrievedNumber(number)
  const numberAsArray = reversedNumber.split('')
  const numberMatches = rewardBracket + 1

  return (
    <Flex flexDirection="column" mb="12px">
      <Flex justifyContent="space-between">
        <Text fontSize="12px" color="textSubtle">
          #{localId || id}
        </Text>
        {rewardBracket >= 0 && (
          <Text fontSize="12px">
            {t('Matched first')} {numberMatches}
          </Text>
        )}
      </Flex>
      <StyledNumberWrapper>
        {rewardBracket >= 0 && <RewardHighlighter numberMatches={numberMatches} />}
        {numberAsArray.map((digit) => (
          <Text key={`${localId || id}-${digit}-${_uniqueId()}`} fontSize="16px">
            {digit}
          </Text>
        ))}
      </StyledNumberWrapper>
    </Flex>
  )
}

export default TicketNumber
