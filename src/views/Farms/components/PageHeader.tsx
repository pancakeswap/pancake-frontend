import React from 'react'
import styled from 'styled-components'
import { Heading } from '@ricefarm/uikitv2'
import { useTranslation } from 'contexts/Localization'

const Header = styled.div<{ bgImage?: string }>`
  background-color: ${({ theme }) => (theme.isDark ? '#396a63' : '#c6f1ca')};
  background-image: url('/images/${(props) => (props.bgImage ? props.bgImage : 'default-header-bg.svg')}');
  background-repeat: no-repeat;
  background-position: 100% 100%;
  background-size: contain;
  background-clip: border-box;
  background-origin: border-box;

  padding: 24px 32px 120px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 24px 32px 220px;
    background-position: 200% 100%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 24px 32px 220px;
    background-position: 200% 100%;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 16px 60% 16px 32px;
    background-position: 200% 100%;
  }
  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 16px 32px;
    background-position: 100% 100%;
  }
`

export interface PageHeaderProps {
  title?: string
  subtitle?: string
  text?: string
  bgImage?: string
}

const PageHeader: React.FC<PageHeaderProps> = (headerProps) => {
  const { t } = useTranslation()
  const { title, subtitle, text, bgImage } = headerProps

  return (
    <Header bgImage={bgImage}>
      {title && (
        <Heading as="h1" scale="xxl" textAlign="left" color="secondary" mb="24px">
          {t(title)}
        </Heading>
      )}
      {subtitle && (
        <Heading scale="lg" textAlign="left" color="text">
          {t(subtitle)}
        </Heading>
      )}
      {text && (
        <Heading scale="lg" textAlign="left" color="text">
          {t(text)}
        </Heading>
      )}
    </Header>
  )
}

export default PageHeader
