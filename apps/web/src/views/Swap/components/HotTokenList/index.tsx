import {
  MotionBox,
  LazyMotion,
  AnimatePresence,
  domAnimation,
  ButtonMenu,
  ButtonMenuItem,
  Box,
} from '@pancakeswap/uikit'
import { MotionVariants } from '@pancakeswap/uikit/src/components/Box/Box'
import { useTranslation } from '@pancakeswap/localization'
import { useAllTokenDataSWR } from 'state/info/hooks'
import { useMemo, memo, useState } from 'react'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
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

const variants: MotionVariants = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.05,
    },
  },
}

const item: MotionVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

const HotTokenList: React.FC = () => {
  const allTokens = useAllTokenDataSWR()
  const [index, setIndex] = useState(0)
  // const topPriceIncrease = useMemo(() => {
  //   return Object.values(allTokens)
  //     .sort(({ data: a }, { data: b }) => {
  //       return a && b ? (Math.abs(a?.priceUSDChange) > Math.abs(b?.priceUSDChange) ? -1 : 1) : -1
  //     })
  //     .slice(0, Math.min(20, Object.values(allTokens).length))
  //     .filter((d) => d?.data?.exists)
  //     .map((token) => token.data)
  // }, [allTokens])

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
      {/* <LazyMotion features={domAnimation}>
        <AnimatePresence>
          {allTokens && (
            <MotionBox variants={variants} initial="hidden" animate="visible">
              {topPriceIncrease.map((d) => (
                <MotionBox key={`hotTokensItems${d.data.address}`} variants={item}>
                  <CurrencyLogo address={d?.data.address} />
                  {d?.data.symbol}
                </MotionBox>
              ))}
            </MotionBox>
          )}
        </AnimatePresence>
      </LazyMotion> */}
      {index === 0 ? (
        <TokenTable tokenDatas={formattedTokens} defaultSortField="priceUSDChange" maxItems={6} />
      ) : (
        <TokenTable tokenDatas={formattedTokens} defaultSortField="volumeUSD" maxItems={8} />
      )}
    </Wrapper>
  )
}

export default memo(HotTokenList)
