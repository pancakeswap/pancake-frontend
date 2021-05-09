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
  box-shadow: ${({ theme }) =>
    theme.isDark
      ? `rgba(217, 217, 226, 0.05) 0px 1px 0px, rgba(217, 217, 226, 0.3) 0px 0px 8px;`
      : `rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;`}

  border-radius: ${({ theme }) => theme.radii.card};

  background-color: ${({ theme }) => theme.card.background};
  > div:not(:last-child) {
    border-bottom: 2px solid ${({ theme }) => theme.colors.borderColor};
  }
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
  )
}

export default PoolsTable
