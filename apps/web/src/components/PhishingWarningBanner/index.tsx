import { useTranslation } from '@pancakeswap/localization'
import { ArrowForwardIcon, Box, CloseIcon, Flex, IconButton, Link, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { usePhishingBanner } from '@pancakeswap/utils/user'
import { useMemo, useState } from 'react'
import { styled } from 'styled-components'

const Container = styled(Flex)`
  overflow: hidden;
  height: 100%;
  padding: 12px;
  align-items: center;
  background: ${({ theme }) => theme.colors.textSubtle};

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0px;
  }
`

const InnerContainer = styled(Flex)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const SpeechBubble = styled(Flex)`
  justify-content: space-between;
  position: relative;
  background: ${({ theme }) => theme.colors.text};
  border-radius: 16px;
  padding: 8px;
  width: 65%;
  height: 80%;
  align-items: center;

  & ${Text} {
    flex-shrink: 0;
    margin-right: 4px;
  }

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: -8px;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: ${({ theme }) => `8px solid ${theme.colors.text}`};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    margin-left: 8px;
    width: 900px;
  }
`

const CountdownContainer = styled.div<{ $percentage: number }>`
  position: relative;
  margin-left: auto;
  height: 20px;
  width: 20px;

  >svg: first-child {
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 20px;
    transform: rotateY(-180deg) rotateZ(-90deg);
    stroke-width: 2px;
    > circle {
      fill: none;
      stroke-width: 2px;
      stroke-linecap: round;
      stroke-dasharray: 120px;
    }
    > circle:first-child {
      stroke-dashoffset: 0px;
      stroke: ${({ theme }) => theme.colors.cardBorder};
    }
    > circle:nth-child(2) {
      stroke: ${({ theme }) => theme.colors.primaryBright};
      stroke-dashoffset: ${({ $percentage }) => `${105 * $percentage}px`};
    }
  }

  > svg:nth-child(2) {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.75);
  }
`

const domain = 'https://pancakeswap.finance'

const PhishingWarningBanner: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const [, hideBanner] = usePhishingBanner()
  const { isMobile, isMd } = useMatchBreakpoints()
  const [step, setStep] = useState(1)

  const warningTextAsParts = useMemo(() => {
    const warningText = t("please make sure you're visiting %domain% - check the URL carefully.", { domain })
    return warningText.split(/(https:\/\/pancakeswap.finance)/g)
  }, [t])

  const warningTextComponent = (
    <Box>
      <Text as="span" color="warning" small bold textTransform="uppercase">
        {t('Phishing warning: ')}
      </Text>
      {warningTextAsParts.map((text, i) => (
        <Text
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          small
          as="span"
          bold={text === domain}
          color={text === domain ? '#FFFFFF' : '#BDC2C4'}
        >
          {text}
        </Text>
      ))}
    </Box>
  )

  const step1Component = (
    <Box mr={['6px']}>
      <Text bold small as="span" color="#FFFFFF">
        {t('In the event of any')}
      </Text>
      <Text bold small as="span" color="#FCC631">
        {t('token distribution:')}
      </Text>
      <Text bold small as="span" color="#FFFFFF">
        {t('We will distribute')}
      </Text>
      <Text bold small as="span" color="#FCC631">
        100%
      </Text>
      <Text bold small as="span" color="#FFFFFF">
        {t('of the proceeds to the CAKE community.')}
      </Text>
      <Text bold small as="span" color="#FCC631">
        {t('CAKE community.')}
      </Text>
      <Link display="inline !important" small external href="https://docs.pancakeswap.finance/token-distribution">
        {t('Learn More')}
      </Link>
    </Box>
  )

  return (
    <Container className="warning-banner">
      {isMobile || isMd ? (
        <>
          <Box>{warningTextComponent}</Box>
          <IconButton onClick={hideBanner} variant="text">
            <CloseIcon color="#FFFFFF" />
          </IconButton>
        </>
      ) : (
        <>
          <InnerContainer>
            <img src="/images/decorations/phishing-warning-bunny-2.png" alt="phishing-warning" width="92px" />
            <SpeechBubble>
              {/* {warningTextComponent} */}
              {step1Component}
              <CountdownContainer $percentage={50}>
                <svg>
                  <circle r="9" cx="10" cy="10" />
                  <circle r="9" cx="10" cy="10" />
                </svg>
                <ArrowForwardIcon color="primary" />
              </CountdownContainer>
            </SpeechBubble>
          </InnerContainer>
          <IconButton onClick={hideBanner} variant="text">
            <CloseIcon color="#FFFFFF" />
          </IconButton>
        </>
      )}
    </Container>
  )
}

export default PhishingWarningBanner
