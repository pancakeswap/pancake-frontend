import { useTranslation } from '@pancakeswap/localization'
import { Breadcrumbs, CopyButton, Flex, ScanLink, Text } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'
import { ChainLinkSupportChains, multiChainId, multiChainScan } from 'state/info/constant'
import { useChainNameByQuery } from 'state/info/hooks'
import { getBlockExploreLink } from 'utils'
import { usePoolSymbol } from '../hooks/usePoolSymbol'
import { useRouterQuery } from '../hooks/useRouterQuery'

export const BreadcrumbNav: React.FC = () => {
  const { t } = useTranslation()
  const { pools } = useRouterQuery()
  const chainName = useChainNameByQuery()
  const { poolSymbol } = usePoolSymbol()

  return (
    <Flex justifyContent="space-between">
      <Breadcrumbs mb="32px">
        <NextLinkFromReactRouter to="/farms-v4">
          <Text color="primary">{t('Farms')}</Text>
        </NextLinkFromReactRouter>
        <Flex>
          <Text mr="8px">{poolSymbol}</Text>
        </Flex>
      </Breadcrumbs>
      <Flex justifyContent={[null, null, 'flex-end']} mt={['8px', '8px', 0]}>
        <ScanLink
          useBscCoinFallback={ChainLinkSupportChains.includes(multiChainId[chainName])}
          mr="8px"
          href={getBlockExploreLink(pools, 'address', multiChainId[chainName])}
        >
          {t('View on %site%', { site: multiChainScan[chainName] })}
        </ScanLink>
        <CopyButton ml="4px" text={pools} tooltipMessage={t('Token address copied')} />
      </Flex>
    </Flex>
  )
}
