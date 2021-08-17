import React from 'react'
import { CardHeader, Heading, Text, Flex, Image } from '@rug-zombie-libs/uikit'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { auctionById } from '../../../../redux/get'

const Wrapper = styled(CardHeader)<{ isFinished?: boolean; background?: string }>`
  background: ${({ isFinished, background, theme }) =>
          isFinished ? '#101820' : theme.colors.primary};
`

const StyledCardHeader: React.FC<{ id: number }> = ({ id }) => {
  const { t } = useTranslation()
  const { aid, prize, prizeSymbol, isFinished } = auctionById(id)
  const getSubHeading = () => {
    return `#${id}`
  }

  return (
    <Wrapper isFinished={isFinished} color='#101820'>
      <Flex alignItems='center' justifyContent='space-between'>
        <Flex flexDirection='column'>
          <Heading color={isFinished ? 'textDisabled' : 'body'} size='lg'>
            {`${prizeSymbol} NFT`}
          </Heading>
          <Text color={isFinished ? 'textDisabled' : 'textSubtle'}>{getSubHeading()}</Text>
        </Flex>
        {/* <Image src={stakingTokenImageUrl} alt={earningTokenSymbol} width={64} height={64} /> */}
      </Flex>
    </Wrapper>
  )
}

export default StyledCardHeader
