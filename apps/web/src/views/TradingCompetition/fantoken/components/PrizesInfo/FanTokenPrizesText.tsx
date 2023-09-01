import { styled } from 'styled-components'
import { Flex, Text, Heading } from '@pancakeswap/uikit'
import Image from 'next/image'
import { useTranslation } from '@pancakeswap/localization'
import FanTokenFlipperBunny from '../../../pngs/fan-token-flippers.png'

const StyledFlex = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;
  }
`

const ImageWrapper = styled.div`
  width: 200px;
  margin: 40px auto 0;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

const FanTokenPrizesText = () => {
  const { t } = useTranslation()

  return (
    <StyledFlex flexDirection="column" mb="32px">
      <Text mb="24px">{t('Every eligible participant will win prizes at the end of the competition.')}</Text>
      <Heading color="secondary" mb="24px" scale="lg">
        {t('The better your team performs, the better prizes you will get!')}
      </Heading>
      <Text>
        {t(
          'The final winning team will be the team with the highest total volume score at the end of the competition period.',
        )}
      </Text>
      <ImageWrapper>
        <Image src={FanTokenFlipperBunny} alt="Flipper bunny" width={499} height={400} />
      </ImageWrapper>
    </StyledFlex>
  )
}

export default FanTokenPrizesText
