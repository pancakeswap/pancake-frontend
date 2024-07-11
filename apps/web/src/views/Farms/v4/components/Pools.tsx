import styled from 'styled-components'
import { useMemo } from 'react'
import {
  Button,
  Card,
  MoreIcon,
  CardBody as RawCardBody,
  CardHeader as RawCardHeader,
  SubMenu,
  ITableViewProps,
  TableView,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { PoolsFilterPanel } from './PoolsFilterPanel'

interface IDataType {
  name: string
  feeTier: number
  apr: number
  tvl: number
  vol: number
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
// todo:@eric replace with real data
const data: ITableViewProps<IDataType>['data'] = [
  {
    name: 'Token1 / Token2',
    feeTier: 0.99,
    apr: 99.99,
    tvl: 999999,
    vol: 999999,
  },
  {
    name: 'Token3 / Token4',
    feeTier: 0.99,
    apr: 99.99,
    tvl: 999999,
    vol: 999999,
  },
]

const useColumnConfig = (): ITableViewProps<IDataType>['columns'] => {
  const { t } = useTranslation()
  return useMemo(
    () => [
      {
        title: t('All Pools'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('Fee Tier'),
        dataIndex: 'feeTier',
        key: 'feeTier',
      },
      {
        title: t('APR'),
        dataIndex: 'apr',
        key: 'apr',
      },
      {
        title: t('TVL'),
        dataIndex: 'tvl',
        key: 'tvl',
      },
      {
        title: t('Volume 24H'),
        dataIndex: 'vol',
        key: 'vol',
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

export const Pools = () => {
  const columns = useColumnConfig()
  return (
    <Card>
      <CardHeader>
        <PoolsFilterPanel />
      </CardHeader>
      <CardBody>
        <PoolsContent>
          <TableView columns={columns} data={data} />
        </PoolsContent>
      </CardBody>
    </Card>
  )
}
