import { styled } from 'styled-components'
import { Flex, Text, Heading, NftIcon, BunnyPlaceholderIcon } from '@pancakeswap/uikit'
import Image from 'next/image'
import { useTranslation } from '@pancakeswap/localization'
import MoboxFlipperBunny from '../../../pngs/mobox-flipper.png'

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

const MoboxPrizesText = () => {
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
        {t('In addition to token prizes there are NFT rewards (estimated worth of ~$40,000 at the time of writing):')}
      </Text>
      <Flex>
        <NftIcon width="32px" mr="16px" color="textSubtle" />
        <Text mt="8px">
          {t(
            '300 Mobox Avatars NFT + 300 PancakeSwap newly designed NFT to the top 100 traders in each of the three teams.',
          )}
        </Text>
      </Flex>
      <Flex>
        <BunnyPlaceholderIcon width="32px" mr="16px" />
        <Text mt="8px">{t('500 Mobox mystery boxes to the top 500 traders ranked by the MBOX trading volume.')}</Text>
      </Flex>
      <ImageWrapper>
        <Image src={MoboxFlipperBunny} alt="Flipper bunny" width={220} height={254} />
      </ImageWrapper>
    </StyledFlex>
  )
}

export default MoboxPrizesText
