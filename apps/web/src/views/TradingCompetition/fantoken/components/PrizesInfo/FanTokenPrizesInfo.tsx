import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import FanTokenPrizesCard from './FanTokenPrizesCard'
import FanTokenPrizesText from './FanTokenPrizesText'

const Wrapper = styled(Flex)`
  flex-direction: column-reverse;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`

const FanTokenPrizesInfo = () => {
  return (
    <Wrapper flexDirection="column">
      <FanTokenPrizesCard />
      <FanTokenPrizesText />
    </Wrapper>
  )
}

export default FanTokenPrizesInfo
