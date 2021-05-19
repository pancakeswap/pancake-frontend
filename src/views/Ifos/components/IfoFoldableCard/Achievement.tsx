import React from 'react'
import styled from 'styled-components'
import { Flex, LinkExternal, Image, Text, PrizeIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { PublicIfoData } from 'hooks/ifo/types'
import { Ifo } from 'config/constants/types'
import { BIG_TEN } from 'utils/bigNumber'

const MIN_DOLLAR_FOR_ACHIEVEMENT = BIG_TEN

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
  const { t } = useTranslation()
  const tokenName = ifo.token.symbol.toLowerCase()
  const campaignTitle = ifo.name
  const minLpForAchievement = MIN_DOLLAR_FOR_ACHIEVEMENT.div(publicIfoData.currencyPriceInUSD).toNumber()

  return (
    <Container>
      <Flex alignItems="center" flexGrow={1}>
        <Image src={`/images/achievements/ifo-${tokenName}.svg`} width={56} height={56} mr="8px" />
        <Flex flexDirection="column">
          <Text color="secondary" fontSize="12px">
            {`${t('Achievement')}:`}
          </Text>
          <Flex>
            <Text bold mr="8px">
              {t('IFO Shopper: %title%', { title: campaignTitle })}
            </Text>
            <Flex alignItems="center" mr="8px">
              <PrizeIcon color="textSubtle" width="16px" mr="4px" />
              <Text color="textSubtle">{publicIfoData.numberPoints}</Text>
            </Flex>
          </Flex>
          <Text color="textSubtle" fontSize="12px">
            {t('Commit ~%amount% LP in total to earn!', { amount: minLpForAchievement.toFixed(3) })}
          </Text>
        </Flex>
      </Flex>
      <StyledLinkExternal href={ifo.articleUrl}>
        {t('Learn more about %title%', { title: campaignTitle })}
      </StyledLinkExternal>
    </Container>
  )
}

export default Achievement
