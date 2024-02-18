import { styled } from 'styled-components'
import Container from './Container'

const StyledPage = styled(Container)`
  width: 100%;
  padding-top: 12px;
  padding-bottom: 16px;
  position: relative;
  z-index: 10;
  background: ${({ theme }) => (theme.isDark ? 'rgb(53,54,88)' : 'rgb(233,247,255)')};

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-bottom: 32px;
  }
`

const Page: React.FC<React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>> = ({ children, ...props }) => {
  return <StyledPage {...props}>{children}</StyledPage>
}

export default Page
