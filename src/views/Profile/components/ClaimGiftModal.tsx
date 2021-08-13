import React, { useCallback, useEffect, useState } from 'react'
import { Modal, Text, InjectedModalProps, Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import { useClaimRefundContract } from 'hooks/useContract'
import { useTranslation } from 'contexts/Localization'
import { getClaimRefundContract } from 'utils/contractHelpers'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'

interface ClaimGiftProps extends InjectedModalProps {
  onSuccess: () => void
}

export const useCanClaim = () => {
  const [canClaim, setCanClaim] = useState(false)
  const [refresh, setRefresh] = useState(1)
  const { account } = useWeb3React()

  const checkClaimStatus = useCallback(() => {
    setRefresh((prevRefresh) => prevRefresh + 1)
  }, [setRefresh])

  useEffect(() => {
    const fetchClaimStatus = async () => {
      const claimRefundContract = getClaimRefundContract()
      try {
        const walletCanClaim = await claimRefundContract.canClaim(account)
        setCanClaim(walletCanClaim)
      } catch (e) {
        console.error(e)
      }
    }

    if (account) {
      fetchClaimStatus()
    }
  }, [account, refresh, setCanClaim])

  return { canClaim, checkClaimStatus }
}

const ClaimGift: React.FC<ClaimGiftProps> = ({ onSuccess, onDismiss }) => {
  const [isConfirming, setIsConfirming] = useState(false)
  const { t } = useTranslation()
  const { canClaim } = useCanClaim()
  const claimRefundContract = useClaimRefundContract()
  const { toastSuccess, toastError } = useToast()
  const { callWithGasPrice } = useCallWithGasPrice()

  const handleClick = async () => {
    const tx = await callWithGasPrice(claimRefundContract, 'getCakeBack')
    setIsConfirming(true)
    const receipt = await tx.wait()
    if (receipt.status) {
      toastSuccess(t('Success!'))
      onSuccess()
      onDismiss()
    } else {
      setIsConfirming(false)
      toastError(t('Error'), t('Please try again. Confirm the transaction and make sure you are paying enough gas!'))
    }
  }

  return (
    <Modal title={t('Claim your Gift!')} onDismiss={onDismiss}>
      <div style={{ maxWidth: '640px' }}>
        <Text as="p">{t('Thank you for being a day-one user of Pancake Profiles!')}</Text>
        <Text as="p" mb="8px">
          {t(
            "If you haven't already noticed, we made a mistake and the starter bunny you chose got mixed up and changed into another bunny. Oops!",
          )}
        </Text>
        <Text as="p">{t('To make it up to you, we’ll refund you the full 4 CAKE it cost to make your bunny.')}</Text>
        <Text as="p" mb="8px">
          {t('We’re also preparing an all-new collectible for you to claim (for free!) in the near future.')}
        </Text>
        <Text as="p" mb="24px">
          {t(
            'Once you claim the refund, you can make another account with another wallet, mint a new bunny, and send it to your main account via the NFT page.',
          )}
        </Text>
        <Button
          endIcon={isConfirming ? <AutoRenewIcon spin color="currentColor" /> : null}
          isLoading={isConfirming}
          onClick={handleClick}
          disabled={!canClaim}
        >
          {t('Claim Your CAKE')}
        </Button>
      </div>
    </Modal>
  )
}

export default ClaimGift
