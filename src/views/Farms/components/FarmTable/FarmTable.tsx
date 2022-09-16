import { useRef, useMemo } from 'react'
import { latinise } from 'utils/latinise'
import styled from 'styled-components'
import { RowType } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { useRouter } from 'next/router'
import { getDisplayApr } from '../getDisplayApr'

import Row, { RowProps } from './Row'
import { DesktopColumnSchema, FarmWithStakedValue } from '../types'
import ProxyFarmContainer from '../YieldBooster/components/ProxyFarmContainer'

export interface ITableProps {
  farms: FarmWithStakedValue[]
  userDataReady: boolean
  cakePrice: BigNumber
  sortColumn?: string
}

const Container = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.card.background};
  border-radius: 16px;
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
  border-radius: 4px;
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
  }
`

const TableContainer = styled.div`
  position: relative;
`

const FarmTable: React.FC<React.PropsWithChildren<ITableProps>> = ({ farms, cakePrice, userDataReady }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { query } = useRouter()

  const columns = useMemo(
    () =>
      DesktopColumnSchema.map((column) => ({
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
      })),
    [],
  )

  const getFarmEarnings = (farm) => {
    let earnings = BIG_ZERO
    const existingEarnings = new BigNumber(farm.userData.earnings)

    if (farm.boosted) {
      const proxyEarnings = new BigNumber(farm.userData?.proxy?.earnings)

      earnings = proxyEarnings.gt(0) ? proxyEarnings : existingEarnings
    } else {
      earnings = existingEarnings
    }

    return getBalanceNumber(earnings)
  }

  const generateRow = (farm) => {
    const { token, quoteToken } = farm
    const tokenAddress = token.address
    const quoteTokenAddress = quoteToken.address
    const lpLabel = farm.lpSymbol && farm.lpSymbol.split(' ')[0].toUpperCase().replace('PANCAKE', '')
    const lowercaseQuery = latinise(typeof query?.search === 'string' ? query.search.toLowerCase() : '')
    const initialActivity = latinise(lpLabel?.toLowerCase()) === lowercaseQuery
    const row: RowProps = {
      apr: {
        value: getDisplayApr(farm.apr, farm.lpRewardsApr),
        pid: farm.pid,
        multiplier: farm.multiplier,
        lpLabel,
        lpSymbol: farm.lpSymbol,
        tokenAddress,
        quoteTokenAddress,
        cakePrice,
        lpRewardsApr: farm.lpRewardsApr,
        originalValue: farm.apr,
      },
      farm: {
        label: lpLabel,
        pid: farm.pid,
        token: farm.token,
        quoteToken: farm.quoteToken,
        isReady: farm.multiplier !== undefined,
      },
      earned: {
        earnings: getFarmEarnings(farm),
        pid: farm.pid,
      },
      liquidity: {
        liquidity: farm?.liquidity,
      },
      multiplier: {
        multiplier: farm.multiplier,
      },
      type: farm.isCommunity ? 'community' : 'core',
      details: farm,
      initialActivity,
    }

    return row
  }

  const rowData = farms.map((farm) => generateRow(farm))

  const generateSortedRow = (row) => {
    // @ts-ignore
    const newRow: RowProps = {}
    columns.forEach((column) => {
      if (!(column.name in row)) {
        throw new Error(`Invalid row data, ${column.name} not found`)
      }
      newRow[column.name] = row[column.name]
    })
    newRow.initialActivity = row.initialActivity
    return newRow
  }

  const sortedRows = rowData.map(generateSortedRow)

  return (
    <Container id="farms-table">
      <TableContainer id="table-container">
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {sortedRows.map((row) => {
                return row?.details?.boosted ? (
                  <ProxyFarmContainer key={`table-row-${row.farm.pid}`} farm={row.details}>
                    <Row {...row} userDataReady={userDataReady} />
                  </ProxyFarmContainer>
                ) : (
                  <Row {...row} userDataReady={userDataReady} key={`table-row-${row.farm.pid}`} />
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
