/* eslint-disable react/no-array-index-key */
import { useTranslation } from '@pancakeswap/localization'
import { Balance, Box, CardBody, CardRibbon, Flex, ScanLink, Skeleton, Text } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import Divider from 'components/Divider'
import { useCakePrice } from 'hooks/useCakePrice'
import { useMemo } from 'react'
import { PotteryRoundInfo } from 'state/types'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import { getDrawnDate } from 'views/Lottery/helpers'
import Winner from './Winner'

const StyledCardBody = styled(CardBody)`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const StyledCardRibbon = styled(CardRibbon)`
  right: -20px;
  top: -20px;

  ${({ theme }) => theme.mediaQueries.xs} {
    right: -10px;
    top: -10px;
  }
`

const WinnersContainer = styled(Flex)`
  width: 100%;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 20px 0 0 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 316px;
    flex-direction: row;
    margin: 0 0 0 32px;
  }
`

interface PreviousRoundCardBodyProps {
  latestRoundId: number | null
  finishedRoundInfo: PotteryRoundInfo
}

const PreviousRoundCardBody: React.FC<React.PropsWithChildren<PreviousRoundCardBodyProps>> = ({
  latestRoundId,
  finishedRoundInfo,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { isFetched, roundId, prizePot, totalPlayers, txid, winners, lockDate } = finishedRoundInfo
  const cakePrice = useCakePrice()

  const prizeAsBn = new BigNumber(prizePot)
  const prize = getBalanceNumber(prizeAsBn)
  const prizeInBusd = new BigNumber(prize).times(cakePrice).toNumber()

  const isLatest = useMemo(
    () => latestRoundId && new BigNumber(latestRoundId).minus(1).eq(roundId),
    [latestRoundId, roundId],
  )

  if (!isFetched) {
    return <Skeleton margin="24px" maxWidth="100%" height="96px" />
  }

  return (
    <StyledCardBody>
      {isLatest && <StyledCardRibbon text={t('Latest')} />}
      <Flex flexDirection={['column']} width="100%">
        <Flex flexDirection={['column', 'column', 'row']}>
          <Text style={{ alignSelf: 'center' }} fontSize="20px" bold>
            {t('Winner')}
          </Text>
          <WinnersContainer>
            {winners && winners.map((address, index) => <Winner key={`${address}-${index}`} address={address} />)}
          </WinnersContainer>
        </Flex>
        <Box width="100%">
          <Divider />
        </Box>
      </Flex>
      <Flex flexDirection="column" width="100%" mt="8px">
        <Text fontSize="20px" textAlign={['center', 'center', 'left']} lineHeight="110%" bold>
          {t('Prize Pot')}
        </Text>
        <Balance
          prefix="~$"
          bold
          color="secondary"
          lineHeight="110%"
          fontSize={['32px', '32px', '40px']}
          textAlign={['center', 'center', 'left']}
          decimals={0}
          value={prizeInBusd}
        />
        <Balance
          unit=" CAKE"
          mb="18px"
          fontSize="14px"
          color="textSubtle"
          textAlign={['center', 'center', 'left']}
          decimals={0}
          value={prize}
        />
        <Flex flexDirection={['column', 'column', 'row']} justifyContent="space-between">
          <Flex flexDirection="column">
            <Flex alignSelf={['center', 'center', 'flex-start']}>
              <Text fontSize="14px">{t('Total players this round:')}</Text>
              <Balance bold ml="4px" fontSize="14px" decimals={0} value={Number(totalPlayers)} />
            </Flex>
            <Flex flexDirection={['column', 'column', 'row']} alignSelf={['center', 'center', 'flex-start']}>
              <Text fontSize="14px">{t('Pottery deposited on:')}</Text>
              <Text bold ml="4px" fontSize="14px">
                {getDrawnDate(locale, lockDate)}
              </Text>
            </Flex>
          </Flex>
          <ScanLink
            m={['10px auto auto auto', '10px auto auto auto', 'auto 0 0 auto']}
            href={getBlockExploreLink(txid, 'transaction')}
          >
            {t('View on BscScan')}
          </ScanLink>
        </Flex>
      </Flex>
    </StyledCardBody>
  )
}

export default PreviousRoundCardBody
