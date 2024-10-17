import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import {
  AutoRow,
  Box,
  FarmMultiplierInfo,
  Flex,
  Heading,
  Link,
  Skeleton,
  Tag,
  Text,
  useTooltip,
} from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { FarmWidget } from '@pancakeswap/widgets-internal'
import { GiftTooltip } from 'components/GiftTooltip/GiftTooltip'
import { SwellTooltip } from 'components/SwellTooltip/SwellTooltip'
import { TokenPairImage } from 'components/TokenImage'
import { useHasSwellReward } from 'hooks/useHasSwellReward'
import { styled } from 'styled-components'
import { isAddressEqual } from 'utils'
import { Address } from 'viem'
import { bsc } from 'viem/chains'
import { useHasCustomFarmLpTooltips } from 'views/Farms/hooks/useHasCustomFarmLpTooltips'
import { useChainId } from 'wagmi'
import BoostedTag from '../YieldBooster/components/BoostedTag'

const { FarmAuctionTag, StableFarmTag, V2Tag, V3FeeTag } = FarmWidget.Tags
const { MerklNotice } = FarmWidget

type ExpandableSectionProps = {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
  boosted?: boolean
  isStable?: boolean
  version: 3 | 2
  feeAmount?: FeeAmount
  pid?: number
  farmCakePerSecond?: string
  totalMultipliers?: string
  merklLink?: string
  merklUserLink?: string
  hasBothFarmAndMerkl?: boolean
  isBoosted?: boolean
  lpAddress?: Address
  merklApr?: number
  isBooster?: boolean
  bCakeWrapperAddress?: Address
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
  isStable,
  version,
  feeAmount,
  farmCakePerSecond,
  totalMultipliers,
  merklLink,
  merklUserLink,
  hasBothFarmAndMerkl,
  merklApr,
  lpAddress,
  isBooster,
  bCakeWrapperAddress,
}) => {
  const { t } = useTranslation()
  const chainId = useChainId()
  const isReady = multiplier !== undefined || bCakeWrapperAddress
  const hasSwellReward = useHasSwellReward(lpAddress)
  const customTooltips = useHasCustomFarmLpTooltips(lpAddress)

  const multiplierTooltipContent = FarmMultiplierInfo({
    farmCakePerSecond: farmCakePerSecond ?? '-',
    totalMultipliers: totalMultipliers ?? '-',
  })

  const { targetRef, tooltip, tooltipVisible } = useTooltip(multiplierTooltipContent, {
    placement: 'bottom',
  })

  return (
    <Wrapper justifyContent="space-between" alignItems="center" mb="12px">
      {isReady ? (
        <TokenPairImage variant="inverted" primaryToken={token} secondaryToken={quoteToken} width={64} height={64} />
      ) : (
        <Skeleton mr="8px" width={63} height={63} variant="circle" />
      )}
      <Flex flexDirection="column" alignItems="flex-end" width="100%">
        {isReady ? (
          <Heading mb="4px" display="inline-flex">
            {lpLabel?.split(' ')?.[0] ?? ''}
            {merklLink ? (
              <Box mr="-4px" ml="4px">
                <MerklNotice.WithTooltip
                  placement="top"
                  tooltipOffset={[0, 10]}
                  merklLink={merklLink}
                  hasFarm={hasBothFarmAndMerkl}
                  merklApr={merklApr}
                  merklUserLink={merklUserLink}
                />
              </Box>
            ) : null}

            {chainId === bsc.id &&
            lpAddress &&
            isAddressEqual(lpAddress, '0xdD82975ab85E745c84e497FD75ba409Ec02d4739') ? (
              <GiftTooltip>
                <Box>
                  <Text lineHeight="110%" as="span">
                    {t('Stake CAKE, Earn PEPE in our')}
                    <Link ml="4px" lineHeight="110%" display="inline !important" href="/pools?chain=bsc" external>
                      PEPE Syrup Pool
                    </Link>
                  </Text>
                  <br />
                  <br />
                  <Text lineHeight="110%" as="span">
                    {t(
                      "If more PEPE-BNB LP is deposited in our Farm, we'll increase rewards for the PEPE Syrup Pool next month",
                    )}
                  </Text>
                </Box>
              </GiftTooltip>
            ) : null}
          </Heading>
        ) : (
          <Skeleton mb="4px" width={60} height={18} />
        )}
        <AutoRow gap="4px" justifyContent="flex-end">
          {hasSwellReward && <SwellTooltip />}
          {customTooltips && customTooltips.tooltips}
          {isReady && isStable ? <StableFarmTag /> : version === 2 ? <V2Tag /> : null}
          {isReady && version === 3 && <V3FeeTag feeAmount={feeAmount} />}
          {isReady && isCommunityFarm && <FarmAuctionTag mr="-4px" />}
          {isReady ? (
            version !== 2 ? (
              <Flex ref={targetRef}>
                <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
                {tooltipVisible && tooltip}
              </Flex>
            ) : null
          ) : (
            <Skeleton ml="4px" width={42} height={28} />
          )}
          {isReady && isBooster && <BoostedTag mr="-4px" />}
        </AutoRow>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
