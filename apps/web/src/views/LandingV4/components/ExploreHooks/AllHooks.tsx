import { Box, Flex } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { HookCard } from 'views/LandingV4/components/ExploreHooks/HookCard'
import { ViewMoreButton } from 'views/LandingV4/components/ViewMoreButton'

const AllHooksContainer = styled(Flex)`
  flex-wrap: wrap;
  margin-top: 24px;

  > div {
    width: 100%;
    margin-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    > div {
      width: calc(50% - 12px);
      margin-right: 24px;
    }

    > div:nth-child(2n + 0) {
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > div {
      width: calc(33.33% - 16px);
      margin-right: 24px;
    }

    > div:nth-child(2n + 0) {
      margin-right: 24px;
    }

    > div:nth-child(3n + 0) {
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    > div {
      width: calc(25% - 18px);
      margin-right: 24px;
    }

    > div:nth-child(3n + 0) {
      margin-right: 24px;
    }

    > div:nth-child(4n + 0) {
      margin-right: 0;
    }
  }
`

export const AllHooks = () => {
  return (
    <Box>
      <AllHooksContainer>
        <HookCard />
        <HookCard />
        <HookCard />
        <HookCard />
      </AllHooksContainer>
      <Box mb="40px">
        <ViewMoreButton />
      </Box>
    </Box>
  )
}
