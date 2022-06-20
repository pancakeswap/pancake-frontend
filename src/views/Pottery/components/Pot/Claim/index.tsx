import styled from 'styled-components'
import { Flex, Box } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { usePotteryData } from 'state/pottery/hook'
import YourDeposit from '../YourDeposit'
import WinRate from '../WinRate'
import WalletNotConnected from './WalletNotConnected'
import AvailableWitdraw from './AvailableWitdraw'
import PrizeToBeClaimed from './PrizeToBeClaimed'
import CardFooter from './CardFooter'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
`

const Claim: React.FC = () => {
  const { account } = useActiveWeb3React()
  const { publicData, userData } = usePotteryData()

  return (
    <Box>
      {account ? (
        <Container>
          <GreyCard>
            <Flex justifyContent="space-between">
              <YourDeposit />
              <WinRate />
            </Flex>
            <AvailableWitdraw />
            <PrizeToBeClaimed userData={userData} />
          </GreyCard>
        </Container>
      ) : (
        <WalletNotConnected />
      )}
      <CardFooter account={account} publicData={publicData} userData={userData} />
    </Box>
  )
}

export default Claim
