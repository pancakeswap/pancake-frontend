import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import {
  ChevronRightIcon,
  Button as UIKitButton,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  AutoRenewIcon,
} from '@pancakeswap-libs/uikit'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import useI18n from 'hooks/useI18n'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCake, useRabbitMintingFarm } from 'hooks/useContract'
import nftList from 'config/constants/nfts'
import SelectionCard from '../components/SelectionCard'
import NextStepButton from '../components/NextStepButton'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const starterBunnyIds = [5, 6, 7, 8, 9]
const nfts = nftList.filter((nft) => starterBunnyIds.includes(nft.bunnyId))

const Button = styled(UIKitButton)`
  min-width: 160px;
`

const spinnerIcon = <AutoRenewIcon spin color="currentColor" />

const Mint: React.FC = () => {
  const [bunnyId, setBunnyId] = useState(null)
  const { nextStep } = useContext(ProfileCreationContext)
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
  } = useApproveConfirmTransaction(
    () => {
      const cost = new BigNumber(5).multipliedBy(new BigNumber(10).pow(18)).toJSON()
      return cakeContract.methods.approve(mintingFarmContract.options.address, cost).send({ from: account })
    },
    () => {
      return mintingFarmContract.methods.mintNFT(bunnyId).send({ from: account })
    },
  )

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
                image={nft.previewImage}
                isChecked={bunnyId === nft.bunnyId}
                onChange={handleChange}
                disabled={isApproving || isConfirming || isConfirmed}
              >
                <Text bold>{nft.name}</Text>
              </SelectionCard>
            )
          })}
          <Flex py="8px">
            <Button
              disabled={bunnyId === null || isConfirmed || isConfirming || isApproved}
              onClick={handleApprove}
              endIcon={isApproving ? spinnerIcon : undefined}
              isLoading={isApproving}
            >
              {isApproving ? TranslateString(999, 'Approving') : TranslateString(999, 'Approve')}
            </Button>
            <ChevronRightIcon width="24px" color="textDisabled" />
            <Button
              onClick={handleConfirm}
              disabled={!isApproved || isConfirmed}
              isLoading={isConfirming}
              endIcon={isConfirming ? spinnerIcon : undefined}
            >
              {isConfirming ? TranslateString(999, 'Confirming') : TranslateString(999, 'Confirm')}
            </Button>
          </Flex>
        </CardBody>
      </Card>
      <NextStepButton onClick={nextStep} disabled={!isConfirmed}>
        {TranslateString(999, 'Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
