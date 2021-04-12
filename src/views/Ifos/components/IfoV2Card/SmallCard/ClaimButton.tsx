import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { AutoRenewIcon, Button } from '@pancakeswap-libs/uikit'
import { PoolIds } from 'hooks/ifo/v2/types'
import { useToast } from 'state/hooks'
import useI18n from 'hooks/useI18n'

interface Props {
  poolId: PoolIds
  contract: Contract
  isPendingTx: boolean
  setPendingTx: (status: boolean) => void
  setIsClaimed: () => void
}

const ClaimButton: React.FC<Props> = ({ poolId, contract, isPendingTx, setPendingTx, setIsClaimed }) => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { toastError, toastSuccess } = useToast()

  const handleClaim = async () => {
    try {
      setPendingTx(true)
      await contract.methods.harvestPool(poolId === PoolIds.poolBasic ? 0 : 1).send({ from: account })
      setIsClaimed()
      toastSuccess('Success!', 'You have successfully claimed your rewards.')
    } catch (error) {
      toastError('Error', error?.message)
      console.error(error)
    } finally {
      setPendingTx(false)
    }
  }

  return (
    <Button
      onClick={handleClaim}
      disabled={isPendingTx}
      width="100%"
      isLoading={isPendingTx}
      endIcon={isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {TranslateString(999, 'Claim')}
    </Button>
  )
}

export default ClaimButton
