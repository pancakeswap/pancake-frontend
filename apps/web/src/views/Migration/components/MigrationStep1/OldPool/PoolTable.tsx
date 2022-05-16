import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import { Flex, Spinner } from '@pancakeswap/uikit'
import TableHeader from '../../MigrationTable/TableHeader'
import EmptyText from '../../MigrationTable/EmptyText'
import TableStyle from '../../MigrationTable/StyledTable'
import PoolRow from './PoolRow'

interface PoolsTableProps {
  pools: DeserializedPool[]
  userDataReady: boolean
  account: string
}

const Container = styled.div`
  overflow: hidden;
  margin-bottom: 32px;
  border-radius: 24px 24px 16px 16px;
  background-color: ${({ theme }) => theme.colors.disabled};
  padding: 1px 1px 3px 1px;
`

const PoolsTable: React.FC<PoolsTableProps> = ({ pools, userDataReady, account }) => {
  const { t } = useTranslation()

  return (
    <Container>
      <TableHeader title={t('Old Pools')} />
      <TableStyle>
        {!userDataReady && (
          <Flex padding="50px 10px" justifyContent="center">
            <Spinner />
          </Flex>
        )}
        {!account && <EmptyText text={t('Please connect wallet to check your pool status.')} />}
        {account && userDataReady && pools.length === 0 && (
          <EmptyText text={t('You are not currently staking in any v1 pools.')} />
        )}
        {account &&
          userDataReady &&
          pools.map((pool) => <PoolRow key={pool.vaultKey ?? pool.sousId} pool={pool} account={account} />)}
      </TableStyle>
    </Container>
  )
}

export default PoolsTable
