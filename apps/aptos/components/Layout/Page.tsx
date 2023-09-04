import { Container } from '@pancakeswap/uikit'
import { NextSeo } from 'next-seo'
import { styled } from 'styled-components'

const StyledPage = styled(Container)`
  min-height: calc(100vh - 64px);
  padding-top: 16px;
  padding-bottom: 16px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    padding-bottom: 24px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`

export const PageMeta: React.FC<React.PropsWithChildren<PageProps>> = ({ title, description }) => {
  return <NextSeo title={title} description={description} />
}

interface PageProps {
  title: string
  description?: string
}

const Page: React.FC<React.PropsWithChildren<PageProps>> = ({ children, title, description, ...props }) => {
  return (
    <>
      <PageMeta title={title} description={description} />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  )
}

export default Page
