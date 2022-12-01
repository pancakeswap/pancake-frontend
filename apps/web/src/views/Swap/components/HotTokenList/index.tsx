import { useTranslation } from '@pancakeswap/localization'
import { ButtonMenu, ButtonMenuItem, useMatchBreakpoints } from '@pancakeswap/uikit'
import { memo, useMemo, useState } from 'react'
import { useAllTokenDataSWR } from 'state/info/hooks'
import styled from 'styled-components'
import TokenTable from './SwapTokenTable'

const Wrapper = styled.div`
  padding-top: 10px;
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 725px;
    padding: 24px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    border-radius: 32px;
  }
`
const MenuWrapper = styled.div`
  padding: 0px 24px 12px;
  ${({ theme }) => theme.mediaQueries.lg} {
    margin-bottom: 24px;
  }
`

const HotTokenList: React.FC = () => {
  const allTokens = useAllTokenDataSWR()
  const [index, setIndex] = useState(0)
  const { isMobile } = useMatchBreakpoints()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token)
  }, [allTokens])
  const { t } = useTranslation()
  return (
    <Wrapper>
      <MenuWrapper>
        <ButtonMenu activeIndex={index} onItemClick={setIndex} fullWidth scale="sm" variant="subtle">
          <ButtonMenuItem>{t('Price Change')}</ButtonMenuItem>
          <ButtonMenuItem>{t('Volume (24H)')}</ButtonMenuItem>
        </ButtonMenu>
      </MenuWrapper>
      {index === 0 ? (
        <TokenTable tokenDatas={formattedTokens} defaultSortField="priceUSDChange" maxItems={isMobile ? 100 : 6} />
      ) : (
        <TokenTable tokenDatas={formattedTokens} defaultSortField="volumeUSD" maxItems={isMobile ? 100 : 6} />
      )}
    </Wrapper>
  )
}

export default memo(HotTokenList)
