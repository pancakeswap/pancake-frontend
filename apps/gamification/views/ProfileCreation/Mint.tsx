import { useTranslation } from '@pancakeswap/localization'
import { bscTokens } from '@pancakeswap/tokens'
import { Card, CardBody, Flex, Heading, Image, Text, useMatchBreakpoints, useToast } from '@pancakeswap/uikit'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { ASSET_CDN } from 'config/constants/endpoints'
import { FetchStatus } from 'config/constants/types'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useBunnyFactory } from 'hooks/useContract'
import { useBSCCakeBalance } from 'hooks/useTokenBalance'
import { useEffect, useState } from 'react'
import { getBunnyFactoryAddress } from 'utils/addressHelpers'
import { pancakeBunniesAddress } from 'views/ProfileCreation/Nft/constants'
import { getNftsFromCollectionApi } from 'views/ProfileCreation/Nft/helpers'
import { ApiSingleTokenData } from 'views/ProfileCreation/Nft/type'

import NextStepButton from './NextStepButton'
import SelectionCard from './SelectionCard'
import { MINT_COST, STARTER_NFT_BUNNY_IDS } from './config'
import useProfileCreation from './contexts/hook'

interface MintNftData extends ApiSingleTokenData {
  bunnyId?: string
}

const Mint: React.FC<React.PropsWithChildren> = () => {
  const [selectedBunnyId, setSelectedBunnyId] = useState<string>('')
  const [starterNfts, setStarterNfts] = useState<MintNftData[]>([])
  const { actions, allowance } = useProfileCreation()
  const { toastSuccess } = useToast()
  const { isMobile } = useMatchBreakpoints()

  const bunnyFactoryContract = useBunnyFactory()
  const { t } = useTranslation()
  const { balance: cakeBalance, fetchStatus } = useBSCCakeBalance()
  const hasMinimumCakeRequired = fetchStatus === FetchStatus.Fetched && cakeBalance >= MINT_COST
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
      }).filter((nft) => nft !== undefined) as MintNftData[]

      setStarterNfts(nfts)
      setSelectedBunnyId(nfts?.[0]?.bunnyId ?? '')
    }
    if (starterNfts.length === 0) {
      getStarterNfts()
    }
  }, [starterNfts])

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      token: bscTokens.cake,
      spender: getBunnyFactoryAddress(),
      minAmount: MINT_COST,
      targetAmount: allowance,
      onConfirm: () => {
        return callWithGasPrice(bunnyFactoryContract, 'mintNFT', [Number(selectedBunnyId)])
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
          <Flex padding="24px 0" flexDirection="column">
            <Text fontSize={['24px']} bold textAlign="center" mb="24px">
              {t('Get your Starter!')}
            </Text>
            <Image
              alt="make-profile"
              width={isMobile ? 240 : 288}
              height={isMobile ? 80 : 100}
              style={{
                margin: 'auto',
                minWidth: isMobile ? 240 : 288,
              }}
              src={`${ASSET_CDN}/gamification/images/make-profile.png`}
            />
            <Text mt="24px" textAlign="center">
              {t('It’ll only cost a tiny bit for gas fees.')}
            </Text>
          </Flex>
          {starterNfts?.map?.((nft) => {
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
