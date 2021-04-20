import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, LinkExternal, Image, Text, PrizeIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { PublicIfoData } from 'hooks/ifo/types'
import { Ifo } from 'config/constants/types'

const MIN_DOLLAR_FOR_ACHIEVEMENT = new BigNumber(10)

interface Props {
  ifo: Ifo
  publicIfoData: PublicIfoData
}

const Container = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: initial;
  }
`

const StyledLinkExternal = styled(LinkExternal)`
  margin-top: 32px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
  }
`

const Achievement: React.FC<Props> = ({ ifo, publicIfoData }) => {
  const TranslateString = useI18n()
  const tokenName = ifo.token.symbol.toLowerCase()
  const minLpForAchievement = MIN_DOLLAR_FOR_ACHIEVEMENT.div(publicIfoData.currencyPriceInUSD).toNumber()
  return (
    <Container>
      <Flex alignItems="center" flexGrow={1}>
        <Image src={`/images/achievements/ifo-${tokenName}.svg`} width={56} height={56} mr="8px" />
        <Flex flexDirection="column">
          <Text color="secondary" fontSize="12px">
            {TranslateString(999, 'Achievement:')}
          </Text>
          <Flex>
            <Text bold mr="8px">{`${TranslateString(999, 'IFO Shopper:')} ${tokenName}`}</Text>
            <Flex>
              <PrizeIcon color="textSubtle" width="16px" mr="4px" />
              <Text color="textSubtle">{publicIfoData.numberPoints}</Text>
            </Flex>
          </Flex>
          <Text color="textSubtle" fontSize="12px">
            {`Commit ~${minLpForAchievement} LP in total to earn!`}
          </Text>
        </Flex>
      </Flex>
      <StyledLinkExternal href={ifo.articleUrl}>{`Learn more about ${ifo.token.symbol}`}</StyledLinkExternal>
    </Container>
  )
}

export default Achievement
