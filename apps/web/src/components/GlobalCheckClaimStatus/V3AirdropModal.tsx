import { useEffect, useState, useMemo } from 'react'
import { AutoRenewIcon, Box, Button, Flex, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import confetti from 'canvas-confetti'
import { useTranslation } from '@pancakeswap/localization'
import delay from 'lodash/delay'
import styled from 'styled-components'
import Dots from 'components/Loader/Dots'

const Image = styled.img`
  display: block;
  height: 128px;
  width: 128px;
  margin: auto auto 10px auto;
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

type CurrencyType = 'btcb' | 'busd' | 'eth' | 'usdt'
type WhiteListCurrencyType = 't1' | 't2' | 't3' | 't4'

enum TierType {
  t1 = 'Tier 1',
  t2 = 'Tier 2',
  t3 = 'Tier 3',
  t4 = 'Tier 4',
}

export interface WhitelistType {
  part1: {
    [currency in CurrencyType]: null | WhiteListCurrencyType
  }
  part2: {
    [currency in CurrencyType]: null | WhiteListCurrencyType
  }
}

interface V3AirdropModalProps extends InjectedModalProps {
  data: WhitelistType
  onClick: () => Promise<void>
}

const V3AirdropModal: React.FC<V3AirdropModalProps> = ({ data, onDismiss, onClick }) => {
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

  const hasPart1 = useMemo(() => (data ? Object.values(data.part1).find((i) => i !== null) : false), [data])
  const hasPart2 = useMemo(() => (data ? Object.values(data.part2).find((i) => i !== null) : false), [data])

  const textDisplay = (): string => {
    if (hasPart1 && hasPart2) {
      return t(
        'You have received an exclusive v3 Legendary and v3 Early Supporter NFT, as well as a CAKE airdrop for participating in the PancakeSwap v3 Launch campaign. Claim your reward now and enjoy the benefits of being an early adopter!',
      )
    }
    if (hasPart1) {
      return t(
        'You have received an exclusive v3 Legendary NFT and CAKE airdrop for participating in the PancakeSwap v3 Launch campaign. Claim your reward now and enjoy the benefits of being an early adopter!',
      )
    }
    return t(
      'You have received an exclusive v3 Early Supporter NFT and CAKE airdrop for participating in the PancakeSwap v3 Launch campaign. Claim your reward now and enjoy the benefits of being an early adopter!',
    )
  }

  return (
    <Modal title={t('Congratulations!')} onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxWidth={['100%', '100%', '100%', '450px']}
      >
        <Flex width="100%" justifyContent="space-between">
          {hasPart1 && (
            <Flex width="100%" flexDirection="column">
              <Box>
                <Image src="/images/nfts/v3-part1.jpg" />
              </Box>
              <Text textAlign="center" bold>
                {t('Part 1')}
              </Text>
              <Box>
                {data?.part1.btcb && (
                  <Text fontSize="14px" textAlign="center">{`BTCB/WBNB ${t(TierType[data.part1.btcb])}`}</Text>
                )}
                {data?.part1.busd && (
                  <Text fontSize="14px" textAlign="center">{`BUSD/WBNB ${t(TierType[data.part1.busd])}`}</Text>
                )}
                {data?.part1.eth && (
                  <Text fontSize="14px" textAlign="center">{`ETH/WBNB ${t(TierType[data.part1.eth])}`}</Text>
                )}
                {data?.part1.usdt && (
                  <Text fontSize="14px" textAlign="center">{`USDT/WBNB ${t(TierType[data.part1.usdt])}`}</Text>
                )}
              </Box>
            </Flex>
          )}
          {hasPart2 && (
            <Flex width="100%" flexDirection="column">
              <Box>
                <Image src="/images/nfts/v3-part2.jpg" />
              </Box>
              <Text textAlign="center" bold>
                {t('Part 2')}
              </Text>
              <Box>
                {data?.part2.btcb && (
                  <Text fontSize="14px" textAlign="center">{`BTCB/WBNB ${t(TierType[data.part2.btcb])}`}</Text>
                )}
                {data?.part2.busd && (
                  <Text fontSize="14px" textAlign="center">{`BUSD/WBNB ${t(TierType[data.part2.busd])}`}</Text>
                )}
                {data?.part2.eth && (
                  <Text fontSize="14px" textAlign="center">{`ETH/WBNB ${t(TierType[data.part2.eth])}`}</Text>
                )}
                {data?.part2.usdt && (
                  <Text fontSize="14px" textAlign="center">{`USDT/WBNB ${t(TierType[data.part2.usdt])}`}</Text>
                )}
              </Box>
            </Flex>
          )}
        </Flex>
        <Text textAlign="center" bold color="secondary" mt="24px">
          {textDisplay()}
        </Text>
        <Button
          mt="24px"
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
