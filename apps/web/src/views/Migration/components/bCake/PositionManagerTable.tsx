import { FarmWithStakedValue } from '@pancakeswap/farms'
import { useTranslation } from '@pancakeswap/localization'
import { VAULTS_CONFIG_BY_CHAIN, VaultConfig } from '@pancakeswap/position-managers'
import { Flex, Spinner } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import React, { useMemo } from 'react'
import { styled } from 'styled-components'
import EmptyText from '../MigrationTable/EmptyText'
import TableStyle from '../MigrationTable/StyledTable'
import TableHeader from '../MigrationTable/TableHeader'
import { ColumnsDefTypes, V3Step1DesktopColumnSchema } from '../types'
import { PositionManagerFarmRow } from './PMRow'

const Container = styled.div`
  overflow: hidden;
  margin-bottom: 32px;
  border-radius: 24px 24px 16px 16px;
  background-color: ${({ theme }) => theme.colors.disabled};
  padding: 1px 1px 3px 1px;
`

export interface ITableProps {
  title: string
  noStakedFarmText: string
  account?: string
  columnSchema: ColumnsDefTypes[]
  farms: FarmWithStakedValue[]
  userDataReady: boolean
  sortColumn?: string
  step: number
}

export const PosManagerMigrationFarmTable: React.FC<React.PropsWithChildren<ITableProps>> = ({
  title,
  noStakedFarmText,
  account,
  columnSchema,
  userDataReady,
  step,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const needToMigrateList: VaultConfig[] = useMemo(() => {
    if (!chainId) return []
    return VAULTS_CONFIG_BY_CHAIN[chainId].filter(
      (vault) => vault.address && vault?.bCakeWrapperAddress && vault?.bCakeWrapperAddress !== vault.address,
    )
  }, [chainId])

  const rows = needToMigrateList.map((d) => {
    return {
      id: d.id,
      data: {
        token: d.currencyA.wrapped,
        quoteToken: d.currencyB.wrapped,
        label: `${d.currencyA.symbol}-${d.currencyB.symbol}`,
        manager: d.manager,
        wrapperAddress: d.address,
        adapterAddress: d.adapterAddress,
        bCakeWrapperAddress: d.bCakeWrapperAddress ?? '0x',
        earningToken: d.earningToken.wrapped,
      },
      onStake: () => {},
      onUnStake: () => {},
    }
  })

  return (
    <Container>
      <TableHeader title={title} />
      <TableStyle>
        {!userDataReady && (
          <Flex padding="50px 10px" justifyContent="center">
            <Spinner />
          </Flex>
        )}
        {!account && <EmptyText text={t('Please connect wallet to check your farms status.')} />}
        {account && userDataReady && rows.length === 0 && <EmptyText text={noStakedFarmText} />}
        {account &&
          userDataReady &&
          rows.map((d) => {
            if (columnSchema === V3Step1DesktopColumnSchema) {
              return <PositionManagerFarmRow step={step} {...d} key={`table-row-${d.id}`} />
            }
            return null
          })}
      </TableStyle>
    </Container>
  )
}
