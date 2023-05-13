import { Flex, Text, Button, Modal, InjectedModalProps, useToast } from '@pancakeswap/uikit'
import confetti from 'canvas-confetti'
import delay from 'lodash/delay'
import { useTranslation } from '@pancakeswap/localization'
import { useEffect, useState } from 'react'

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

const ClaimNftModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const [isClaiming, setIsClaiming] = useState(false)
  const { toastSuccess, toastError } = useToast()

  const claimNft = async () => {
    try {
      setIsClaiming(true)
      // await bunnyXmasContract.mintNFT()
      toastSuccess(t('Your NFT has been sent to your wallet'))
      onDismiss?.()
    } catch (error: any) {
      const errorDescription = `${error.message} - ${error.data?.message}`
      toastError(t('Failed to claim'), errorDescription)
    } finally {
      setIsClaiming(false)
    }
  }

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])
  return (
    <Modal title={t('Congratulations!')} onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" maxWidth="320px">
        <img
          src="/images/nfts/christmas-2021.png"
          height="128px"
          width="128px"
          alt="nft"
          style={{ marginBottom: '24px' }}
        />
        <Text bold color="secondary" textAlign="center" fontSize="18px" mb="24px">
          {t(
            'Celebrate Christmas and New Year with us! Enjoy this wonderful NFT crafted by Chef Cecy and the winner from our #PancakeChristmas event.',
          )}
        </Text>
        <Button disabled={isClaiming} onClick={claimNft}>
          {t('Claim now')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default ClaimNftModal
