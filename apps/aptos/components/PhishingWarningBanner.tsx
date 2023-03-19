import { useMemo } from 'react'
import styled from 'styled-components'
import { Text, Flex, Box, CloseIcon, IconButton } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePhishingBanner } from '@pancakeswap/utils/user'
import { DOMAIN } from 'config'
import { AtomBox } from '@pancakeswap/ui'

const Container = styled(Flex)`
  overflow: hidden;
  height: 100%;
  padding: 12px;
  align-items: center;
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

const SpeechBubble = styled.div`
  background: rgba(39, 38, 44, 0.4);
  border-radius: 16px;
  padding: 8px;
  width: 60%;
  height: 80%;
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  & ${Text} {
    flex-shrink: 0;
    margin-right: 4px;
  }
`

const PhishingWarningBanner: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const [, hideBanner] = usePhishingBanner()
  const warningTextAsParts = useMemo(() => {
    const warningText = t("please make sure you're visiting %domain% - check the URL carefully.", { domain: DOMAIN })
    return warningText.split(/(https:\/\/aptos.pancakeswap.finance)/g)
  }, [t])
  const warningTextComponent = (
    <>
      <Text as="span" color="warning" small bold textTransform="uppercase">
        {t('Phishing warning: ')}
      </Text>
      {warningTextAsParts.map((text, i) => (
        <Text
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          small
          as="span"
          bold={text === DOMAIN}
          color={text === DOMAIN ? '#FFFFFF' : '#BDC2C4'}
        >
          {text}
        </Text>
      ))}
    </>
  )

  return (
    <Container className="warning-banner">
      <style jsx global>{`
        .warning-banner {
          background: linear-gradient(180deg, #1eb8cb 0%, #00bfa5 100%);
        }
        [data-theme='dark'] .warning-banner {
          background: linear-gradient(180deg, #12838e 0%, #005a5a 100%);
        }
      `}</style>
      <AtomBox display={{ xs: 'flex', lg: 'none' }} alignItems="center" justifyContent="center" width="100%">
        <Box>{warningTextComponent}</Box>
        <IconButton onClick={hideBanner} variant="text">
          <CloseIcon color="#FFFFFF" />
        </IconButton>
      </AtomBox>
      <AtomBox display={{ xs: 'none', lg: 'flex' }} alignItems="center" justifyContent="center" width="100%">
        <InnerContainer>
          <img src="/images/decorations/phishing-warning-bunny.png" alt="phishing-warning" width="78px" />
          <SpeechBubble>{warningTextComponent}</SpeechBubble>
        </InnerContainer>
        <IconButton onClick={hideBanner} variant="text">
          <CloseIcon color="#FFFFFF" />
        </IconButton>
      </AtomBox>
    </Container>
  )
}

export default PhishingWarningBanner
