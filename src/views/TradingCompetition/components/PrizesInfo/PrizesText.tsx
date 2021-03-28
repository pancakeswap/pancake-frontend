import React from 'react'
import styled from 'styled-components'
import { Flex, Text, Heading, Image } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import FlipperBunny from '../../pngs/flippers.png'

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

const PrizesText = () => {
  const TranslateString = useI18n()

  return (
    <StyledFlex flexDirection="column" mb="32px">
      <Text mb="24px">
        {TranslateString(999, 'Every eligible participant will win prizes at the end of the competition.')}
      </Text>
      <Heading color="secondary" mb="24px" size="lg">
        {TranslateString(999, 'The better your team performs, the better the prizes!')}
      </Heading>
      <Text>
        {TranslateString(999, 'The winning team is decided by total volume traded at the end of the competition.')}
      </Text>
      <ImageWrapper>
        <Image src={FlipperBunny} alt="Flipper bunny" responsive width={499} height={400} />
      </ImageWrapper>
    </StyledFlex>
  )
}

export default PrizesText
