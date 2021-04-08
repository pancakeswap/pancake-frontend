import React from 'react'
import { useWeb3React } from '@web3-react/core'
import { Contract } from 'web3-eth-contract'
import { AutoRenewIcon, Button } from '@pancakeswap-libs/uikit'
import { useToast } from 'state/hooks'
import useI18n from 'hooks/useI18n'
import { UserInfo, WalletIfoState } from 'hooks/useGetWalletIfoData'

interface ClaimProps {
  contract: Contract
  userInfo: UserInfo
  isPendingTx: WalletIfoState['isPendingTx']
  setPendingTx: (status: boolean) => void
  setIsClaimed: () => void
}

const Claim: React.FC<ClaimProps> = ({ contract, userInfo, isPendingTx, setPendingTx, setIsClaimed }) => {
  const TranslateString = useI18n()
  const { account } = useWeb3React()
  const didContribute = userInfo.amount.gt(0)
  const canClaim = !userInfo.claimed
  const { toastError, toastSuccess } = useToast()

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

  return didContribute ? (
    <Button
      onClick={handleClaim}
      disabled={isPendingTx || !canClaim}
      width="100%"
      mb="24px"
      isLoading={isPendingTx}
      endIcon={isPendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
    >
      {canClaim ? TranslateString(999, 'Claim') : TranslateString(999, 'Claimed')}
    </Button>
  ) : (
    <Button disabled width="100%" mb="24px">
      {TranslateString(999, 'Nothing to Claim')}
    </Button>
  )
}

export default Claim
