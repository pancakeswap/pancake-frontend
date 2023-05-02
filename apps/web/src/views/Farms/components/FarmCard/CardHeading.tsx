import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { AutoRow, Farm as FarmUI, Flex, Heading, Skeleton, Tag, Link, Text, useTooltip } from '@pancakeswap/uikit'
import { FeeAmount } from '@pancakeswap/v3-sdk'
import { TokenPairImage } from 'components/TokenImage'
import styled from 'styled-components'

import BoostedTag from '../YieldBooster/components/BoostedTag'

const { FarmAuctionTag, StableFarmTag, V2Tag, V3FeeTag } = FarmUI.Tags

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
}

const Wrapper = styled(Flex)`
  svg {
    margin-right: 4px;
  }
`

const MultiplierTag = styled(Tag)`
  margin-left: 4px;
`

const InlineText = styled(Text)`
  display: inline;
`

const InlineLink = styled(Link)`
  display: inline-block;
  margin: 0 4px;
`

const CardHeading: React.FC<React.PropsWithChildren<ExpandableSectionProps>> = ({
  lpLabel,
  multiplier,
  isCommunityFarm,
  token,
  quoteToken,
  boosted,
  isStable,
  version,
  feeAmount,
  farmCakePerSecond,
  totalMultipliers,
}) => {
  const { t } = useTranslation()
  const isReady = multiplier !== undefined

  const multiplierTooltipContent = (
    <>
      <Text bold>
        {t('Farm’s CAKE Per Second:')}
        <InlineText marginLeft={2}>{farmCakePerSecond}</InlineText>
      </Text>
      <Text bold>
        {t('Total Multipliers:')}
        <InlineText marginLeft={2}>{totalMultipliers}</InlineText>
      </Text>
      <Text my="24px">
        {t(
          'The Farm Multiplier represents the proportion of CAKE rewards each farm receives as a proportion of its farm group.',
        )}
      </Text>
      <Text my="24px">
        {t('For example, if a 1x farm received 1 CAKE per block, a 40x farm would receive 40 CAKE per block.')}
      </Text>
      <Text>
        {t('Different farm groups have different sets of multipliers.')}
        <InlineLink
          mt="8px"
          display="inline"
          href="https://docs.pancakeswap.finance/products/yield-farming/faq#why-a-2x-farm-in-v3-has-less-apr-than-a-1x-farm-in-v2"
          external
        >
          {t('Learn More')}
        </InlineLink>
      </Text>
    </>
  )

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
        {isReady ? <Heading mb="4px">{lpLabel.split(' ')[0]}</Heading> : <Skeleton mb="4px" width={60} height={18} />}
        <AutoRow gap="4px" justifyContent="flex-end">
          {isReady && isStable ? <StableFarmTag /> : version === 2 ? <V2Tag /> : null}
          {isReady && version === 3 && <V3FeeTag feeAmount={feeAmount} />}
          {isReady && boosted && <BoostedTag />}
          {isReady && isCommunityFarm && <FarmAuctionTag />}
          {isReady ? (
            <Flex ref={targetRef}>
              <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
              {tooltipVisible && tooltip}
            </Flex>
          ) : (
            <Skeleton ml="4px" width={42} height={28} />
          )}
        </AutoRow>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
