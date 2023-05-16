import styled from 'styled-components'
import { Box } from '@pancakeswap/uikit'

const PageContainer = styled(Box)`
  display: flex;
  height: 100%;
  height: calc(100vh - 56px);
  background: ${({ theme }) => theme.colors.backgroundAlt};

  ${({ theme }) => theme.mediaQueries.sm} {
    min-height: 1000px;
    background: ${({ theme }) => theme.colors.gradientBubblegum};
  }
`

const Page = ({ children }) => {
  return <PageContainer>{children}</PageContainer>
}

export default Page
