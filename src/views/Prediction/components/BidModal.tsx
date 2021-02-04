import styled from 'styled-components'
import React, { useState, useMemo, useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Modal, Flex, Text } from '@pancakeswap-libs/uikit'
import TokenInput from 'components/TokenInput'
import { useBnbBalance } from 'hooks/useBnbBalance'
import { usePredictionBnb } from 'hooks/useContract'
import { useNumberOnlyCallback } from 'hooks/useNumberOnlyCallback'
import { bidBull, bidBear } from 'utils/callHelpers'
import { DIRECTION } from '../types'

type BidModalProps = {
  account: string
  onDismiss?: () => void
  userAmount: string
  userDirection: DIRECTION
}

const OpButton = styled(Button)`
  width: 50%;
  color: ${(props) => props.theme.colors.card};
`

const BidModal: React.FC<BidModalProps> = ({ account, onDismiss, userAmount, userDirection }) => {
  const balance = useBnbBalance()
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const [pendingTx, setPendingTx] = useState(false)
  const bnbPredictionContract = usePredictionBnb()
  const handleChange = useNumberOnlyCallback(setAmount)
  const handleSelectMax = useCallback(() => {
    setAmount(balance)
  }, [balance, setAmount])
  const showBalance = useMemo(() => new BigNumber(balance).toFixed(4, 1), [balance])

  const handleBid = async (direction) => {
    let errorMsg = ''
    if (+amount === 0) {
      errorMsg = 'Please input amount'
    } else if (+amount > +balance) {
      errorMsg = 'Insufficient balance'
    }
    setError(errorMsg)
    if (errorMsg) return
    // call abi
    setPendingTx(true)
    if (direction === DIRECTION.BULL) {
      await bidBull(bnbPredictionContract, account, amount)
    } else {
      await bidBear(bnbPredictionContract, account, amount)
    }
    setPendingTx(false)
    onDismiss()
  }

  const text = userDirection === DIRECTION.BULL ? 'BUMP' : 'DUMP'

  return (
    <Modal title="Start Bid" onDismiss={onDismiss}>
      {+userAmount > 0 && <Text fontSize='12px' bold>Your Position({text}): {userAmount}BNB</Text>}
      <TokenInput symbol="BNB" value={amount} max={showBalance} onChange={handleChange} onSelectMax={handleSelectMax} />
      {error && (
        <Text color="failure" fontSize="12px">
          {error}
        </Text>
      )}
      <Flex mt="24px">
        <OpButton disabled={pendingTx} variant="success" mr="24px" onClick={() => handleBid(DIRECTION.BULL)}>
          PUMP
        </OpButton>
        <OpButton disabled={pendingTx} variant="danger" onClick={() => handleBid(DIRECTION.BEAR)}>
          DUMP
        </OpButton>
      </Flex>
    </Modal>
  )
}

export default BidModal
