import { useState, useEffect } from 'react'
import { formatUnits } from '@ethersproject/units'
import { Card, CardBody, Heading, Text, useToast } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCake, useBunnyFactory } from 'hooks/useContract'
import { useGetCakeBalance } from 'hooks/useTokenBalance'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { getNftsFromCollectionApi } from 'state/nftMarket/helpers'
import { ApiSingleTokenData } from 'state/nftMarket/types'
import { pancakeBunniesAddress } from 'views/Nft/market/constants'
import { requiresApproval } from 'utils/requiresApproval'
import { FetchStatus } from 'config/constants/types'
import SelectionCard from './SelectionCard'
import NextStepButton from './NextStepButton'
import useProfileCreation from './contexts/hook'
import { MINT_COST, STARTER_NFT_BUNNY_IDS } from './config'

interface MintNftData extends ApiSingleTokenData {
  bunnyId?: string
}

const Mint: React.FC<React.PropsWithChildren> = () => {
  const [selectedBunnyId, setSelectedBunnyId] = useState<string>('')
  const [starterNfts, setStarterNfts] = useState<MintNftData[]>([])
  const { actions, minimumCakeRequired, allowance } = useProfileCreation()
  const { toastSuccess } = useToast()

  const { address: account } = useAccount()
  const { reader: cakeContractReader, signer: cakeContractApprover } = useCake()
  const bunnyFactoryContract = useBunnyFactory()
  const { t } = useTranslation()
  const { balance: cakeBalance, fetchStatus } = useGetCakeBalance()
  const hasMinimumCakeRequired = fetchStatus === FetchStatus.Fetched && cakeBalance.gte(MINT_COST)
  const { callWithGasPrice } = useCallWithGasPrice()

  useEffect(() => {
    const getStarterNfts = async () => {
      const response = await getNftsFromCollectionApi(pancakeBunniesAddress)
      if (!response) return
      const { data: allPbTokens } = response
      const nfts = STARTER_NFT_BUNNY_IDS.map((bunnyId) => {
        if (allPbTokens && allPbTokens[bunnyId]) {
          return { ...allPbTokens[bunnyId], bunnyId }
        }
        return undefined
      })
      setStarterNfts(nfts)
    }
    if (starterNfts.length === 0) {
      getStarterNfts()
    }
  }, [starterNfts])

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        return requiresApproval(cakeContractReader, account, bunnyFactoryContract.address, minimumCakeRequired)
      },
      onApprove: () => {
        return callWithGasPrice(cakeContractApprover, 'approve', [bunnyFactoryContract.address, allowance.toString()])
      },
      onConfirm: () => {
        return callWithGasPrice(bunnyFactoryContract, 'mintNFT', [selectedBunnyId])
      },
      onApproveSuccess: () => {
        toastSuccess(t('Enabled'), t("Press 'confirm' to mint this NFT"))
      },
      onSuccess: () => {
        toastSuccess(t('Success'), t('You have minted your starter NFT'))
        actions.nextStep()
      },
    })

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {t('Step %num%', { num: 1 })}
      </Text>
      <Heading as="h3" scale="xl" mb="24px">
        {t('Get Starter Collectible')}
      </Heading>
      <Text as="p">{t('Every profile starts by making a “starter” collectible (NFT).')}</Text>
      <Text as="p">{t('This starter will also become your first profile picture.')}</Text>
      <Text as="p" mb="24px">
        {t('You can change your profile pic later if you get another approved Pancake Collectible.')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" scale="lg" mb="8px">
            {t('Choose your Starter!')}
          </Heading>
          <Text as="p" color="textSubtle">
            {t('Choose wisely: you can only ever make one starter collectible!')}
          </Text>
          <Text as="p" mb="24px" color="textSubtle">
            {t('Cost: %num% CAKE', { num: formatUnits(MINT_COST) })}
          </Text>
          {starterNfts.map((nft) => {
            const handleChange = (value: string) => setSelectedBunnyId(value)

            return (
              <SelectionCard
                key={nft?.name}
                name="mintStarter"
                value={nft?.bunnyId}
                image={nft?.image.thumbnail}
                isChecked={selectedBunnyId === nft?.bunnyId}
                onChange={handleChange}
                disabled={isApproving || isConfirming || isConfirmed || !hasMinimumCakeRequired}
              >
                <Text bold>{nft?.name}</Text>
              </SelectionCard>
            )
          })}
          {!hasMinimumCakeRequired && (
            <Text color="failure" mb="16px">
              {t('A minimum of %num% CAKE is required', { num: formatUnits(MINT_COST) })}
            </Text>
          )}
          <ApproveConfirmButtons
            isApproveDisabled={selectedBunnyId === null || isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={!isApproved || isConfirmed || !hasMinimumCakeRequired}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!isConfirmed}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
