import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Box, Button, Flex, Modal, ModalV2, Text, useToast } from '@pancakeswap/uikit'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import confetti from 'canvas-confetti'
import Dots from 'components/Loader/Dots'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useV3AirdropContract } from 'hooks/useContract'
import { useShowOnceAirdropModal } from 'hooks/useShowOnceAirdropModal'
import delay from 'lodash/delay'
import { useEffect, useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { useAccount } from 'wagmi'
import useAirdropModalStatus from './hooks/useAirdropModalStatus'

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

const GITHUB_ENDPOINT = 'https://raw.githubusercontent.com/pancakeswap/airdrop-v3-users/master'

const V3AirdropModal: React.FC = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { toastSuccess, toastError } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const queryClient = useQueryClient()
  const v3AirdropContract = useV3AirdropContract()
  const { shouldShowModal, v3WhitelistAddress } = useAirdropModalStatus()
  const [showOnceAirdropModal, setShowOnceAirdropModal] = useShowOnceAirdropModal()

  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const data = useMemo(
    () => (account ? (v3WhitelistAddress?.[account.toLowerCase()] as WhitelistType) : undefined),
    [account, v3WhitelistAddress],
  )

  const { data: v3ForSC } = useQuery({
    queryKey: ['/airdrop-SC-json'],
    enabled: Boolean(data),
  })
  const { data: v3MerkleProofs } = useQuery({
    queryKey: ['/airdrop-Merkle-json'],
    enabled: Boolean(data),
  })

  useEffect(() => {
    if (shouldShowModal && showOnceAirdropModal) {
      setShow(true)
      delay(showConfetti, 100)
    } else {
      setShow(false)
    }
  }, [account, shouldShowModal, showOnceAirdropModal, v3WhitelistAddress])

  const handleCloseModal = () => {
    if (showOnceAirdropModal) {
      setShowOnceAirdropModal(!showOnceAirdropModal)
    }
    setShow(false)
  }

  const handleClick = async () => {
    setIsLoading(true)
    try {
      let v3ForSCResponse = v3ForSC
      if (!v3ForSCResponse) {
        v3ForSCResponse = await (await fetch(`${GITHUB_ENDPOINT}/forSC.json`)).json()
        queryClient
          .getQueryCache()
          .find({
            queryKey: ['/airdrop-SC-json'],
          })
          ?.setData(v3ForSCResponse)
      }
      const { cakeAmountInWei, nft1, nft2 } = (account && v3ForSCResponse?.[account?.toLowerCase()]) || {}
      let v3MerkleProofsResponse = v3MerkleProofs as { merkleProofs: { [account: string]: any } }
      if (!v3MerkleProofsResponse) {
        v3MerkleProofsResponse = await (await fetch(`${GITHUB_ENDPOINT}/v3MerkleProofs.json`)).json()
        queryClient
          .getQueryCache()
          .find({
            queryKey: ['/airdrop-Merkle-json'],
          })
          ?.setData(v3MerkleProofsResponse)
        const proof = account ? v3MerkleProofsResponse?.merkleProofs?.[account?.toLowerCase()] || {} : {}
        const receipt = v3AirdropContract.account
          ? await fetchWithCatchTxError(() =>
              v3AirdropContract.write.claim([cakeAmountInWei, nft1, nft2, proof], {
                account: v3AirdropContract.account!,
                chain: v3AirdropContract.chain,
              }),
            )
          : undefined
        if (receipt?.status) {
          if (showOnceAirdropModal) {
            setShowOnceAirdropModal(!showOnceAirdropModal)
          }
          queryClient.invalidateQueries({
            queryKey: [account, '/airdrop-claimed'],
          })
          toastSuccess(t('Success!'), <ToastDescriptionWithTx txHash={receipt.transactionHash} />)
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
    <ModalV2 isOpen={show} onDismiss={handleCloseModal} closeOnOverlayClick>
      <Modal title={t('Congratulations!')}>
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
                <Button
                  m="12px 0"
                  disabled={isLoading}
                  onClick={handleClick}
                  endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
                >
                  {isLoading ? <Dots>{t('Claiming')}</Dots> : t('Claim now')}
                </Button>
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
                <Button
                  m="12px 0"
                  disabled={isLoading}
                  onClick={handleClick}
                  endIcon={isLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
                >
                  {isLoading ? <Dots>{t('Claiming')}</Dots> : t('Claim now')}
                </Button>
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
        </Flex>
      </Modal>
    </ModalV2>
  )
}

export default V3AirdropModal
