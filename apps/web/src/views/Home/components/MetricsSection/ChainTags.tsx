import {
  AptosIcon,
  BaseIcon,
  BinanceChainIcon,
  EthChainIcon,
  Svg,
  SvgProps,
  Text,
  ZkEVMIcon,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import React, { cloneElement } from 'react'
import Marquee from 'react-fast-marquee'
import { styled } from 'styled-components'

const ZksyncWithOutCircleIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 27 15" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15.3652 3.72137L7.96087 9.27481V15L0.5 7.44275L7.84783 0V3.72137H15.3652Z" />
      <path d="M19.0957 5.55343V0L26.5 7.5L19.0957 15V11.2214H11.6348L19.0957 5.55343Z" />
    </Svg>
  )
}

const ArbitrumIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 20 22" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.0333 1.36361C10.087 1.36361 10.1407 1.37808 10.1889 1.40521L18.45 6.09817C18.5463 6.15242 18.6055 6.25369 18.6037 6.36039L18.5722 15.6939C18.5722 15.8024 18.513 15.9018 18.4167 15.9561L10.1241 20.5966C10.0778 20.6237 10.0222 20.6364 9.96852 20.6364C9.91481 20.6364 9.86111 20.6219 9.81296 20.5948L1.55186 15.9018C1.45556 15.8476 1.3963 15.7463 1.39815 15.6396L1.42964 6.30614C1.42964 6.19763 1.4889 6.09817 1.58519 6.04391L9.87778 1.4034C9.92407 1.37627 9.97778 1.36361 10.0333 1.36361ZM10.037 3.2297e-05C9.74259 -0.00177616 9.44815 0.0723708 9.18333 0.220665L0.890748 4.85937C0.361119 5.15596 0.0351931 5.70392 0.0314893 6.30071L7.89425e-06 15.6342C-0.00184396 16.2292 0.32223 16.7807 0.848155 17.081L9.10926 21.7739C9.37222 21.924 9.66667 21.9982 9.96296 22C10.2574 22.0018 10.5519 21.9276 10.8167 21.7793L19.1093 17.1388C19.6389 16.8422 19.9648 16.2943 19.9685 15.6975L20 6.36582C20.0018 5.77083 19.6778 5.21925 19.1518 4.91905L10.8907 0.22609C10.6259 0.0759877 10.3315 3.2297e-05 10.037 3.2297e-05Z" />
      <path d="M11.711 5.08594H10.4999C10.4091 5.08594 10.3277 5.142 10.2962 5.22519L6.40359 15.6492C6.37767 15.7179 6.42952 15.7902 6.50544 15.7902H7.71655C7.80729 15.7902 7.88878 15.7342 7.92026 15.651L11.8147 5.22519C11.8369 5.15828 11.7851 5.08594 11.711 5.08594ZM9.59248 5.08594H8.38137C8.29063 5.08594 8.20915 5.142 8.17766 5.22519L4.28507 15.6492C4.25915 15.7179 4.311 15.7902 4.38693 15.7902H5.59804C5.68878 15.7902 5.77026 15.7342 5.80174 15.651L9.69618 5.22519C9.72025 5.15828 9.6684 5.08594 9.59248 5.08594ZM11.161 9.12785C11.1258 9.03562 10.9925 9.03562 10.9573 9.12785L10.3277 10.8133C10.311 10.8604 10.311 10.911 10.3277 10.958L12.0814 15.6528C12.1128 15.736 12.1943 15.792 12.2851 15.792H13.4962C13.5721 15.792 13.624 15.7197 13.598 15.651L11.161 9.12785ZM15.7147 15.6492L12.2203 6.29399C12.1851 6.20176 12.0517 6.20176 12.0166 6.29399L11.3869 7.97948C11.3703 8.0265 11.3703 8.07713 11.3869 8.12415L14.1999 15.6528C14.2314 15.736 14.3128 15.792 14.4036 15.792H15.6147C15.6869 15.7902 15.7406 15.7179 15.7147 15.6492Z" />
    </Svg>
  )
}

const LineaIcon: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M12 14H0V2H3V11H12V14Z" />
      <path d="M12.0002 4C13.1045 4 14 3.10457 14 2C14 0.895432 13.1045 0 12.0002 0C10.8955 0 10 0.895432 10 2C10 3.10457 10.8955 4 12.0002 4Z" />
    </Svg>
  )
}

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

const StyledChainIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 100%;
  }
  svg path {
    fill: ${({ theme }) => theme.colors.invertedContrast};
  }
`

const newsItems = [
  {
    key: 'BNB Chain',
    component: (
      <StyledChainIcon style={{ width: 26 }}>
        <BinanceChainIcon />
      </StyledChainIcon>
    ),
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), #F0B90B',
    iconWidth: '26px',
  },
  {
    key: 'opBNB Chain',
    component: <BinanceChainIcon color="F0B90B" />,
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), #333',
    iconWidth: '26px',
    color: '#F0B90B',
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
    component: (
      <StyledChainIcon>
        <ZkEVMIcon />
      </StyledChainIcon>
    ),
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
    component: <ArbitrumIcon />,
    background: '#6E89AE',
    iconWidth: '20px',
  },
  {
    key: 'Linea',
    component: <LineaIcon />,
    background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.10) 0%, rgba(0, 0, 0, 0.10) 100%), #81D8EA',
    iconWidth: '18px',
  },
  {
    key: 'Base',
    component: (
      <StyledChainIcon>
        <BaseIcon />
      </StyledChainIcon>
    ),
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
          <Text fontWeight={600} fontSize={isMobile ? '16px' : '20px'} ml="10px" color={d?.color ?? 'invertedContrast'}>
            {d.key}
          </Text>
        </TagWrapper>
      ))}
    </StyledMarquee>
  )
}
