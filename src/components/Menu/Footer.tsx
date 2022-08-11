import { memo } from 'react'
import styled from 'styled-components'
import { ButtonMenu, ButtonMenuItem, LinkExternal, Flex, Svg, Image, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { EXCHANGE_DOCS_URLS } from 'config/constants'

const Wrapper = memo(styled.div<{ $isSide: boolean }>`
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
`)

const BubbleWrapper = styled(Flex)`
  svg {
    fill: ${({ theme }) => theme.colors.textSubtle};
    transition: background-color 0.2s, opacity 0.2s;
  }
  &:hover {
    svg {
      opacity: 0.65;
    }
  }
  &:active {
    svg {
      opacity: 0.85;
    }
  }
`

type FooterVariant = 'default' | 'side'

const Footer: React.FC<React.PropsWithChildren<{ variant?: FooterVariant; helpUrl?: string }>> = ({
  variant = 'default',
  helpUrl = EXCHANGE_DOCS_URLS,
}) => {
  const { t } = useTranslation()
  const isSide = variant === 'side'
  return (
    <Wrapper $isSide={isSide}>
      <Flex flexDirection={isSide ? 'column' : ['column', 'column', 'row']} alignItems="center">
        <ButtonMenu variant="subtle" scale="sm" activeIndex={0}>
          <ButtonMenuItem>V2</ButtonMenuItem>
          <ButtonMenuItem as="a" href="https://v1exchange.pancakeswap.finance/#/">
            {t('V1 (old)')}
          </ButtonMenuItem>
        </ButtonMenu>
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
      <Flex
        flexGrow={isSide ? 0 : 1}
        alignItems="center"
        width={['100%', '100%', '100%', isSide ? '100%' : 'auto']}
        justifyContent={['center', 'center', 'center', 'flex-end']}
      >
        <BubbleWrapper>
          <Button id="clickExchangeHelp" as="a" external href={helpUrl} variant="subtle">
            {t('Need help ?')}
          </Button>
          <Svg viewBox="0 0 16 16">
            <path d="M0 16V0C0 0 3 1 6 1C9 1 16 -2 16 3.5C16 10.5 7.5 16 0 16Z" />
          </Svg>
        </BubbleWrapper>
        <Image src="/images/help.png" alt="Get some help" width={160} height={108} />
      </Flex>
    </Wrapper>
  )
}

export default memo(Footer)
