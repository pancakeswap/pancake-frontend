import { styled } from 'styled-components'
import { useCallback } from 'react'
import { Box, Flex, Text, Button } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const JupiterPredictorsContainer = styled(Box)`
  position: relative;
  width: 406px;
  background-color: #7645d9;
  padding: 16px;
  border-radius: 16px;
`

const OutlineText = styled(Text)`
  padding: 0 2px;
  color: #26ffcb;
  background: #6532cd;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 4px transparent;
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 4px 12px rgba(14, 14, 44, 0.1);
`

const StyledLearnMoreButton = styled(Button)`
  width: fit-content;
  color: #533295;
  background: linear-gradient(180deg, #ffd800 0%, #fdab32 100%);
  align-self: center;
  margin-left: 12px;
`

const YellowText = styled(Text)`
  position: relative;
  font-style: normal;
  font-weight: 800;
  font-size: 28px;
  line-height: 98%;
  letter-spacing: 0.01em;
  font-feature-settings: 'liga' off;
  background: linear-gradient(166deg, #ffb237 -5.1%, #ffeb37 66.78%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: center;
  &::after {
    letter-spacing: 0.01em;
    background: linear-gradient(166deg, #ffb237 -5.1%, #ffeb37 66.78%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    content: attr(data-text);
    text-shadow: 1.27551px 1.27551px 1.02041px rgba(0, 0, 0, 0.2);
    -webkit-text-stroke: 4px #6532cd;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
  }
`

export const JupiterPredictors = () => {
  const { t } = useTranslation()

  const onClickButton = useCallback(() => {
    window.open(
      'https://blog.pancakeswap.finance/articles/pancake-swap-s-de-fi-galaxy-tour-planet-5-jupiter-predictors-predicting-crypto-movements',
      '_blank',
      'noopener noreferrer',
    )
  }, [])

  return (
    <JupiterPredictorsContainer>
      <Flex>
        <YellowText data-text={t('Jupiter Predictors')}>{t('Jupiter Predictors')}</YellowText>
        <StyledLearnMoreButton scale="sm" onClick={onClickButton}>
          {t('Learn More')}
        </StyledLearnMoreButton>
      </Flex>
      <OutlineText fontSize={['17px']} mt="6px">
        {t('Predict, Win, and Share $10,000 rewards!')}
      </OutlineText>
    </JupiterPredictorsContainer>
  )
}
