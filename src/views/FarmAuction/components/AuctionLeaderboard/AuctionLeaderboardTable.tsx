import React, { useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import {
  Text,
  Flex,
  Box,
  OpenNewIcon,
  BunnyPlaceholderIcon,
  Skeleton,
  Button,
  useMatchBreakpoints,
  useModal,
} from '@pancakeswap/uikit'
import { getBscScanLink } from 'utils'
import { getBalanceNumber } from 'utils/formatBalance'
import EllipsisMenu, { OptionProps } from 'components/EllipsisMenu/EllipsisMenu'
import { useTranslation } from 'contexts/Localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { Bidder } from 'config/constants/types'
import WhitelistedBiddersModal from '../WhitelistedBiddersModal'

const LeaderboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 3fr 1fr;
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 3fr 5fr 5fr 1fr;
  }
`

const GridCell = styled(Flex)<{ isTopPosition }>`
  height: 65px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};

  ${({ theme, isTopPosition }) => isTopPosition && `background-color: ${theme.colors.warning}2D;`}
`

const BidderEllipsisMenu: React.FC<{ bidder: Bidder }> = ({ bidder }) => {
  const { t } = useTranslation()
  const handleSortOptionChange = (option: OptionProps) => {
    window.open(option.value, '_blank').focus()
  }

  const { projectSite, lpAddress, account } = bidder

  const options = []
  if (projectSite) {
    options.push({
      label: t('Project Site'),
      value: projectSite,
      icon: <OpenNewIcon />,
    })
  }
  if (lpAddress) {
    options.push({
      label: t('LP Info'),
      value: `http://pancakeswap.info/pool/${lpAddress}`,
      icon: <OpenNewIcon />,
    })
  }
  options.push({
    label: t('Bidder Address'),
    value: getBscScanLink(account, 'address'),
    icon: <OpenNewIcon />,
  })
  return <EllipsisMenu options={options} onChange={handleSortOptionChange} />
}

interface LeaderboardRowProps {
  bidder: Bidder
  cakePriceBusd: BigNumber
  isMobile: boolean
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ bidder, cakePriceBusd, isMobile }) => {
  const { isTopPosition, position, samePositionAsAbove, farmName, tokenName, amount } = bidder
  return (
    <>
      <GridCell isTopPosition={isTopPosition} pl={['12px', '24px']}>
        <Flex>
          <Text bold={isTopPosition} color={samePositionAsAbove ? 'textDisabled' : 'text'} textTransform="uppercase">
            #{position}
          </Text>
        </Flex>
      </GridCell>
      <GridCell isTopPosition={isTopPosition}>
        <Flex flexDirection="column" pl={['8px']}>
          <Flex>
            <Text bold={isTopPosition} textTransform="uppercase" mr="4px">
              {farmName}
            </Text>
            {!isMobile && <Text>(1x)</Text>}
          </Flex>
          <Text fontSize="12px" color="textSubtle">
            {tokenName}
          </Text>
        </Flex>
      </GridCell>
      <GridCell isTopPosition={isTopPosition}>
        <Flex flexDirection="column" width="100%" justifyContent="flex-end" pr={[null, null, '24px']}>
          <Text bold textTransform="uppercase" width="100%" textAlign="right">
            {getBalanceNumber(amount).toLocaleString()}
          </Text>
          {cakePriceBusd.gt(0) ? (
            <Text fontSize="12px" color="textSubtle" textAlign="right">
              ~${getBalanceNumber(amount.times(cakePriceBusd)).toLocaleString()}
            </Text>
          ) : (
            <Flex justifyContent="flex-end">
              <Skeleton width="48px" />
            </Flex>
          )}
        </Flex>
      </GridCell>
      <GridCell isTopPosition={isTopPosition}>
        <BidderEllipsisMenu bidder={bidder} />
      </GridCell>
    </>
  )
}

const AuctionLeaderboardTable: React.FC<{ bidders: Bidder[]; noBidsText: string }> = ({ bidders, noBidsText }) => {
  const [visibleBidders, setVisibleBidders] = useState(10)
  const cakePriceBusd = usePriceCakeBusd()
  const { t } = useTranslation()

  const { isXs, isSm } = useMatchBreakpoints()
  const [onShowWhitelistedBidders] = useModal(<WhitelistedBiddersModal />)

  const totalBidders = bidders.length

  if (totalBidders === 0) {
    return (
      <Flex justifyContent="center" alignItems="center" flexDirection="column" py="24px">
        <Text mb="8px">{noBidsText}</Text>
        <BunnyPlaceholderIcon height="64px" width="64px" />
      </Flex>
    )
  }

  return (
    <Box>
      <LeaderboardContainer>
        <Text color="secondary" bold fontSize="12px" textTransform="uppercase" pl={['12px', '24px']} py="16px">
          {t('Position')}
        </Text>
        <Text color="secondary" bold fontSize="12px" textTransform="uppercase" pl={['8px']} py="16px">
          {t('Farm')}
        </Text>
        <Text
          color="secondary"
          bold
          fontSize="12px"
          textTransform="uppercase"
          textAlign="right"
          pr={[null, null, '24px']}
          py="16px"
        >
          {t('CAKE bid')}
        </Text>
        <Box />
        {/* Rows */}
        {bidders.slice(0, visibleBidders).map((bidder) => (
          <LeaderboardRow key={bidder.account} bidder={bidder} cakePriceBusd={cakePriceBusd} isMobile={isXs || isSm} />
        ))}
      </LeaderboardContainer>
      <Flex mt="16px" flexDirection="column" justifyContent="center" alignItems="center">
        {visibleBidders <= 10 && totalBidders > 10 && (
          <Text color="textSubtle">
            {t('Showing top 10 bids only.')}{' '}
            <Button pl="0" variant="text" onClick={onShowWhitelistedBidders}>
              {t('See all whitelisted bidders')}
            </Button>
          </Text>
        )}
        {visibleBidders < totalBidders && (
          <Button
            mt="16px"
            variant="text"
            onClick={() =>
              setVisibleBidders((prev) => {
                if (totalBidders - prev > 10) {
                  return prev + 10
                }
                return totalBidders
              })
            }
          >
            {t('Show More')}
          </Button>
        )}
      </Flex>
    </Box>
  )
}

export default AuctionLeaderboardTable
