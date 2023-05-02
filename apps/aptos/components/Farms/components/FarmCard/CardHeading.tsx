import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Tag, Flex, Heading, Box, Skeleton, Farm as FarmUI, Link, Text, useTooltip } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/aptos-swap-sdk'
import { TokenPairImage } from 'components/TokenImage'

const { FarmAuctionTag, CoreTag } = FarmUI.Tags

export interface ExpandableSectionProps {
  lpLabel?: string
  multiplier?: string
  isCommunityFarm?: boolean
  token: Token
  quoteToken: Token
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
      <Flex flexDirection="column" alignItems="flex-end">
        {isReady ? <Heading mb="4px">{lpLabel?.split(' ')[0]}</Heading> : <Skeleton mb="4px" width={60} height={18} />}
        <Flex justifyContent="center">
          {isReady ? <Box>{isCommunityFarm ? <FarmAuctionTag /> : <CoreTag />}</Box> : null}
          {isReady ? (
            <Flex ref={targetRef}>
              <MultiplierTag variant="secondary">{multiplier}</MultiplierTag>
              {tooltipVisible && tooltip}
            </Flex>
          ) : (
            <Skeleton ml="4px" width={42} height={28} />
          )}
        </Flex>
      </Flex>
    </Wrapper>
  )
}

export default CardHeading
