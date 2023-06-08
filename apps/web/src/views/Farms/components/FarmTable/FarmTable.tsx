import { DesktopColumnSchema, RowType, V3DesktopColumnSchema } from '@pancakeswap/uikit'
import { formatBigInt, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import latinise from '@pancakeswap/utils/latinise'

import { useFarmV3Multiplier } from 'views/Farms/hooks/v3/useFarmV3Multiplier'
import { useFarmV2Multiplier } from 'views/Farms/hooks/useFarmV2Multiplier'
import BigNumber from 'bignumber.js'
import { useRouter } from 'next/router'
import { ReactNode, useCallback, useMemo, useRef } from 'react'
import styled from 'styled-components'
import { V2Farm, V2StakeValueAndV3Farm } from 'views/Farms/FarmsV3'
import { getDisplayApr } from '../getDisplayApr'

import ProxyFarmContainer from '../YieldBooster/components/ProxyFarmContainer'
import Row, { RowProps } from './Row'

export interface ITableProps {
  header?: ReactNode
  farms: V2StakeValueAndV3Farm[]
  userDataReady: boolean
  cakePrice: BigNumber
  sortColumn?: string
}

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  border-radius: 32px;
  margin: 16px 0px;
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  border-collapse: collapse;
  font-size: 14px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 16px;
      vertical-align: middle;
    }

    :last-child {
      td[colspan='7'] {
        > div {
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
        }
      }
    }
  }
`
const TableContainer = styled.div`
  position: relative;
