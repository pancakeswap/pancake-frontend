import { Box, Button, Flex, InjectedModalProps, Modal, Text, TwitterIcon } from '@pancakeswap/uikit'
import confetti from 'canvas-confetti'
import { useTranslation } from 'contexts/Localization'
import delay from 'lodash/delay'
import { useEffect } from 'react'
import styled from 'styled-components'

const NFTImage = styled.img`
  border-radius: 12px;
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

const GalaxyNFTClaimModal: React.FC<InjectedModalProps & { cid: number }> = ({ onDismiss }) => {
  const { t } = useTranslation()

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  return (
    <Modal title={t('Congratulations!')} onDismiss={onDismiss}>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Box>
          <NFTImage src="https://cdn.galaxy.eco/galaxy/assets/pancakeswap/1651655250130414893.png" />
        </Box>
        <Text textAlign="center" bold color="secondary" maxWidth="400px" fontSize="16px" mb="16px">
          {t('Hello, early fixed-term staking pool CAKE lovers.')}
        </Text>
        <Text textAlign="center" maxWidth="400px" mb="12px">
          {t(
            'If you staked in our fixed-term staking pool for 52 weeks within the first 24 hours of the launch, you are eligible to claim a special edition “Project Galaxy x PancakeSwap” NFT.',
          )}
        </Text>
        <Text textAlign="center" maxWidth="400px" mb="12px">
          {t(
            'Hold this NFT in your wallet until the snapshot timing (10:00 UTC 11th May 2022) to participate in the $GAL airdrop with a total of 400,000 GAL tokens.',
          )}
        </Text>
        <Button
          variant="secondary"
          mb="24px"
          scale="sm"
          as="a"
          href="https://twitter.com/PancakeSwap/status/1521825079591845888"
          rel="noreferrer noopener"
          target="_blank"
        >
          <TwitterIcon color="primary" mr="4px" />
          {t('Learn More')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default GalaxyNFTClaimModal
