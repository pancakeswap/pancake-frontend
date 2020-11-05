import React from 'react'
import styled from 'styled-components'
import TranslatedText from 'components/TranslatedText'

const StyledFooter = styled.div`
  align-items: center;
  display: flex;
  height: 72px;
  justify-content: center;
`

const Link = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  display: inline-block;
  margin-left: ${({ theme }) => theme.spacing[2]}px;
  margin-right: ${({ theme }) => theme.spacing[2]}px;
`

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <Link target="_blank" href="https://t.me/PancakeSwap">
        <TranslatedText translationId={308}>Telegram</TranslatedText>
      </Link>
      <Link target="_blank" href="https://medium.com/@pancakeswap">
        <TranslatedText translationId={310}>Blog</TranslatedText>
      </Link>
      <Link target="_blank" href="https://github.com/pancakeswap">
        <TranslatedText translationId={312}>Github</TranslatedText>
      </Link>
      <Link target="_blank" href="https://twitter.com/pancakeswap">
        <TranslatedText translationId={314}>Twitter</TranslatedText>
      </Link>
      <Link href="https://docs.pancakeswap.finance" target="_blank">
        <TranslatedText translationId={286}>Docs</TranslatedText>
      </Link>
    </StyledFooter>
  )
}

export default Footer
