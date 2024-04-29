import { useTranslation } from '@pancakeswap/localization'
import { Box, Text } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { Campaign } from 'views/Campaigns/components/Campaign'

const CampaignContainer = styled(Box)`
  max-width: 100%;
  > a {
    &:hover {
      text-decoration: none;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    max-width: 398px;
  }
`

export const RelatedQuest = () => {
  const { t } = useTranslation()

  return (
    <Box mt="32px">
      <Text fontSize="24px" lineHeight="28px" bold mb="16px">
        {t('This quest is also a part of:')}
      </Text>
      <CampaignContainer>
        <Campaign />
      </CampaignContainer>
    </Box>
  )
}