`

const getV2FarmEarnings = (farm: V2Farm) => {
  const existingEarnings = new BigNumber(farm.userData.earnings)
  let earnings: BigNumber = existingEarnings

  if (farm.boosted) {
    const proxyEarnings = new BigNumber(farm.userData?.proxy?.earnings)

    earnings = proxyEarnings.gt(0) ? proxyEarnings : existingEarnings
  }

  return getBalanceNumber(earnings)
}

const COLUMNS = DesktopColumnSchema.map((column) => ({
  id: column.id,
  name: column.name,
  label: column.label,
  sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
    switch (column.name) {
      case 'farm':
        return b.id - a.id
      case 'apr':
        if (a.original.apr.value && b.original.apr.value) {
          return Number(a.original.apr.value) - Number(b.original.apr.value)
        }

        return 0
      case 'earned':
        return a.original.earned.earnings - b.original.earned.earnings
      default:
        return 1
    }
  },
  sortable: column.sortable,
}))

const COLUMNS_V3 = V3DesktopColumnSchema.map((column) => ({
  id: column.id,
  name: column.name,
  label: column.label,
  sort: (a: RowType<RowProps>, b: RowType<RowProps>) => {
    switch (column.name) {
      case 'farm':
        return b.id - a.id
      case 'apr':
        if (a.original.apr.value && b.original.apr.value) {
          return Number(a.original.apr.value) - Number(b.original.apr.value)
        }

        return 0
      case 'earned':
        return a.original.earned.earnings - b.original.earned.earnings
      default:
        return 1
    }
  },
  sortable: column.sortable,
}))

const generateSortedRow = (row: RowProps) => {
  // @ts-ignore
  const newRow: RowProps = {}
  const columns = row.type === 'v3' ? COLUMNS_V3 : COLUMNS
  columns.forEach((column) => {
    if (!(column.name in row)) {
      throw new Error(`Invalid row data, ${column.name} not found`)
    }
    newRow[column.name] = row[column.name]
  })
  newRow.initialActivity = row.initialActivity
  return newRow
}

const FarmTable: React.FC<React.PropsWithChildren<ITableProps>> = ({ farms, cakePrice, userDataReady, header }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { query } = useRouter()

  const farmV3Multiplier = useFarmV3Multiplier()
  const farmV2Multiplier = useFarmV2Multiplier()

  const generateRow = useCallback(
    (farm: V2StakeValueAndV3Farm): RowProps => {
      const { token, quoteToken } = farm
      const tokenAddress = token.address
      const quoteTokenAddress = quoteToken.address
      const lpLabel = farm.lpSymbol && farm.lpSymbol.replace(/pancake/gi, '')
      const lowercaseQuery = latinise(typeof query?.search === 'string' ? query.search.toLowerCase() : '')
      const initialActivity = latinise(lpLabel?.toLowerCase()) === lowercaseQuery

      if (farm.version === 2) {
        const row: RowProps = {
          apr: {
            value: getDisplayApr(farm.apr, farm.lpRewardsApr),
            pid: farm.pid,
            multiplier: farm.multiplier,
            lpLabel,
            lpSymbol: farm.lpSymbol,
            lpTokenPrice: farm.lpTokenPrice,
            tokenAddress,
            quoteTokenAddress,
            cakePrice,
            lpRewardsApr: farm.lpRewardsApr,
            originalValue: farm.apr,
            stableSwapAddress: farm.stableSwapAddress,
            stableLpFee: farm.stableLpFee,
          },
          farm: {
            version: 2,
            label: lpLabel,
            pid: farm.pid,
            token: farm.token,
            quoteToken: farm.quoteToken,
            isReady: farm.multiplier !== undefined,
            isStaking: farm.userData?.proxy?.stakedBalance.gt(0) || farm.userData?.stakedBalance.gt(0),
          },
          earned: {
            earnings: getV2FarmEarnings(farm),
            pid: farm.pid,
          },
          liquidity: {
            liquidity: farm?.liquidity,
          },
          multiplier: {
            multiplier: farm.multiplier,
            farmCakePerSecond: farmV2Multiplier.getFarmCakePerSecond(farm.poolWeight),
            totalMultipliers: farmV2Multiplier.totalMultipliers,
          },
          type: farm.isCommunity ? 'community' : 'v2',
          details: farm,
          initialActivity,
        }
        return row
      }

      return {
        initialActivity,
        apr: {
          // not really used in farms v3
          value: '',
          pid: farm.pid,
        },
        farm: {
          version: 3,
          label: lpLabel,
          pid: farm.pid,
          token: farm.token,
          quoteToken: farm.quoteToken,
          isReady: farm.multiplier !== undefined,
          isStaking: farm.stakedPositions?.length > 0,
          isCommunity: farm.isCommunity,
        },
        type: 'v3',
        details: farm,
        multiplier: {
          multiplier: farm.multiplier,
          farmCakePerSecond: farmV3Multiplier.getFarmCakePerSecond(farm.poolWeight),
          totalMultipliers: farmV3Multiplier.totalMultipliers,
        },
        stakedLiquidity: {
          inactive: farm.multiplier === '0X',
          liquidity: new BigNumber(farm.activeTvlUSD),
          updatedAt: farm.activeTvlUSDUpdatedAt ? new Date(farm.activeTvlUSDUpdatedAt).getTime() : undefined,
        },
        earned: {
          earnings: +formatBigInt(
            Object.values(farm.pendingCakeByTokenIds).reduce((total, vault) => total + vault, 0n),
            4,
          ),
          pid: farm.pid,
        },
        availableLp: {
          pid: farm.pid,
          amount: farm.multiplier === '0X' ? 0 : farm.unstakedPositions.length,
        },
        stakedLp: {
          pid: farm.pid,
          amount: farm.stakedPositions.length,
        },
      }
    },
    [query.search, farmV3Multiplier, cakePrice, farmV2Multiplier],
  )

  const sortedRows = useMemo(() => {
    const rowData = farms.map((farm) => generateRow(farm))
    return rowData.map(generateSortedRow)
  }, [farms, generateRow])

  return (
    <Container id="farms-table">
      {header}
      <TableContainer id="table-container">
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {sortedRows.map((row) => {
                return row.type === 'v2' && row?.details?.boosted ? (
                  <ProxyFarmContainer key={`table-row-${row.farm.pid}-${row.type}`} farm={row.details}>
                    <Row {...row} userDataReady={userDataReady} />
                  </ProxyFarmContainer>
                ) : (
                  <Row {...row} userDataReady={userDataReady} key={`table-row-${row.farm.pid}-${row.type}`} />
                )
              })}
            </TableBody>
          </StyledTable>
        </TableWrapper>
      </TableContainer>
    </Container>
  )
}

export default FarmTable
