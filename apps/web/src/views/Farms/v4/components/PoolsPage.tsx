import { Protocol, UNIVERSAL_FARMS, UniversalFarmConfig } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { ERC20Token } from '@pancakeswap/sdk'
import {
  Button,
  Card,
  FeeTier,
  ITableViewProps,
  MoreIcon,
  CardBody as RawCardBody,
  CardHeader as RawCardHeader,
  SubMenu,
  TableView,
  Image,
} from '@pancakeswap/uikit'
import { useCallback, useEffect, useMemo, useState } from 'react'
import keyBy from 'lodash/keyBy'
import { TokenPairImage } from 'components/TokenImage'
import { TokenOverview, toTokenValue } from '@pancakeswap/widgets-internal'
import { explorerApiClient } from 'state/info/api/client'
import styled from 'styled-components'
// import { PoolType } from '@pancakeswap/smart-router'
import { Address } from 'viem/accounts'
import { useIntersectionObserver } from '@pancakeswap/hooks'

import {
  IPoolsFilterPanelProps,
  MAINNET_CHAINS,
  PoolsFilterPanel,
  useAllChainsName,
  usePoolTypes,
  useSelectedPoolTypes,
} from './PoolsFilterPanel'

interface IDataType {
  chainId: number
  lpAddress: Address
  protocol: Protocol
  feeTier: bigint
  apr24h: string
  tvlUsd: string
  vol24hUsd: string
  // todo:@eric to Currency type
  token0: ERC20Token
  token1: ERC20Token
}

const PoolsContent = styled.div`
  min-height: calc(100vh - 64px - 56px);
`

const CardHeader = styled(RawCardHeader)`
  background: ${({ theme }) => theme.card.background};
`

const CardBody = styled(RawCardBody)`
  padding-top: 0;
`

const StyledButton = styled(Button)`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 400;
  padding: 8px 16px;
  line-height: 24px;
  height: auto;
`

const StyledImage = styled(Image)`
  margin-left: auto;
  margin-right: auto;
  margin-top: 58px;
`

const PoolListItemAction = (_, _poolInfo: IDataType) => {
  const { t } = useTranslation()
  return (
    <SubMenu
      component={
        <Button scale="xs" variant="text">
          <MoreIcon />
        </Button>
      }
    >
      <StyledButton scale="sm" variant="text" as="a">
        {t('View pool details')}
      </StyledButton>
      <StyledButton scale="sm" variant="text" as="a">
        {t('Add Liquidity')}
      </StyledButton>
      <StyledButton scale="sm" variant="text" as="a">
        {t('View info page')}
      </StyledButton>
    </SubMenu>
  )
}

const useColumnConfig = (): ITableViewProps<IDataType>['columns'] => {
  const { t } = useTranslation()
  return useMemo(
    () => [
      {
        title: t('All Pools'),
        dataIndex: null,
        key: 'name',
        render: (_, item) => (
          <TokenOverview
            isReady
            token={item.token0}
            quoteToken={item.token1}
            icon={
              <TokenPairImage
                width={40}
                height={40}
                variant="inverted"
                primaryToken={item.token0}
                secondaryToken={item.token1}
              />
            }
          />
        ),
      },
      {
        title: t('Fee Tier'),
        dataIndex: 'feeTier',
        key: 'feeTier',
        // todo:@eric 补充denominator
        render: (fee, item) => <FeeTier type={item.protocol} fee={fee ?? 0} />,
      },
      {
        title: t('APR'),
        dataIndex: 'apr24h',
        key: 'apr',
        render: (value) => (value ? <>{(Number(value) * 100).toFixed(2)}%</> : '-'),
      },
      {
        title: t('TVL'),
        dataIndex: 'tvlUsd',
        key: 'tvl',
        render: (value) => (value ? <>${(Number(value) / 1000).toFixed(3)}k</> : '-'),
      },
      {
        title: t('Volume 24H'),
        dataIndex: 'vol24hUsd',
        key: 'vol',
        render: (value) => (value ? <>${(Number(value) / 1000).toFixed(3)}k</> : '-'),
      },
      {
        title: '',
        render: PoolListItemAction,
        dataIndex: null,
        key: 'action',
      },
    ],
    [t],
  )
}

