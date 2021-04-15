import React from 'react'
import styled from 'styled-components'
import { Flex, LinkExternal, Image, Text, PrizeIcon } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { Ifo } from 'config/constants/types'

interface Props {
  ifo: Ifo
  minLpForAchievement: number
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

const Achievement: React.FC<Props> = ({ ifo, minLpForAchievement }) => {
  const TranslateString = useI18n()
  const tokenName = ifo.token.symbol.toLowerCase()
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
              <Text color="textSubtle">20</Text>
            </Flex>
          </Flex>
          <Text color="textSubtle" fontSize="12px">
            {`Commit ~${minLpForAchievement} LP in total to earn!`}
          </Text>
        </Flex>
      </Flex>
      <StyledLinkExternal href={ifo.link}>{`Learn more about ${ifo.token.symbol}`}</StyledLinkExternal>
    </Container>
  )
}

export default Achievement
