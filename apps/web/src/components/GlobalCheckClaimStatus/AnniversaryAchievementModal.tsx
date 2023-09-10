import { AutoRenewIcon, Box, Button, Flex, Modal, Text, ModalV2, useToast } from '@pancakeswap/uikit'
import confetti from 'canvas-confetti'
import { ChainId } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import delay from 'lodash/delay'
import React, { useRef, useEffect, useState } from 'react'
import { styled } from 'styled-components'
import Dots from 'components/Loader/Dots'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useAnniversaryAchievementContract } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'

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

  const hasDisplayedModal = useRef(false)
  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [canClaimAnniversaryPoints, setCanClaimAnniversaryPoints] = useState(false)

  const contract = useAnniversaryAchievementContract({ chainId: ChainId.BSC })

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  // Check claim status
  useEffect(() => {
    const fetchClaimAnniversaryStatus = async () => {
      const canClaimAnniversary = await contract.read.canClaim([account])
      setCanClaimAnniversaryPoints(canClaimAnniversary)
    }

    if (account && chainId === ChainId.BSC) {
      fetchClaimAnniversaryStatus()
    }
  }, [account, chainId, contract])

  useEffect(() => {
    const matchesSomeLocations = excludeLocations.some((location) => router.pathname.includes(location))

    if (canClaimAnniversaryPoints && !matchesSomeLocations && !show) {
      setShow(true)
    }
  }, [excludeLocations, hasDisplayedModal, canClaimAnniversaryPoints, router, show])

  // Reset the check flag when account changes
  useEffect(() => {
    setShow(false)
  }, [account, hasDisplayedModal])

  const handleCloseModal = () => {
    setShow(false)
  }

  const handleClick = async () => {
    setIsLoading(true)

    try {
      const receipt = await fetchWithCatchTxError(() => contract.write.claimAnniversaryPoints({ account, chainId }))

      if (receipt?.status) {
        toastSuccess(t('Success!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        if (account) {
          router.push(`/profile/${account}/achievements`)
        }
      }
    } catch (error: any) {
      const errorDescription = `${error.message} - ${error.data?.message}`
      toastError(t('Failed to claim'), errorDescription)
    } finally {
      handleCloseModal()
    }
  }

  return (
    <ModalV2 isOpen={show} onDismiss={() => handleCloseModal()} closeOnOverlayClick>
      <Modal title={t('Congratulations!')} onDismiss={handleCloseModal}>
        <Flex flexDirection="column" alignItems="center" justifyContent="center" maxWidth="450px">
          <Box>
            <AnniversaryImage src="/images/achievements/3-year.svg" />
          </Box>
          <Text textAlign="center" bold fontSize="24px">
            3 Years
          </Text>
          <Text textAlign="center">+300 {t('Points')}</Text>
          <Text textAlign="center" bold color="secondary" mb="24px">
            {t(
              'You won points and achievements for taking part in our three years journey. Now let’s celebrate our 3rd Birthday!',
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
