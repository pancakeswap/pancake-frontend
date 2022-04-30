import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import PrizesText from './PrizesText'
import PrizesCard from './PrizesCard'

const Wrapper = styled(Flex)`
  flex-direction: column-reverse;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`

const PrizesInfo = () => {
  return (
    <Wrapper flexDirection="column">
      <PrizesCard />
      <PrizesText />
    </Wrapper>
  )
}

export default PrizesInfo
