import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text } from '@pancakeswap/uikit'
import isUndefinedOrNull from '@pancakeswap/utils/isUndefinedOrNull'
import { LotteryTicket } from 'config/constants/types'
import _uniqueId from 'lodash/uniqueId'
import { styled } from 'styled-components'
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

const TicketNumber: React.FC<React.PropsWithChildren<TicketNumberProps>> = ({ localId, id, number, rewardBracket }) => {
  const { t } = useTranslation()
  const reversedNumber = parseRetrievedNumber(number)
  const numberAsArray = reversedNumber.split('')
  const numberMatches = !isUndefinedOrNull(rewardBracket) && rewardBracket! >= 0 ? rewardBracket! + 1 : null

  return (
    <Flex flexDirection="column" mb="12px">
      <Flex justifyContent="space-between">
        <Text fontSize="12px" color="textSubtle">
          #{localId || id}
        </Text>
        {numberMatches ? (
          <Text fontSize="12px">
            {t('Matched first')} {numberMatches}
          </Text>
        ) : null}
      </Flex>
      <StyledNumberWrapper>
        {numberMatches ? <RewardHighlighter numberMatches={numberMatches} /> : null}
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
