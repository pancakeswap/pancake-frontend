import { IconButton, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'

import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/chains'
import { useCallback, useEffect, useState } from 'react'

import { styled, keyframes } from 'styled-components'

export const v3PromotionFarms = {
  [ChainId.BSC]: {
    3: true, // BUSD-WBNB LP pid
    10: true, // ETH-BNB LP pid
    11: true, // BTCB-BNB LP pid
    13: true, // USDT-BNB LP pid
  },
}

const shineAnimation = keyframes`
	0% {transform:translateX(-100%); opacity: 1;}
  20% {transform:translateX(100%); opacity: 1;}
	100% {transform:translateX(100%); opacity: 0;}
`

const ColoredIconButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.textSubtle};
  overflow: hidden;
  &.is-shining {
    &::after {
      content: '';
      top: 0;
      transform: translateX(100%);
      width: 100%;
      height: 100%;
      position: absolute;
      z-index: 1;
      animation: ${shineAnimation} 5s infinite 1s;
      pointer-events: none;
      background: -webkit-linear-gradient(
        left,
        ${({ theme }) =>
          theme.isDark
            ? `rgba(39,38,44, 0) 0%,
        rgba(39,38,44, 0) 100%`
            : `rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.8) 50%,
        rgba(128, 186, 232, 0) 99%,
        rgba(125, 185, 232, 0) 100%`}
      );
    }
  }
`

export const V3SwapPromotionIcon: React.FC<{ wrapperStyle?: React.CSSProperties }> = ({ wrapperStyle }) => {
  const { t } = useTranslation()
  const [mobileCampaignTooltipShow, setMobileCampaignTooltipShow] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setMobileCampaignTooltipShow(true)
    }, 100)
  }, [])

  const mobileTooltipClickOutside = useCallback(() => {
    setMobileCampaignTooltipShow(false)
  }, [])

  useEffect(() => {
    document.body.addEventListener('click', mobileTooltipClickOutside)
    return () => {
      document.body.removeEventListener('click', mobileTooltipClickOutside)
    }
  }, [mobileTooltipClickOutside])

  const {
    tooltip: campaignTooltip,
    tooltipVisible: campaignTooltipVisible,
    targetRef: campaignTargetRef,
  } = useTooltip(<Text>{t('Claim $135K CAKE Airdrop & Exclusive NFT')}</Text>, {
    placement: 'top',
    trigger: 'hover',
    avoidToStopPropagation: true,
    manualVisible: mobileCampaignTooltipShow,
  })
  return (
    <Text style={wrapperStyle} display="inline-block">
      <ColoredIconButton className="is-shining" variant="text" scale="sm">
        <TooltipText
          ref={campaignTargetRef}
          display="flex"
          style={{ justifyContent: 'center', textDecoration: 'none' }}
        >
          <Text
            fontSize="20px"
            onClick={() => {
              window.open(
                'https://blog.pancakeswap.finance/articles/participate-in-pancake-swap-v3-launch-claim-135-k-cake-airdrop-and-receive-an-exclusive-nft-for-early-supporters',
                '_blank',
                'noreferrer noopener',
              )
            }}
          >
            🎁
          </Text>
        </TooltipText>
      </ColoredIconButton>
      {campaignTooltipVisible && campaignTooltip}
    </Text>
  )
}
