import { styled } from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import MoboxPrizesCard from './MoboxPrizesCard'
import MoboxPrizesText from './MoboxPrizesText'

const Wrapper = styled(Flex)`
  flex-direction: column-reverse;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
`

const MoboxPrizesInfo = () => {
  return (
    <Wrapper flexDirection="column">
      <MoboxPrizesCard />
      <MoboxPrizesText />
    </Wrapper>
  )
}

export default MoboxPrizesInfo
