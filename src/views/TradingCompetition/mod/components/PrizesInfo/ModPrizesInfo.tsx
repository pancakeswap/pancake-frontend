import styled from 'styled-components'
import { Flex } from '@pancakeswap/uikit'
import ModPrizesCard from './ModPrizesCard'
import ModPrizesText from './ModPrizesText'

const Wrapper = styled(Flex)`
  flex-direction: column-reverse;

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    justify-content: center;
    align-items: flex-start;
  }
`

const ModPrizesInfo = () => {
  return (
    <Wrapper flexDirection="column">
      <ModPrizesCard />
      <ModPrizesText />
    </Wrapper>
  )
}

export default ModPrizesInfo
