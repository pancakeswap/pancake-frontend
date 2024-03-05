import { useTranslation } from '@pancakeswap/localization'
import { Flex, Heading, PageHeader, useMatchBreakpoints } from '@pancakeswap/uikit'
import { memo } from 'react'
import { BCakeBoosterCard } from 'views/Farms/components/YieldBooster/components/bCakeV3/BCakeBoosterCard'

export const Header = memo(function Header() {
  const { t } = useTranslation()
  const { isDesktop } = useMatchBreakpoints()

  return (
    <PageHeader>
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
        {isDesktop && <BCakeBoosterCard variants="pm" />}
      </Flex>
    </PageHeader>
  )
})
