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
import { bscTokens } from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import { PublicIfoData } from 'views/Ifos/types'
import { Ifo } from 'config/constants/types'
import { BIG_TEN } from 'utils/bigNumber'
import { getBscScanLink } from 'utils'
import { formatBigNumber } from 'utils/formatBalance'
import { FlexGap } from 'components/Layout/Flex'

const SmartContractIcon: React.FC<SvgProps> = (props) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 -15 122.000000 122.000000" {...props}>
      <g transform="translate(0.000000,122.000000) scale(0.100000,-0.100000)" stroke="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M465 1200 c-102 -27 -142 -46 -221 -105 -153 -115 -244 -293 -244
-480 0 -136 62 -311 119 -334 30 -13 96 -6 119 12 9 7 12 57 12 188 0 211 -1
209 95 209 95 0 95 1 95 -201 0 -180 2 -186 48 -153 22 15 22 19 22 234 0 257
-3 250 95 250 97 0 95 4 95 -226 0 -107 4 -194 9 -194 4 0 20 9 35 21 l26 20
0 244 c0 281 -6 265 98 265 43 0 63 -5 73 -17 10 -12 15 -65 19 -205 l5 -189
67 56 c86 71 148 148 148 185 0 82 -113 249 -218 322 -152 106 -334 142 -497
98z"
        />
      </g>
    </Svg>
  )
}

const ProposalIcon: React.FC<SvgProps> = (props) => {
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
  gap: 16px;

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
  const projectUrl = ifo.token.projectLink
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
                symbol: ifo.currency === bscTokens.cake ? 'CAKE' : 'LP',
              })}
            </Text>
          ) : (
            <Skeleton minHeight={18} width={80} />
          )}
          <FlexGap gap="16px" pt="24px" pl="4px">
            <Link external href={projectUrl}>
              <LanguageIcon color="textSubtle" />
            </Link>
            <Link external href={ifo.articleUrl}>
              <ProposalIcon color="textSubtle" />
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
        <Flex alignItems="flex-end" flexDirection="column" flex={1}>
          <Text fontSize="14px" lineHeight={1.2} style={{ whiteSpace: 'pre-line' }}>
            {ifo.description}
          </Text>
        </Flex>
      )}
    </Container>
  )
}

export default IfoAchievement
