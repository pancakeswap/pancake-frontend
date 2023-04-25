import { AutoRenewIcon, Box, Button, Flex, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import confetti from 'canvas-confetti'
import { useTranslation } from '@pancakeswap/localization'
import delay from 'lodash/delay'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Dots from 'components/Loader/Dots'

const AnniversaryImage = styled.img`
  display: block;
  height: 128px;
  width: 128px;
  margin: auto;
  border-radius: 50%;
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

interface V3AirdropModalProps extends InjectedModalProps {
  onClick: () => Promise<void>
}

const V3AirdropModal: React.FC<V3AirdropModalProps> = ({ onDismiss, onClick }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onClick()
    } finally {
      onDismiss()
    }
  }

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  return (
    <Modal title={t('Congratulations!')} onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" maxWidth="450px">
        <Flex width="100%" flexDirection="column" justifyContent="flex-start">
          <Box>
            <AnniversaryImage src="/images/nfts/v3-part1.jpg" />
          </Box>
          <Text textAlign="left" bold>
            {t('Part 1')}
          </Text>
          <Box>
            <Text fontSize="14px">BUSD/WBNB Tier 1</Text>
            <Text fontSize="14px">USDT/WBNB Tier 2</Text>
            <Text fontSize="14px">BTCB/WBNB Tier 3</Text>
            <Text fontSize="14px">ETH/WBNB Tier 4</Text>
          </Box>
        </Flex>
        <Flex width="100%" flexDirection="column" justifyContent="flex-start" mt="24px">
          <Box>
            <AnniversaryImage src="/images/nfts/v3-part2.jpg" />
          </Box>
          <Text textAlign="left" bold>
            {t('Part 2')}
          </Text>
          <Box>
            <Text fontSize="14px">BUSD/WBNB Tier 1</Text>
            <Text fontSize="14px">USDT/WBNB Tier 2</Text>
            <Text fontSize="14px">BTCB/WBNB Tier 3</Text>
            <Text fontSize="14px">ETH/WBNB Tier 4</Text>
          </Box>
        </Flex>
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

export default V3AirdropModal
