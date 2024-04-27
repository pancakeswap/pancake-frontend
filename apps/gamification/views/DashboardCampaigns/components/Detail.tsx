import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Row } from 'views/DashboardCampaigns/components/Row'

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

export const Detail = () => {
  const { t } = useTranslation()

  return (
    <DetailContainer className="dropdown">
      <Text bold textAlign="center" color="textSubtle" padding="4px 0 20px 0">
        {t('Related Quests')}
      </Text>
      <StyledRows>
        <Row />
        <Row />
      </StyledRows>
    </DetailContainer>
  )
}
