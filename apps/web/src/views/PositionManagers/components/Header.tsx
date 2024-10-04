import { bCakeSupportedChainId } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { Box, Flex, Heading, Message, MessageText, PageHeader, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { memo } from 'react'
import { BCakeBoosterCard } from 'views/Farms/components/YieldBooster/components/bCakeV3/BCakeBoosterCard'
import { BCakeMigrationBanner } from 'views/Home/components/Banners/BCakeMigrationBanner'

const DIFI_EDGE_CHAINS = [ChainId.BSC, ChainId.ARBITRUM_ONE, ChainId.ZKSYNC, ChainId.BASE]

export const Header = memo(function Header() {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { chainId } = useActiveWeb3React()

  return (
    <PageHeader>
      <Box mb="32px" mt="16px">
        {DIFI_EDGE_CHAINS.includes(chainId) ? <DefiEdgeWarning /> : <BCakeMigrationBanner />}
      </Box>
      <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
        <Flex
          flex="1"
          flexDirection="column"
          mr={['8px', 0]}
          alignSelf={['flex-start', 'flex-start', 'flex-start', 'center']}
        >
          <Heading as="h1" scale="xxl" color="secondary" mb="24px">
            {t('Position Manager')}
          </Heading>
          <Heading scale="md" color="text">
            {t('Automate your PancakeSwap V3 liquidity')}
          </Heading>
        </Flex>

        {isDesktop && bCakeSupportedChainId.includes(chainId) && <BCakeBoosterCard variants="pm" />}
      </Flex>
    </PageHeader>
  )
})

export const DefiEdgeWarning = () => {
  const { t } = useTranslation()
  return (
    <Box maxWidth="1200px" m="0 auto">
      <Message variant="warning">
        <MessageText fontSize="17px">
          <Text color="warning" as="span" bold>
            {t(
              'DeFiEdge will stop maintaining its vaults from 10 Oct 2024 onwards. Please remove your funds before that to avoid any issues. Beyond 10 Oct, they will place the liquidity in a wide range, and will no longer actively manage it.',
            )}
          </Text>
        </MessageText>
      </Message>
    </Box>
  )
}
