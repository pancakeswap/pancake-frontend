import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Box, Button, Card, CardBody, Flex, Heading, Image, Text, useToast } from '@pancakeswap/uikit'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useBunnyFactory } from 'hooks/useContract'
import { useEffect, useState } from 'react'
import { pancakeBunniesAddress } from 'views/ProfileCreation/Nft/constants'
import { getNftsFromCollectionApi } from 'views/ProfileCreation/Nft/helpers'
import { ApiSingleTokenData } from 'views/ProfileCreation/Nft/type'

import NextStepButton from './NextStepButton'
import { STARTER_NFT_BUNNY_IDS } from './config'
import useProfileCreation from './contexts/hook'

interface MintNftData extends ApiSingleTokenData {
  bunnyId?: string
}

const Mint: React.FC<React.PropsWithChildren> = () => {
  const [selectedBunnyId, setSelectedBunnyId] = useState<string>('')
  const [starterNfts, setStarterNfts] = useState<MintNftData[]>([])
  const { actions } = useProfileCreation()
  const { toastSuccess } = useToast()

  const bunnyFactoryContract = useBunnyFactory()
  const { t } = useTranslation()
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

  const { isConfirmed, isConfirming, handleConfirm } = useApproveConfirmTransaction({
    onConfirm: () => {
      return callWithGasPrice(bunnyFactoryContract, 'mintNFT', [Number(selectedBunnyId)])
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
            <Box borderRadius="24px" overflow="hidden" width={88} height={88} margin="auto">
              <Image alt="picked-new-profile" width={88} height={88} src={starterNfts?.[0]?.image.thumbnail} />
            </Box>
            <Text mt="24px" textAlign="center">
              {t('Here is your starter, congratulations!')}
            </Text>
          </Flex>

          <Box width="fit-content" margin="auto">
            <Button
              disabled={isConfirmed}
              isLoading={isConfirming}
              endIcon={isConfirming ? <AutoRenewIcon spin color="currentColor" /> : undefined}
              onClick={handleConfirm}
            >
              {isConfirming ? t('Confirming') : t('Confirm')}
            </Button>
          </Box>
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!isConfirmed}>
        {t('Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
