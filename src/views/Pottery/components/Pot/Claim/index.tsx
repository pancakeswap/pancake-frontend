import styled from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import YourDeposit from '../YourDeposit'
import WinRate from '../WinRate'
import WalletNotConnected from './WalletNotConnected'
import CardFooter from './CardFooter'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
`

const Claim: React.FC = () => {
  const { account } = useActiveWeb3React()

  return (
    <Box>
      {account ? (
        <Container>
          <GreyCard>
            <Flex justifyContent="space-between">
              <YourDeposit />
              <WinRate />
            </Flex>
          </GreyCard>
        </Container>
      ) : (
        <WalletNotConnected />
      )}
      <CardFooter />
    </Box>
  )
}

export default Claim
