import { Box } from '@pancakeswap/uikit'
import { ReactNode } from 'react'
import { styled } from 'styled-components'

const PageContainer = styled(Box)`
  display: flex;
  height: calc(100vh - 56px);
  background: ${({ theme }) => theme.colors.backgroundAlt};

  ${({ theme }) => theme.mediaQueries.sm} {
    min-height: 1000px;
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

const Page = ({ children }: { children: ReactNode }) => {
  return <PageContainer>{children}</PageContainer>
}

export default Page
