import { Token } from '@pancakeswap/sdk'
import { Box, Farm as FarmUI, Flex, Heading, Skeleton, Tag } from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { v3PromotionFarms, V3SwapPromotionIcon } from 'components/V3SwapPromotionIcon'
import { useActiveChainId } from 'hooks/useActiveChainId'
import styled from 'styled-components'
import BoostedTag from '../YieldBooster/components/BoostedTag'

const { FarmAuctionTag, CoreTag, StableFarmTag } = FarmUI.Tags

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
  boosted?: boolean
  isStable?: boolean
  pid?: number
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const CardHeading: React.FC<React.PropsWithChildren<ExpandableSectionProps>> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  token,
  quoteToken,
  boosted,
  isStable,
  pid,
}) => {
  const isReady = multiplier !== undefined
  const { chainId } = useActiveChainId()

  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {isReady ? (
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={64} height={64} />
      ) : (
        <Skeleton mr="8px" width={63} height={63} variant="circle" />
      )}
      <Flex flexDirection="column" alignItems="flex-end">
        {isReady ? (
          <Heading mb="4px">
            {v3PromotionFarms?.[chainId]?.[pid] && <V3SwapPromotionIcon />} {lpLabel.split(' ')[0]}
          </Heading>
        ) : (
          <Skeleton mb="4px" width={60} height={18} />
        )}
        <Flex justifyContent="center">
          {isReady && isStable && <StableFarmTag mr="4px" />}
          {isReady && boosted && <BoostedTag mr="4px" />}
          {isReady ? <Box>{isCommunityFarm ? <FarmAuctionTag /> : <CoreTag />}</Box> : null}
          {isReady ? (
            <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
          ) : (
            <Skeleton ml="4px" width={42} height={28} />
          )}
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
