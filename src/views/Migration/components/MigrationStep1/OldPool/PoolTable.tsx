import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import TableHeader from '../../MigrationTable/TableHeader'
import Loading from '../../MigrationTable/Loading'
import EmptyText from '../../MigrationTable/EmptyText'
import TableStyle from '../../MigrationTable/StyledTable'
import PoolRow from './PoolRow'

interface PoolsTableProps {
  pools: DeserializedPool[]
  userDataReady: boolean
  account: string
}

const Container = styled.div`
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 32px;
`

const PoolsTable: React.FC<PoolsTableProps> = ({ pools, userDataReady, account }) => {
  const { t } = useTranslation()

  return (
    <Container>
      <TableHeader title={t('Old Pools')} />
      <TableStyle>
        {!userDataReady && <Loading />}
        {!account && <EmptyText text={t('Please connect wallet to check your pool status.')} />}
        {account && userDataReady && pools.length === 0 && (
          <EmptyText text={t('You are not currently staking in any v1 pools.')} />
        )}
        {account &&
          userDataReady &&
          pools.map((pool) => (
            <PoolRow key={pool.vaultKey ?? pool.sousId} pool={pool} account={account} userDataLoaded={userDataReady} />
          ))}
      </TableStyle>
    </Container>
  )
}

export default PoolsTable
