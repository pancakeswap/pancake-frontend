import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Row } from 'views/DashboardCampaigns/components/Row'
import { CompletionStatusIndex } from 'views/DashboardQuestEdit/type'

const DetailContainer = styled(Box)`
  padding: 16px;
  border-top: solid 1px ${({ theme }) => theme.colors.cardBorder};
  background: ${({ theme }) => theme.colors.dropdown};
`

const StyledRows = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii.card};
  border: solid 1px ${({ theme }) => theme.colors.cardBorder};

  > div {
    border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};

    &:last-child {
      border-bottom: 0;
    }
  }
`
interface DetailProps {
  statusButtonIndex: CompletionStatusIndex
}

export const Detail: React.FC<DetailProps> = ({ statusButtonIndex }) => {
  const { t } = useTranslation()

  return (
    <DetailContainer className="dropdown">
      <Text bold textAlign="center" color="textSubtle" padding="4px 0 20px 0">
        {t('Related Quests')}
      </Text>
      <StyledRows>
        <Row statusButtonIndex={statusButtonIndex} />
        <Row statusButtonIndex={statusButtonIndex} />
      </StyledRows>
    </DetailContainer>
  )
}
