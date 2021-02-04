import React, { useState } from 'react'
import BigNumber from 'bignumber.js'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCake, useRabbitMintingFarm } from 'hooks/useContract'
import nftList from 'config/constants/nfts'
import SelectionCard from '../components/SelectionCard'
import NextStepButton from '../components/NextStepButton'
import ApproveConfirmButtons from '../components/ApproveConfirmButtons'
import useProfileCreation from './contexts/hook'

const starterBunnyIds = [5, 6, 7, 8, 9]
const nfts = nftList.filter((nft) => starterBunnyIds.includes(nft.bunnyId))

const Mint: React.FC = () => {
  const [bunnyId, setBunnyId] = useState(null)
  const { actions, minimumCakeRequired, allowance } = useProfileCreation()
  const { account } = useWallet()
  const cakeContract = useCake()
  const mintingFarmContract = useRabbitMintingFarm()
  const TranslateString = useI18n()
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
        const response = await cakeContract.methods.allowance(account, mintingFarmContract.options.address).call()
        const currentAllowance = new BigNumber(response)
        return currentAllowance.gte(minimumCakeRequired)
      } catch (error) {
        return false
      }
    },
    onApprove: () => {
      return cakeContract.methods
        .approve(mintingFarmContract.options.address, allowance.toJSON())
        .send({ from: account })
    },
    onConfirm: () => {
      return mintingFarmContract.methods.mintNFT(bunnyId).send({ from: account })
    },
    onSuccess: () => actions.nextStep(),
  })

  return (
    <>
      <Text fontSize="20px" color="textSubtle" bold>
        {TranslateString(999, `Step ${1}`)}
      </Text>
      <Heading as="h3" size="xl" mb="24px">
        {TranslateString(999, 'Get Starter Collectible')}
      </Heading>
      <Text as="p">{TranslateString(999, 'Every profile starts by making a “starter” collectible (NFT).')}</Text>
      <Text as="p">{TranslateString(999, 'This starter will also become your first profile picture.')}</Text>
      <Text as="p" mb="24px">
        {TranslateString(999, 'You can change your profile pic later if you get another approved Pancake Collectible.')}
      </Text>
      <Card mb="24px">
        <CardBody>
          <Heading as="h4" size="lg" mb="8px">
            {TranslateString(999, 'Choose your Starter!')}
          </Heading>
          <Text as="p" color="textSubtle">
            {TranslateString(999, 'Choose wisely: you can only ever make one starter collectible!')}
          </Text>
          <Text as="p" mb="24px" color="textSubtle">
            {TranslateString(999, 'Cost: 5 CAKE')}
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
                disabled={isApproving || isConfirming || isConfirmed}
              >
                <Text bold>{nft.name}</Text>
              </SelectionCard>
            )
          })}
          <ApproveConfirmButtons
            isApproveDisabled={bunnyId === null || isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={!isApproved || isConfirmed}
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
        </CardBody>
      </Card>
      <NextStepButton onClick={actions.nextStep} disabled={!isConfirmed}>
        {TranslateString(999, 'Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
