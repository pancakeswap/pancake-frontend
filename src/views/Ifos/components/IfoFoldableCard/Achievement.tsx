import React from 'react'
import styled from 'styled-components'
import {
  Flex,
  Image,
  Text,
  PrizeIcon,
  Skeleton,
  LanguageIcon,
  SvgProps,
  Svg,
  TwitterIcon,
  Link,
  TelegramIcon,
} from '@pancakeswap/uikit'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import { PublicIfoData } from 'views/Ifos/types'
import { Ifo } from 'config/constants/types'
import { BIG_TEN } from 'utils/bigNumber'
import { getBscScanLink } from 'utils'
import { formatBigNumber } from 'utils/formatBalance'
import { FlexGap } from 'components/Layout/Flex'

const SmartContractIcon: React.FC<SvgProps> = (props) => {
  return (
    <Svg viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.037 6a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5zM9.287 9.75a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM10.037 12a.75.75 0 000 1.5h7.5a.75.75 0 000-1.5h-7.5z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.287 4a2 2 0 012-2h13a2 2 0 012 2v15c0 1.66-1.34 3-3 3h-14c-1.66 0-3-1.34-3-3v-2c0-.55.45-1 1-1h2V4zm0 16h11v-2h-12v1c0 .55.45 1 1 1zm14 0c.55 0 1-.45 1-1V4h-13v12h10c.55 0 1 .45 1 1v2c0 .55.45 1 1 1z"
      />
    </Svg>
  )
}

const FIXED_MIN_DOLLAR_FOR_ACHIEVEMENT = BIG_TEN

interface Props {
  ifo: Ifo
  publicIfoData: PublicIfoData
}

const Container = styled(Flex)`
  justify-content: space-between;
  flex-direction: column;
  align-items: center;
  text-align: left;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: initial;
  }
`

const AchievementFlex = styled(Flex)<{ isFinished: boolean }>`
  ${({ isFinished }) => (isFinished ? 'filter: grayscale(100%)' : '')};
  text-align: left;
`

const InlinePrize = styled(Flex)`
  display: inline-flex;
  vertical-align: top;
`

const IfoAchievement: React.FC<Props> = ({ ifo, publicIfoData }) => {
  const { t } = useTranslation()
  const tokenName = ifo.token.symbol?.toLowerCase()
  const campaignTitle = ifo.name
  const minLpForAchievement = publicIfoData.thresholdPoints
    ? formatBigNumber(publicIfoData.thresholdPoints, 3)
    : FIXED_MIN_DOLLAR_FOR_ACHIEVEMENT.div(publicIfoData.currencyPriceInUSD).toNumber().toFixed(3)

  return (
    <Container p="16px" pb="32px">
      <AchievementFlex isFinished={publicIfoData.status === 'finished'} alignItems="flex-start" flex={1}>
        <Image src={`/images/achievements/ifo-${tokenName}.svg`} width={56} height={56} mr="8px" />
        <Flex flexDirection="column" ml="8px">
          <Text color="secondary" fontSize="12px">
            {`${t('Achievement')}:`}
          </Text>
          <Flex>
            <Text bold mr="8px" lineHeight={1.2}>
              {t('IFO Shopper: %title%', { title: campaignTitle })}
              <InlinePrize alignItems="center" ml="8px">
                <PrizeIcon color="textSubtle" width="16px" mr="4px" />
                <Text lineHeight={1.2} color="textSubtle">
                  {publicIfoData.numberPoints}
                </Text>
              </InlinePrize>
            </Text>
          </Flex>
          {publicIfoData.currencyPriceInUSD.gt(0) ? (
            <Text color="textSubtle" fontSize="12px">
              {t('Commit ~%amount% %symbol% in total to earn!', {
                amount: minLpForAchievement,
                symbol: ifo.currency === tokens.cake ? 'CAKE' : 'LP',
              })}
            </Text>
          ) : (
            <Skeleton minHeight={18} width={80} />
          )}
          <FlexGap gap="16px" pt="24px" pl="4px">
            <Link external href={ifo.articleUrl}>
              <LanguageIcon color="textSubtle" />
            </Link>
            <Link external href={getBscScanLink(ifo.address, 'address')}>
              <SmartContractIcon color="textSubtle" />
            </Link>
            {ifo.twitterUrl && (
              <Link external href={ifo.twitterUrl}>
                <TwitterIcon color="textSubtle" />
              </Link>
            )}
            {ifo.telegramUrl && (
              <Link external href={ifo.telegramUrl}>
                <TelegramIcon color="textSubtle" />
              </Link>
            )}
          </FlexGap>
        </Flex>
      </AchievementFlex>
      {ifo.description && (
        <Flex alignItems="flex-end" flexDirection="column" flex={1} pl="16px">
          <Text fontSize="14px" lineHeight={1.2}>
            {ifo.description}
          </Text>
        </Flex>
      )}
    </Container>
  )
}

export default IfoAchievement
