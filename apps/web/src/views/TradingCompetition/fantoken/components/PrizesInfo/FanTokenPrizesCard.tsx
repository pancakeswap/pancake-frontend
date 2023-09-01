import { styled } from 'styled-components'
import { Card, CardHeader, Box, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import PrizesGrid from '../../../components/PrizesInfo/PrizesGrid/PrizesGrid'
import { fanTokenPrizes } from '../../../../../config/constants/trading-competition/prizes'

const StyledCard = styled(Card)`
  ${({ theme }) => theme.mediaQueries.md} {
    margin-right: 40px;
    flex: 1;
  }
`

const FanTokenPrizesCard = () => {
  const { t } = useTranslation()

  return (
    <StyledCard>
      <CardHeader>
        <Heading scale="lg" color="secondary">
          {t('Prizes by Team')}
        </Heading>
        <Text color="textSubtle" fontSize="14px">
          {t('Higher trading volume = higher rank!')}
        </Text>
      </CardHeader>
      <PrizesGrid prizesConfig={fanTokenPrizes} />
      <Box p="24px">
        <Text color="textSubtle" fontSize="14px">
          {t(
            'Prizes to be distributed in CAKE, LAZIO, PORTO and SANTOS in a distribution of 3:1:1:1 and shared by all members of each respective tier.',
          )}{' '}
          {t(
            'The price of token prizes (CAKE, LAZIO, PORTO and SANTOS) in USD will be determined as per their BUSD pair price during the tally period.',
          )}
        </Text>
      </Box>
    </StyledCard>
  )
}

export default FanTokenPrizesCard
