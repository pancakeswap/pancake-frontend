import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { AutoRenewIcon, Button } from '@pancakeswap-libs/uikit'
import { useToast } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { UserPoolCharacteristics } from 'hooks/ifo/v2/types'

interface ClaimProps {
  contract: Contract
  userPoolCharacteristics: UserPoolCharacteristics
  setPendingTx: (status: boolean) => void
  setIsClaimed: () => void
}

const Claim: React.FC<ClaimProps> = ({ contract, userPoolCharacteristics, setPendingTx, setIsClaimed }) => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const { toastError, toastSuccess } = useToast()
  const { amountTokenCommittedInLP, isPendingTx } = userPoolCharacteristics
  const hasSomethingToClaim = amountTokenCommittedInLP.isGreaterThan(0)
  const canClaim = !userPoolCharacteristics.hasClaimed

  const handleClaim = async () => {
    try {
      setPendingTx(true)
      await contract.methods.harvest().send({ from: account })
      setIsClaimed()
      toastSuccess('Success!', 'You have successfully claimed your rewards.')
    } catch (error) {
      toastError('Error', error?.message)
      console.error(error)
    } finally {
      setPendingTx(false)
    }
  }

  return hasSomethingToClaim ? (
    <Button
      onClick={handleClaim}
      disabled={isPendingTx || !canClaim}
      width="100%"
      isLoading={isPendingTx}
      endIcon={isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {canClaim ? TranslateString(999, 'Claim') : TranslateString(999, 'Claimed')}
    </Button>
  ) : (
    <Button disabled width="100%">
      {TranslateString(999, 'Nothing to Claim')}
    </Button>
  )
}

export default Claim
