import { useState } from 'react'
import { styled } from 'styled-components'
import BigNumber from 'bignumber.js'
import {
  Text,
  Flex,
  Box,
  BunnyPlaceholderIcon,
  Skeleton,
  Button,
  useModal,
  SubMenu,
  SubMenuItem,
  EllipsisIcon,
  LinkExternal,
  useMatchBreakpoints,
  ScanLink,
} from '@pancakeswap/uikit'
import { getBlockExploreLink } from 'utils'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { useCakePrice } from 'hooks/useCakePrice'
import { Bidder } from 'config/constants/types'
import WhitelistedBiddersModal from '../WhitelistedBiddersModal'
import { HARD_CODED_START_AUCTION_ID } from '../../constants'
import { useV3FarmAuctionConfig } from '../../hooks/useV3FarmAuctionConfig'

const LeaderboardContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 5fr 3fr 1fr;
  ${({ theme }) => theme.mediaQueries.md} {
    grid-template-columns: 3fr 15fr 5fr 1fr;
  }
`

const GridCell = styled(Flex)<{ isTopPosition: boolean }>`
  height: 65px;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};

  ${({ theme, isTopPosition }) => isTopPosition && `background-color: ${theme.colors.warning2D};`}
`

interface LeaderboardRowProps {
  bidder: Bidder
  cakePriceBusd: BigNumber
  isMobile: boolean
  index: number
  auctionId: number
}

const LeaderboardRow: React.FC<React.PropsWithChildren<LeaderboardRowProps>> = ({
  bidder,
  cakePriceBusd,
  isMobile,
  index,
  auctionId,
}) => {
  const { t } = useTranslation()
  const shouldUseV3Format = auctionId >= HARD_CODED_START_AUCTION_ID
  const v3FarmAuctionConfig = useV3FarmAuctionConfig(auctionId)
  const { isTopPosition, position, samePositionAsAbove, farmName, tokenName, amount, projectSite, lpAddress, account } =
    bidder
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
            <Text bold={isTopPosition} mr="4px">
              {farmName}
            </Text>

            {!isMobile && (
              <>
                {shouldUseV3Format ? (
                  <>
                    <Text mr="3px">({v3FarmAuctionConfig?.[index]?.[0]}% fee tier)</Text>
                    <Text>
                      [{v3FarmAuctionConfig?.[index]?.[1] ?? 1}x{' '}
                      {v3FarmAuctionConfig?.[index]?.[2] &&
                        getBalanceNumber(amount) >= v3FarmAuctionConfig?.[index]?.[2] && (
                          <Text display="inline-block">+ AMA</Text>
                        )}
                      ]
                    </Text>
                  </>
                ) : (
                  <Text>(1x)</Text>
                )}
              </>
            )}
          </Flex>
          <Text fontSize="12px" color="textSubtle">
            {tokenName}
          </Text>
        </Flex>
      </GridCell>
      <GridCell isTopPosition={isTopPosition}>
        <Flex flexDirection="column" width="100%" justifyContent="flex-end" pr={[null, null, '24px']}>
          <Text bold textTransform="uppercase" width="100%" textAlign="right">
            {getBalanceNumber(amount)}
          </Text>
          {cakePriceBusd.gt(0) ? (
            <Text fontSize="12px" color="textSubtle" textAlign="right">
              ~${getBalanceNumber(amount.times(cakePriceBusd)).toLocaleString('en', { maximumFractionDigits: 0 })}
            </Text>
          ) : (
            <Flex justifyContent="flex-end">
              <Skeleton width="48px" />
            </Flex>
          )}
        </Flex>
      </GridCell>
      <GridCell isTopPosition={isTopPosition}>
        <SubMenu component={<EllipsisIcon height="16px" width="16px" />}>
          {projectSite && (
            <SubMenuItem as={LinkExternal} href={projectSite} bold={false} color="text">
              {t('Project Site')}
            </SubMenuItem>
          )}
          {lpAddress && (
            <SubMenuItem
              as={LinkExternal}
              href={`/info${shouldUseV3Format && '/v3'}/pairs/${lpAddress}`}
              bold={false}
              color="text"
            >
              {t('LP Info')}
            </SubMenuItem>
          )}
          {account && (
            <SubMenuItem
              as={ScanLink}
              useBscCoinFallback
              href={getBlockExploreLink(account, 'address')}
              bold={false}
              color="text"
            >
              {t('Bidder Address')}
            </SubMenuItem>
          )}
        </SubMenu>
      </GridCell>
    </>
  )
}

const AuctionLeaderboardTable: React.FC<
  React.PropsWithChildren<{ bidders: Bidder[]; noBidsText: string; auctionId: number }>
> = ({ bidders, noBidsText, auctionId }) => {
  const [visibleBidders, setVisibleBidders] = useState(10)
  const cakePriceBusd = useCakePrice()
  const { t } = useTranslation()

  const { isMobile } = useMatchBreakpoints()
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
        {bidders.slice(0, visibleBidders).map((bidder, index) => (
          <LeaderboardRow
            key={bidder.account}
            bidder={bidder}
            cakePriceBusd={cakePriceBusd}
            isMobile={isMobile}
            index={index}
            auctionId={auctionId}
          />
        ))}
      </LeaderboardContainer>
      <Flex mt="16px" px="24px" flexDirection="column" justifyContent="center" alignItems="center">
        {visibleBidders <= 10 && totalBidders > 10 && (
          <Text color="textSubtle" textAlign="center">
            {t('Showing top 10 bids only.')}{' '}
            <Button px="0" variant="text" onClick={onShowWhitelistedBidders}>
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
