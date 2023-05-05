import { useEffect, useState, useMemo } from 'react'
import { AutoRenewIcon, Box, Button, Flex, InjectedModalProps, Modal, Text, useToast } from '@pancakeswap/uikit'
import confetti from 'canvas-confetti'
import { useTranslation } from '@pancakeswap/localization'
import delay from 'lodash/delay'
import styled from 'styled-components'
import Dots from 'components/Loader/Dots'
import useSWRImmutable from 'swr/immutable'
import { useAccount } from 'wagmi'
import useCatchTxError from 'hooks/useCatchTxError'
import { useV3AirdropContract } from 'hooks/useContract'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useSWRConfig } from 'swr'

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
}

const GITHUB_ENDPOINT = 'https://raw.githubusercontent.com/pancakeswap/airdrop-v3-users/master'

const V3AirdropModal: React.FC<V3AirdropModalProps> = ({ data, onDismiss }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const [isLoading, setIsLoading] = useState(false)
  const { toastSuccess } = useToast()
  const v3AirdropContract = useV3AirdropContract()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { mutate } = useSWRConfig()

  const { data: v3ForSC } = useSWRImmutable(data && '/airdrop-SC-json')
  const { data: v3MerkleProofs } = useSWRImmutable(data && '/airdrop-Merkle-json')

  const handleClick = async () => {
    setIsLoading(true)
    try {
      let v3ForSCResponse = v3ForSC
      if (!v3ForSCResponse) {
        v3ForSCResponse = await (await fetch(`${GITHUB_ENDPOINT}/forSC.json`)).json()
        mutate('/airdrop-SC-json', v3ForSCResponse, { revalidate: false })
      }
      const { cakeAmountInWei, nft1, nft2 } = v3ForSCResponse?.[account?.toLowerCase()] || {}
      let v3MerkleProofsResponse = v3MerkleProofs
      if (!v3MerkleProofsResponse) {
        v3MerkleProofsResponse = await (await fetch(`${GITHUB_ENDPOINT}/v3MerkleProofs.json`)).json()
        mutate('/airdrop-Merkle-json', v3MerkleProofsResponse, { revalidate: false })
        const proof = v3MerkleProofsResponse?.merkleProofs?.[account?.toLowerCase()] || {}
        const receipt = await fetchWithCatchTxError(() =>
          v3AirdropContract.write.claim([cakeAmountInWei, nft1, nft2, proof], {
            account: v3AirdropContract.account,
            chain: v3AirdropContract.chain,
          }),
        )
        if (receipt?.status) {
          mutate([account, '/airdrop-claimed'])
          toastSuccess(t('Success!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
        }
      }
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
