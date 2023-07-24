import useTheme from 'hooks/useTheme'
import styled from 'styled-components'
import { Text } from '@pancakeswap/uikit'
import { cloneElement } from 'react'
import Image, { StaticImageData } from 'next/image'

export const CakeSectionWrapper = styled.div`
  display: flex;
  padding: 8px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 25.548px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  box-sizing: border-box;
  height: 40px;
  margin-bottom: 21px;
  margin-right: 16px;
`

export const CakePartnerWrapper = styled.div`
  margin-bottom: 8px;
  margin-right: 17px;
`

export const CakeSectionTag: React.FC<{ icon: React.ReactElement; text: string }> = ({ icon, text }) => {
  const { theme } = useTheme()
  return (
    <CakeSectionWrapper>
      {cloneElement(icon, { color: theme.isDark ? '#A881FC' : theme.colors.secondary })}
      <Text fontWeight="600"> {text}</Text>
    </CakeSectionWrapper>
  )
}

export const CakePartnerTag: React.FC<{
  src: string | StaticImageData
  width: number
  height: number
  alt: string
}> = ({ src, width, height, alt }) => {
  return (
    <CakePartnerWrapper>
      <Image alt={alt} src={src} width={width} height={height} />
    </CakePartnerWrapper>
  )
}
