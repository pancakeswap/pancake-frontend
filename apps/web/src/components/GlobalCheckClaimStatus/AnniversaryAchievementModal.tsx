import { AutoRenewIcon, Box, Button, Flex, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import confetti from 'canvas-confetti'
import { useTranslation } from '@pancakeswap/localization'
import delay from 'lodash/delay'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Dots from 'components/Loader/Dots'
import { useRouter } from 'next/router'
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

interface AnniversaryModalProps extends InjectedModalProps {
  onClick: () => Promise<void>
}

const AnniversaryAchievementModal: React.FC<AnniversaryModalProps> = ({ onDismiss, onClick }) => {
  const { t } = useTranslation()
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onClick()
    } finally {
      onDismiss()
      if (address) {
        router.push(`/profile/${address}/achievements`)
      }
    }
  }

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  return (
    <Modal title={t('Congratulations!')} onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" maxWidth="450px">
        <Box>
          <AnniversaryImage src="/images/achievements/2-year.svg" />
        </Box>
        <Text textAlign="center" bold fontSize="24px">
          2 Years
        </Text>
        <Text textAlign="center">+100 {t('Points')}</Text>
        <Text textAlign="center" bold color="secondary" mb="24px">
          {t(
            'You won points and achievements for taking part in our two years journey. Now let’s celebrate our 2nd Birthday!',
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
  )
}

export default AnniversaryAchievementModal
