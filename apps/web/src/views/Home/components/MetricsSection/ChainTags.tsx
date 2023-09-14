import {
  AptosIcon,
  Arbitrum,
  BinanceChainIcon,
  EthChainIcon,
  Text,
  ZkEVMIcon,
  ZksyncWithOutCircleIcon,
  useMatchBreakpoints,
  LineaIcon,
  BaseIcon,
} from '@pancakeswap/uikit'
import React, { cloneElement } from 'react'
import Marquee from 'react-fast-marquee'
import { styled } from 'styled-components'

const TagWrapper = styled.div`
  display: flex;
  padding: 8px 12px;
  height: 38px;
  justify-content: start;
  align-items: center;
  border-radius: 25px;
  margin-right: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 12px 24px;
    height: 46px;
    border-radius: 25px;
    margin-right: 12px;
  }
`

const StyledMarquee = styled(Marquee)`
  width: 100%;
  max-width: 1063px;
  mask-image: linear-gradient(to left, transparent, black 80px, black calc(100% - 80px), transparent);
  -webkit-mask-image: linear-gradient(to left, transparent, black 80px, black calc(100% - 80px), transparent);
  border-radius: 12px;
`

const newsItems = [
  {
    key: 'BNB Chain',
    component: <BinanceChainIcon />,
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), #F0B90B',
    iconWidth: '26px',
  },
  {
    key: 'Aptos',
    component: <AptosIcon />,
    background: '#17BA92',
    iconWidth: '22px',
  },
  {
    key: 'Ethereum',
    component: <EthChainIcon />,
    background: '#627AD8',
    iconWidth: '16px',
  },
  {
    key: 'Polygon zkEVM',
    component: <ZkEVMIcon />,
    background: '#AD73DE',
    iconWidth: '24px',
  },
  {
    key: 'zkSync Era',
    component: <ZksyncWithOutCircleIcon />,
    background: '#686EA7',
    iconWidth: '26px',
  },
  {
    key: 'Arbitrum One',
    component: <Arbitrum />,
    background: '#6E89AE',
    iconWidth: '20px',
  },
  {
    key: 'Linea',
    component: <LineaIcon />,
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), #81D8EA',
    iconWidth: '20px',
  },
  {
    key: 'Base',
    component: <BaseIcon />,
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), #75A1FF',
    iconWidth: '20px',
  },
]

export const ChainTags: React.FC = () => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledMarquee>
      {newsItems.map((d) => (
        <TagWrapper style={{ background: d.background }} key={d.key}>
          {cloneElement(d.component, { width: d.iconWidth, color: 'invertedContrast' })}
          <Text fontWeight={600} fontSize={isMobile ? '16px' : '20px'} ml="10px" color="invertedContrast">
            {d.key}
          </Text>
        </TagWrapper>
      ))}
    </StyledMarquee>
  )
}
