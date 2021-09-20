import React, { useState } from 'react'
import { formatUnits } from '@ethersproject/units'
import { Card, CardBody, Heading, Text } from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { fetchWalletNfts } from 'state/collectibles'
import { useAppDispatch } from 'state'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCake, useBunnyFactory } from 'hooks/useContract'
import { Nft } from 'config/constants/nfts/types'
import { FetchStatus, useGetCakeBalance } from 'hooks/useTokenBalance'
import nftList from 'config/constants/nfts'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import useToast from 'hooks/useToast'
import SelectionCard from './SelectionCard'
import NextStepButton from './NextStepButton'
import useProfileCreation from './contexts/hook'
import { MINT_COST, STARTER_BUNNY_IDENTIFIERS } from './config'

// TODO: Once collections API is no longer returning dummy data - migrate this away from using static nft config
const nfts = nftList.pancake.filter((nft) => STARTER_BUNNY_IDENTIFIERS.includes(nft.identifier))

const Mint: React.FC = () => {
  const [variationId, setVariationId] = useState<Nft['id']>(null)
  const { actions, minimumCakeRequired, allowance } = useProfileCreation()
  const { toastSuccess } = useToast()

  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const cakeContract = useCake()
  const bunnyFactoryContract = useBunnyFactory()
  const { t } = useTranslation()
  const { balance: cakeBalance, fetchStatus } = useGetCakeBalance()
  const hasMinimumCakeRequired = fetchStatus === FetchStatus.SUCCESS && cakeBalance.gte(MINT_COST)
  const { callWithGasPrice } = useCallWithGasPrice()

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        // TODO: Move this to a helper, this check will be probably be used many times
        try {
          const response = await cakeContract.allowance(account, bunnyFactoryContract.address)
          return response.gte(minimumCakeRequired)
        } catch (error) {
          return false
        }
      },
      onApprove: () => {
        return callWithGasPrice(cakeContract, 'approve', [bunnyFactoryContract.address, allowance.toString()])
      },
      onConfirm: () => {
        return callWithGasPrice(bunnyFactoryContract, 'mintNFT', [variationId])
      },
      onSuccess: () => {
        dispatch(fetchWalletNfts(account))
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
          {nfts.map((nft) => {
            const handleChange = (value: string) => setVariationId(Number(value))

            return (
              <SelectionCard
                key={nft.identifier}
                name="mintStarter"
                value={nft.id}
                image={`/images/nfts/${nft.images.md}`}
                isChecked={variationId === nft.id}
                onChange={handleChange}
                disabled={isApproving || isConfirming || isConfirmed || !hasMinimumCakeRequired}
              >
                <Text bold>{nft.name}</Text>
              </SelectionCard>
            )
          })}
          {!hasMinimumCakeRequired && (
            <Text color="failure" mb="16px">
              {t('A minimum of %num% CAKE is required', { num: formatUnits(MINT_COST) })}
            </Text>
          )}
          <ApproveConfirmButtons
            isApproveDisabled={variationId === null || isConfirmed || isConfirming || isApproved}
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
