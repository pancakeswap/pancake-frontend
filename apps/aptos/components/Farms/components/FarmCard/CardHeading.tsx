import { Token } from '@pancakeswap/aptos-swap-sdk'
import { Box, Flex, Heading, Skeleton } from '@pancakeswap/uikit'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import { PoolEarnAptTooltips } from 'components/Farms/components/FarmTable/PoolEarnAptTooltips'
import { TokenPairImage } from 'components/TokenImage'
import { styled } from 'styled-components'

const { FarmAuctionTag, CoreTag } = FarmWidget.Tags

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
  farmCakePerSecond?: string
  totalMultipliers?: string
  showPoolEarnAptTooltips?: boolean
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const CardHeading: React.FC<React.PropsWithChildren<ExpandableSectionProps>> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  token,
  quoteToken,
  showPoolEarnAptTooltips,
}) => {
  const isReady = multiplier !== undefined

  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {isReady ? (
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={64} height={64} />
      ) : (
        <Skeleton mr="8px" width={63} height={63} variant="circle" />
      )}
      <Flex flexDirection="column" alignItems="flex-end">
        {isReady ? (
          <Flex mb="4px">
            <Heading>{lpLabel?.split(' ')[0]}</Heading>
            {showPoolEarnAptTooltips && (
              <PoolEarnAptTooltips lpLabel={lpLabel ?? ''} token={token} quoteToken={quoteToken} />
            )}
          </Flex>
        ) : (
          <Skeleton mb="4px" width={60} height={18} />
        )}
        <Flex justifyContent="center">
          {isReady ? <Box>{isCommunityFarm ? <FarmAuctionTag /> : <CoreTag />}</Box> : null}
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
