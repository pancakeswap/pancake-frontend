import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import useI18n from 'hooks/useI18n'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCake, useBunnyFactory } from 'hooks/useContract'
import useHasCakeBalance from 'hooks/useHasCakeBalance'
import nftList from 'config/constants/nfts'
import SelectionCard from '../components/SelectionCard'
import NextStepButton from '../components/NextStepButton'
import ApproveConfirmButtons from '../components/ApproveConfirmButtons'
import useProfileCreation from './contexts/hook'
import { MINT_COST, STARTER_BUNNY_IDS } from './config'

const nfts = nftList.filter((nft) => STARTER_BUNNY_IDS.includes(nft.bunnyId))
const minimumCakeBalanceToMint = new BigNumber(MINT_COST).multipliedBy(new BigNumber(10).pow(18))

const Mint: React.FC = () => {
  const [bunnyId, setBunnyId] = useState(null)
  const { actions, minimumCakeRequired, allowance } = useProfileCreation()

  const { account } = useWeb3React()
  const cakeContract = useCake()
  const bunnyFactoryContract = useBunnyFactory()
  const TranslateString = useI18n()
  const hasMinimumCakeRequired = useHasCakeBalance(minimumCakeBalanceToMint)
  const {
    isApproving,
    isApproved,
    isConfirmed,
    isConfirming,
    handleApprove,
    handleConfirm,
  } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      // TODO: Move this to a helper, this check will be probably be used many times
      try {
        const response = await cakeContract.methods.allowance(account, bunnyFactoryContract.options.address).call()
        const currentAllowance = new BigNumber(response)
        return currentAllowance.gte(minimumCakeRequired)
      } catch (error) {
        return false
      }
    },
    onApprove: () => {
      return cakeContract.methods
        .approve(bunnyFactoryContract.options.address, allowance.toJSON())
        .send({ from: account })
    },
    onConfirm: () => {
      return bunnyFactoryContract.methods.mintNFT(bunnyId).send({ from: account })
    },
    onSuccess: () => actions.nextStep(),
  })

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {TranslateString(999, `Step ${1}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {TranslateString(776, 'Get Starter Collectible')}
      </Heading>
      <Text as="p">{TranslateString(786, 'Every profile starts by making a “starter” collectible (NFT).')}</Text>
      <Text as="p">{TranslateString(788, 'This starter will also become your first profile picture.')}</Text>
      <Text as="p" mb="24px">
        {TranslateString(790, 'You can change your profile pic later if you get another approved Pancake Collectible.')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {TranslateString(792, 'Choose your Starter!')}
          </Heading>
          <Text as="p" color="textSubtle">
            {TranslateString(794, 'Choose wisely: you can only ever make one starter collectible!')}
          </Text>
          <Text as="p" mb="24px" color="textSubtle">
            {TranslateString(999, `Cost: ${MINT_COST} CAKE`, { num: MINT_COST })}
          </Text>
          {nfts.map((nft) => {
            const handleChange = (value: string) => setBunnyId(parseInt(value, 10))

            return (
              <SelectionCard
                key={nft.bunnyId}
                name="mintStarter"
                value={nft.bunnyId}
                image={`/images/nfts/${nft.images.md}`}
                isChecked={bunnyId === nft.bunnyId}
                onChange={handleChange}
                disabled={isApproving || isConfirming || isConfirmed || !hasMinimumCakeRequired}
              >
                <Text bold>{nft.name}</Text>
              </SelectionCard>
            )
          })}
          {!hasMinimumCakeRequired && (
            <Text color="failure" mb="16px">
              {TranslateString(1098, `A minimum of ${MINT_COST} CAKE is required`)}
            </Text>
          )}
          <ApproveConfirmButtons
            isApproveDisabled={bunnyId === null || isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={!isApproved || isConfirmed || !hasMinimumCakeRequired}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!isConfirmed}>
        {TranslateString(798, 'Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
