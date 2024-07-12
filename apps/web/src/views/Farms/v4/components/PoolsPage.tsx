import styled from 'styled-components'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  Button,
  Card,
  MoreIcon,
  CardBody as RawCardBody,
  CardHeader as RawCardHeader,
  SubMenu,
  ITableViewProps,
  TableView,
  FeeTier,
} from '@pancakeswap/uikit'
import { TokenPairImage } from 'components/TokenImage'
import { useTranslation } from '@pancakeswap/localization'
import { ERC20Token } from '@pancakeswap/sdk'
import { TokenOverview } from '@pancakeswap/widgets-internal'
import { useFarmsV3WithPositionsAndBooster } from 'state/farmsV3/hooks'
import { PoolsFilterPanel } from './PoolsFilterPanel'

interface IDataType {
  name: string
  feeAmount: number
  cakeApr: number
  activeTvlUSD: number
  vol: number
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
        dataIndex: 'name',
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
        dataIndex: 'feeAmount',
        key: 'feeTier',
        render: (fee) => <FeeTier type="v2" fee={fee} />,
      },
      {
        title: t('APR'),
        dataIndex: 'cakeApr',
        key: 'apr',
      },
      {
        title: t('TVL'),
        dataIndex: 'activeTvlUSD',
        key: 'tvl',
        render: (value) => (value ? <>${(Number(value) / 1000).toFixed(3)}k</> : '-'),
      },
      {
        title: t('Volume 24H'),
        dataIndex: 'activeTvlUSD',
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

export const PoolsPage = () => {
  const columns = useColumnConfig()
  const { query: urlQuery } = useRouter()
  const mockApr = Boolean(urlQuery.mockApr)
  // todo:@eric mock data
  const { farmsWithPositions: farmsV3 } = useFarmsV3WithPositionsAndBooster({ mockApr })

  return (
    <Card>
      <CardHeader>
        <PoolsFilterPanel />
      </CardHeader>
      <CardBody>
        <PoolsContent>
          <TableView columns={columns} data={farmsV3 as any} />
        </PoolsContent>
      </CardBody>
    </Card>
  )
}
