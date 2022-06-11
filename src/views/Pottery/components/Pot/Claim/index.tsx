import styled from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import CardHeader from '../CardHeader'
import YourDeposit from '../YourDeposit'
import WinRate from '../WinRate'
import CardFooter from './CardFooter'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
`

const Claim: React.FC = () => {
  return (
    <Box>
      <CardHeader
        title="Pottery"
        subTitle="Stake CAKE, Earn CAKE, Win CAKE"
        primarySrc="/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg"
        secondarySrc="/images/tokens/pot-icon.svg"
      />
      <Container>
        <GreyCard>
          <Flex justifyContent="space-between">
            <YourDeposit />
            <WinRate />
          </Flex>
        </GreyCard>
      </Container>
      <CardFooter />
    </Box>
  )
}

export default Claim
