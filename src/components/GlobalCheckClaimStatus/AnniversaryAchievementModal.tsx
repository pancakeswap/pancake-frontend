import React, { useEffect, useState } from 'react'
import { AutoRenewIcon, Box, Button, Flex, InjectedModalProps, Modal, Text } from '@tovaswapui/uikit'
import styled from 'styled-components'
import confetti from 'canvas-confetti'
import { useTranslation } from 'contexts/Localization'
import { useAnniversaryAchievementContract } from 'hooks/useContract'
import delay from 'lodash/delay'

const AnniversaryImage = styled.img`
  border-radius: 50%;
  height: 128px;
  margin-bottom: 24px;
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

const AnniversaryAchievementModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const { claimAnniversaryPoints } = useAnniversaryAchievementContract()

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await claimAnniversaryPoints()
    } finally {
      onDismiss()
    }
  }

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  return (
    <Modal title={t('Congratulations!')} onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Box>
          <AnniversaryImage src="/images/achievements/1-year.svg" />
        </Box>
        <Text textAlign="center" bold color="secondary" maxWidth="400px" fontSize="16px" mb="24px">
          {t('You won points for joining PancakeSwap during the first year of our journey!')}
        </Text>
        <Button
          disabled={isLoading}
          onClick={handleClick}
          endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
        >
          {isLoading ? t('Claiming...') : t('Claim now')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default AnniversaryAchievementModal
