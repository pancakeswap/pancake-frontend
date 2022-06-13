import styled from 'styled-components'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { GreyCard } from 'components/Card'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import YourDeposit from '../YourDeposit'
import WinRate from '../WinRate'
import DepositAction from './DepositAction'

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
  const { account } = useActiveWeb3React()

  return (
    <Box>
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
          <Text bold>in 1d 23h 11m</Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Text color="textSubtle">{t('Total Value Locked')}</Text>
          <Text bold>1,234,567.89 CAKE</Text>
        </Flex>
      </Container>
      <CardAction>{account ? <DepositAction /> : <ConnectWalletButton />}</CardAction>
    </Box>
  )
}

export default Deposit
