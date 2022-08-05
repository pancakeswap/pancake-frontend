import styled from 'styled-components'
import Image from 'next/image'
import { Flex, Text, Heading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import EasterFlipperBunny from '../../../pngs/easter-flippers.png'

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

const EasterPrizesText = () => {
  const { t } = useTranslation()

  return (
    <StyledFlex flexDirection="column" mb="32px">
      <Text mb="24px">{t('Every eligible participant will win prizes at the end of the competition.')}</Text>
      <Heading color="secondary" mb="24px" scale="lg">
        {t('The better your team performs, the better prizes you will get!')}
      </Heading>
      <Text>
        {t(
          'The final winning team will be the team with the highest total combined volume of their top 500 members at the end of the competition period.',
        )}
      </Text>
      <ImageWrapper>
        <Image src={EasterFlipperBunny} alt="Flipper bunny" width={499} height={400} />
      </ImageWrapper>
    </StyledFlex>
  )
}

export default EasterPrizesText
