import { useTranslation } from '@pancakeswap/localization'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { memo, useMemo, useState } from 'react'
import { useAllTokenDataSWR } from 'state/info/hooks'
import styled from 'styled-components'
import TokenTable from './SwapTokenTable'

export const Wrapper = styled.div`
  ${({ theme }) => theme.mediaQueries.lg} {
    width: 725px;
    padding: 24px;
    box-sizing: border-box;
    background: rgba(255, 255, 255, 0.5);
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    border-radius: 32px;
  }
`

const HotTokenList: React.FC = () => {
  const allTokens = useAllTokenDataSWR()
  const [index, setIndex] = useState(0)

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token)
  }, [allTokens])
  const { t } = useTranslation()
  return (
    <Wrapper>
      <ButtonMenu activeIndex={index} onItemClick={setIndex} fullWidth scale="sm" variant="subtle" mb="24px">
        <ButtonMenuItem>{t('Price Change')}</ButtonMenuItem>
        <ButtonMenuItem>{t('Volume (24H)')}</ButtonMenuItem>
      </ButtonMenu>
      {index === 0 ? (
        <TokenTable tokenDatas={formattedTokens} defaultSortField="priceUSDChange" maxItems={6} />
      ) : (
        <TokenTable tokenDatas={formattedTokens} defaultSortField="volumeUSD" maxItems={8} />
      )}
    </Wrapper>
  )
}

export default memo(HotTokenList)
