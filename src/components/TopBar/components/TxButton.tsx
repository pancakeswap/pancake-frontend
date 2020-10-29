import React from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import { Button } from '@pancakeswap-libs/uikit'
import usePendingTransactions from '../../../hooks/usePendingTransactions'

const TxButton: React.FC = () => {
  const { account } = useWallet()
  const pendingTransactions = usePendingTransactions()
  return (
    <>
      {!!account && !!pendingTransactions.length ? (
        <StyledTxButton>
          <Button
            as="a"
            size="sm"
            href={`https://etherscan.io/address/${account}`}
          >
            {`${pendingTransactions.length} Transaction(s)`}
          </Button>
        </StyledTxButton>
      ) : null}
    </>
  )
}

const StyledTxButton = styled.div`
  margin-right: ${(props) => props.theme.spacing[4]}px;
`

export default TxButton
