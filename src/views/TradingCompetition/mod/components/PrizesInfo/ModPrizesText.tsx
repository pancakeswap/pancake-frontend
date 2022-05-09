import { Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Image from 'next/image'
import styled from 'styled-components'
import FlipperBunny from '../../../pngs/MoD-flipper.png'

const StyledFlex = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;
  }
`

const ImageWrapper = styled.div`
  width: 270px;
  margin: 40px auto 0;
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;
  }
`

const ModPrizesText = () => {
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
      <Text mt="8px">
        {t(
          'In addition to token prizes there are NFT rewards:300 PancakeSwap newly designed NFT to the top 100 traders in each of the three teams.100 Mines of Dalarnia NFTs to the top 100 traders ranked by the $DAR trading volume.',
        )}
      </Text>
      <ImageWrapper>
        <Image src={FlipperBunny} alt="Flipper bunny" width={270} height={293} />
      </ImageWrapper>
    </StyledFlex>
  )
}

export default ModPrizesText
