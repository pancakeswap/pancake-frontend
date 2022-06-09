import styled from 'styled-components'
import { Flex, Box, Button, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { GreyCard } from 'components/Card'
import CardHeader from '../CardHeader'
import YourDeposit from '../YourDeposit'
import WinRate from '../WinRate'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
  border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};
`

const CardAction = styled(Flex)`
  flex-direction: column;
  padding: 26px 24px 36px 24px;
`

const Deposit: React.FC = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <CardHeader
        title="Syrup Pot"
        subTitle="Stake CAKE, Earn CAKE, Win CAKE"
        primarySrc="/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg"
        secondarySrc="/images/tokens/pot-icon.svg"
      />
      <Container>
        <GreyCard mb="18px">
          <Flex justifyContent="space-between">
            <YourDeposit />
            <WinRate />
          </Flex>
        </GreyCard>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('APY')}</Text>
          <Text bold>34.33%</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Next draw date')}</Text>
          <Text bold>in 1d 23h 11s</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Total Value Locked')}</Text>
          <Text bold>1,234,567.89 CAKE</Text>
        </Flex>
      </Container>
      <CardAction>
        <Button>Enable</Button>
      </CardAction>
    </Box>
  )
}

export default Deposit
