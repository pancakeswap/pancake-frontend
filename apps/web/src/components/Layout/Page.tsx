import styled from 'styled-components'
import { NextSeo } from 'next-seo'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import { DEFAULT_META, getCustomMeta } from 'config/constants/meta'
import Container from './Container'

const StyledPage = styled(Container)`
  width: 100%;
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

export const PageMeta: React.FC<React.PropsWithChildren> = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { pathname } = useRouter()

  const pageMeta = getCustomMeta(pathname, t, locale) || {}
  const { title, description, image } = { ...DEFAULT_META, ...pageMeta }

  return (
    <NextSeo
      title={title}
      description={description}
      openGraph={{
        images: [{ url: image, alt: title }],
      }}
    />
  )
}

const Page: React.FC<React.PropsWithChildren> = ({ children, ...props }) => {
  return (
    <>
      <PageMeta />
      <StyledPage {...props}>{children}</StyledPage>
    </>
  )
}

export default Page
