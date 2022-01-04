import React from 'react'
import styled from 'styled-components'
import { LinkExternal, Flex } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const Wrapper = styled.div<{ $isSide: boolean }>`
  width: 100%;
  height: ${({ $isSide }) => ($isSide ? '100%' : 'auto')};
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 16px;
  padding-right: ${({ $isSide }) => ($isSide ? '32px' : '0px')};
  ${({ theme }) => theme.mediaQueries.md} {
    justify-content: space-between;
    flex-direction: ${({ $isSide }) => ($isSide ? 'column' : 'row')};
  }
`



type FooterVariant = 'default' | 'side'

const Footer: React.FC<{ variant?: FooterVariant }> = ({ variant = 'default' }) => {
  const { t } = useTranslation()
  const isSide = variant === 'side'
  return (
    <Wrapper $isSide={isSide}>
      <Flex flexDirection={isSide ? 'column' : ['column', 'column', 'row']} alignItems="center">

        <LinkExternal
          id="ercBridge"
          href="https://docs.binance.org/smart-chain/guides/cross-chain.html"
          ml={[0, 0, '40px']}
          mt={['20px', '20px', isSide ? '20px' : 0]}
          mb={['8px', '8px', 0]}
        >
          {t('Convert ERC-20 to BEP-20')}
        </LinkExternal>
      </Flex>
      {isSide && <Flex flexGrow={1} />}
    </Wrapper>
  )
}

export default Footer
