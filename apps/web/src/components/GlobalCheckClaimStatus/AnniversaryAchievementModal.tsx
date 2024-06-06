import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Box, Button, Flex, Modal, ModalV2, Text, useToast } from '@pancakeswap/uikit'
import confetti from 'canvas-confetti'
import Dots from 'components/Loader/Dots'
import { ToastDescriptionWithTx } from 'components/Toast'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCatchTxError from 'hooks/useCatchTxError'
import { useAnniversaryAchievementContract } from 'hooks/useContract'
import { useShowOnceAnniversaryModal } from 'hooks/useShowOnceAnniversaryModal'
import delay from 'lodash/delay'
import { useRouter } from 'next/router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'

const AnniversaryImage = styled.img`
  border-radius: 50%;
  height: 128px;
  margin-right: 8px;
  width: 128px;
`

const showConfetti = () => {
  confetti({
    particleCount: 200,
    startVelocity: 30,
    gravity: 0.5,
    spread: 350,
    origin: {
      x: 0.5,
      y: 0.3,
    },
  })
}

interface AnniversaryModalProps {
  excludeLocations: string[]
}

const AnniversaryAchievementModal: React.FC<AnniversaryModalProps> = ({ excludeLocations }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { toastError, toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const [showOnceAnniversaryModal, setShowOnceAnniversaryModal] = useShowOnceAnniversaryModal()

  const hasDisplayedModal = useRef(false)
  const [isFirstTime, setIsFirstTime] = useState(true)
  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [canClaimAnniversaryPoints, setCanClaimAnniversaryPoints] = useState(false)

  const contract = useAnniversaryAchievementContract({ chainId: ChainId.BSC })

  // Check claim status
  useEffect(() => {
    const fetchClaimAnniversaryStatus = async () => {
      const canClaimAnniversary = account && (await contract.read.canClaim([account]))
      setCanClaimAnniversaryPoints(Boolean(canClaimAnniversary))
    }

    if (account && chainId === ChainId.BSC) {
      fetchClaimAnniversaryStatus()
    }
  }, [account, chainId, contract])

  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => router.pathname.includes(location))

    if (
      canClaimAnniversaryPoints &&
      !matchesSomeLocations &&
      !show &&
      account &&
      !Object.keys(showOnceAnniversaryModal).includes(account)
    ) {
      if (isFirstTime) {
        delay(showConfetti, 100)
        setIsFirstTime(false)
      }

      setShow(true)
    }
  }, [
    excludeLocations,
    hasDisplayedModal,
    canClaimAnniversaryPoints,
    router,
    show,
    isFirstTime,
    showOnceAnniversaryModal,
    account,
  ])

  // Reset the check flag when account changes
  useEffect(() => {
    setShow(false)
    setIsLoading(false)
    setIsFirstTime(true)
  }, [account, hasDisplayedModal])

  const closeOnceAnniversaryModal = useCallback(() => {
    if (account && !Object.keys(showOnceAnniversaryModal).includes(account)) {
      setShowOnceAnniversaryModal({ ...showOnceAnniversaryModal, [account]: false })
    }
  }, [account, showOnceAnniversaryModal, setShowOnceAnniversaryModal])

  const handleCloseModal = useCallback(() => {
    setShow(false)
    closeOnceAnniversaryModal()
  }, [closeOnceAnniversaryModal])

  const handleClick = async () => {
    setIsLoading(true)

    try {
      const receipt =
        account &&
        (await fetchWithCatchTxError(() =>
          contract.write.claimAnniversaryPoints({
            account,
            chain: contract.chain,
          }),
        ))

      if (receipt?.status) {
        toastSuccess(t('Success!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        if (account) {
          closeOnceAnniversaryModal()
          router.push(`/profile/${account}/achievements`)
        }
      }
    } catch (error: any) {
      const errorDescription = `${error.message} - ${error.data?.message}`
      toastError(t('Failed to claim'), errorDescription)
    } finally {
      setShow(false)
      setIsLoading(false)
    }
  }

  return (
    <ModalV2 isOpen={show} onDismiss={handleCloseModal} closeOnOverlayClick>
      <Modal title={t('Congratulations!')}>
        <Flex flexDirection="column" alignItems="center" justifyContent="center" maxWidth="450px">
          <Box>
            <AnniversaryImage src={`${ASSET_CDN}/web/achievements/3-year.svg`} />
          </Box>
          <Text textAlign="center" bold fontSize="24px">
            {t('Happy Birthday!')}
          </Text>
          <Text textAlign="center">+100 {t('Points')}</Text>
          <Text textAlign="center" bold color="secondary" mb="24px">
            {t(
              'Let’s celebrate our 3rd Birthday with some juicy profile points and achievements. Check out our social channels for other exciting campaigns and community events.',
            )}
          </Text>
          <Button
            disabled={isLoading}
            onClick={handleClick}
            endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
          >
            {isLoading ? <Dots>{t('Claiming')}</Dots> : t('Claim now')}
          </Button>
        </Flex>
      </Modal>
    </ModalV2>
  )
}

export default AnniversaryAchievementModal
