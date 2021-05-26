import React, { useRef } from 'react'
import styled from 'styled-components'
import { Button, ChevronUpIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Pool } from 'state/types'
import PoolRow from './PoolRow'

interface PoolsTableProps {
  pools: Pool[]
  userDataLoaded: boolean
  cakeVault?: Pool
  account: string
  showFinishedPools: boolean
}

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};

  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.disabled};
  }
`

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  background-color: ${({ theme }) => theme.colors.cardBorder};
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const PoolsTable: React.FC<PoolsTableProps> = ({ pools, userDataLoaded, cakeVault, account, showFinishedPools }) => {
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  return (
    <StyledTableBorder>
      <StyledTable role="table" ref={tableWrapperEl}>
        {!showFinishedPools && cakeVault && (
          <PoolRow pool={cakeVault} account={account} userDataLoaded={userDataLoaded} isAutoVault />
        )}
        {pools.map((pool) => (
          <PoolRow key={pool.sousId} pool={pool} account={account} userDataLoaded={userDataLoaded} />
        ))}
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            {t('To Top')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </StyledTable>
    </StyledTableBorder>
  )
}

export default PoolsTable