/* const fetchMissingFarms = ({
  missingList,
  protocols,
  allChainsName
}: {
  missingList: UniversalFarmConfig[];
  protocols: keyof typeof PoolType | (keyof typeof PoolType)[];
  allChainsName: string[];
}) => {
  return explorerApiClient.GET('/cached/pools/list', {
    params: {
      query: {
        protocols,
        chains: allChainsName,
        orderBy: 'volumeUSD24h',
        pools: missingList.map(pool => `${pool.chainId}:${pool.lpAddress}`),
      },
    },
  })
} */

const useFetchFarmingListFromAPI = () => {
  const [farmingList, setFarmingList] = useState<UniversalFarmConfig[]>(UNIVERSAL_FARMS)
  const protocols = usePoolTypes()
    .slice(1)
    .map((type) => type.value)
  const allChainsName = useAllChainsName()

  const mergeFarmList = useCallback((res) => {
    if (!res.data) {
      return farmingList
    }
    const farmListMap = keyBy(res.data, 'id')
    const missingFarms: UniversalFarmConfig[] = []
    return farmingList.map((farm) => {
      const farmFromApi = farmListMap[farm.lpAddress.toLowerCase()]
      if (!farmFromApi) {
        missingFarms.push(farm)
        return farm
      }
      return {
        ...farm,
        ...farmFromApi,
        token0: farm.token0,
        token1: farm.token1,
        tvl: farmFromApi.tvlUSD,
        vol24h: farmFromApi.volumeUSD24h,
      }
    })
  }, [])

  useEffect(() => {
    explorerApiClient
      // todo:@eric update the api schema
      // @ts-ignore
      .GET('/cached/pools/farming', {
        params: {
          query: {
            // @ts-ignore
            protocols: protocols.join(','),
            // @ts-ignore
            chains: allChainsName.join(','),
          },
        },
      })
      .then(mergeFarmList)
      .then((data) => {
        setFarmingList(data)
        /* fetchMissingFarms({
          missingList: missingFarms,
          protocols,
          allChainsName,
        }).then(mergeFarmList) */
      })
    /*
      - The farming list contains full data of farms.
      - We just need to pull it once.
      - Therefore, no dependencies are needed.
      * */
  }, [])

  return farmingList
}

const NUMBER_OF_FARMS_VISIBLE = 20

export const PoolsPage = () => {
  const columns = useColumnConfig()
  const [filters, setFilters] = useState<IPoolsFilterPanelProps['value']>({
    selectedTypeIndex: 0,
    selectedNetwork: MAINNET_CHAINS.map((chain) => chain.id),
    selectedTokens: [],
  })
  const farmingList = useFetchFarmingListFromAPI()
  const { observerRef, isIntersecting } = useIntersectionObserver({ rootMargin: '10px' })
  const [numberVisible, setNumberVisible] = useState(NUMBER_OF_FARMS_VISIBLE)
  const selectedPoolTypes = useSelectedPoolTypes(filters.selectedTypeIndex)

  const handleFilterChange: IPoolsFilterPanelProps['onChange'] = useCallback((newFilters) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }))
  }, [])

  useEffect(() => {
    if (isIntersecting) {
      setNumberVisible((numberCurrentlyVisible) => {
        if (numberCurrentlyVisible <= farmingList.length) {
          return numberCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
        }
        return numberCurrentlyVisible
      })
    }
  }, [isIntersecting, farmingList])

  const filteredData = useMemo(() => {
    const { selectedNetwork, selectedTokens } = filters
    return farmingList.filter(
      (farm) =>
        selectedNetwork.includes(farm.chainId) &&
        (!selectedTokens?.length ||
          selectedTokens?.find(
            (token) => token === toTokenValue(farm.token0) || token === toTokenValue(farm.token1),
          )) &&
        selectedPoolTypes.includes(farm.protocol),
    )
  }, [farmingList, filters, selectedPoolTypes])

  return (
    <Card>
      <CardHeader>
        <PoolsFilterPanel onChange={handleFilterChange} value={filters} />
      </CardHeader>
      <CardBody>
        <PoolsContent>
          <TableView rowKey="lpAddress" columns={columns} data={filteredData.slice(0, numberVisible) as any} />
        </PoolsContent>
        {farmingList.length > 0 && <div ref={observerRef} />}
        <StyledImage src="/images/decorations/3dpan.png" alt="Pancake illustration" width={120} height={103} />
      </CardBody>
    </Card>
  )
}
