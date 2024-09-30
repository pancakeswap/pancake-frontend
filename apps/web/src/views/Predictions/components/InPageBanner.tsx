import { ChainId } from '@pancakeswap/chains'
import { SUPPORTED_CHAIN_IDS } from '@pancakeswap/prediction'
import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { AIPrediction } from 'components/PhishingWarningBanner/AIPredictionStripe'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import styled from 'styled-components'

const Container = styled(Flex).withConfig({ shouldForwardProp: (prop) => !['$background'].includes(prop) })<{
  $background?: string
}>`
  overflow: hidden;
  padding: 12px;
  align-items: center;
  justify-content: center;
  background: #280d5f;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px;
    background: #7a6eaa;
    ${({ $background }) => $background && `background: ${$background};`}
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    position: absolute;
    top: 42px;
    left: 0;
    right: 0;
  }
`

const InnerContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  align-items: center;
`

const SpeechBubble = styled(Flex)`
  position: relative;
  border-radius: 16px;
  width: 100%;
  height: 80%;
  align-items: center;
  justify-content: space-between;

  & ${Text} {
    flex-shrink: 0;
    margin-right: 4px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 800px;
    padding: 8px;
    margin-left: 8px;
    background: #280d5f;

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: -7px;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-right: 8px solid #280d5f;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 900px;
  }
`

export const InPageBanner = () => {
  const { chainId } = useActiveChainId()
  const { isDesktop, isLg } = useMatchBreakpoints()

  const showBanner = useMemo(() => chainId !== ChainId.ARBITRUM_ONE && SUPPORTED_CHAIN_IDS.includes(chainId), [chainId])

  if (!showBanner) return <></>

  const showInBigDevice = isDesktop || isLg

  return (
    <Container className="warning-banner" $background={AIPrediction.background}>
      <Flex justifyContent="center" alignItems="center">
        {showInBigDevice && (
          <img width={AIPrediction.stripeImageWidth} alt={AIPrediction.stripeImageAlt} src={AIPrediction.stripeImage} />
        )}
        <SpeechBubble>
          <InnerContainer>
            <AIPrediction
              ctaLink="/prediction?token=ETH&chain=arb&utm_source=PredictionPage&utm_medium=website&utm_campaign=Arbitrum&utm_id=PredictionLaunch"
              learnMoreLink="https://blog.pancakeswap.finance/articles/pancake-swap-introduces-ai-powered-prediction-market-on-arbitrum-up-to-100-fund-protection-and-launching-60-000-arb-campaign?utm_source=PredictionPage&utm_medium=website&utm_campaign=Arbitrum&utm_id=PredictionLaunch"
            />
          </InnerContainer>
        </SpeechBubble>
      </Flex>
    </Container>
  )
}
