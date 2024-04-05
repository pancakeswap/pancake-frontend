import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { Box, Flex, Heading, PageHeader, useMatchBreakpoints } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { memo } from 'react'
import { BCakeBoosterCard } from 'views/Farms/components/YieldBooster/components/bCakeV3/BCakeBoosterCard'
import { BCakeMigrationBanner } from 'views/Home/components/Banners/BCakeMigrationBanner'

export const Header = memo(function Header() {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()
  const { chainId } = useActiveWeb3React()

  return (
    <PageHeader>
      <Box mb="32px" mt="16px">
        <BCakeMigrationBanner />
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

        {isDesktop && ChainId.BSC === chainId && <BCakeBoosterCard variants="pm" />}
      </Flex>
    </PageHeader>
  )
})
