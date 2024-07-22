import { useTranslation } from '@pancakeswap/localization'
import { Flex, InfoIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { styled } from 'styled-components'

const Container = styled(Flex)`
  padding: 0 0 16px 0;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

interface WinnersProps {
  totalWinners: number
}

export const Winners: React.FC<WinnersProps> = ({ totalWinners }) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Text>
      {t(
        'The total rewards to be distributed will depend on the eligible questers selected at random. Eligible questers are those who have completed all the tasks.',
      )}
    </Text>,
    {
      placement: 'top',
    },
  )

  return (
    <Container ref={targetRef} mt="16px" justifyContent="center">
      <Text bold>{t('%total% winners max.', { total: totalWinners })}</Text>
      <InfoIcon color="textSubtle" style={{ alignSelf: 'center' }} />
      {tooltipVisible && tooltip}
    </Container>
  )
}
