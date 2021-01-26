import React, { useContext, useState } from 'react'
import { ChevronRightIcon, Button, Card, CardBody, Flex, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import nftList from 'config/constants/nfts'
import NftSelectionCard from '../components/NftSelectionCard'
import NextStepButton from '../components/NextStepButton'
import { ProfileCreationContext } from './contexts/ProfileCreationProvider'

const starterBunnyIds = [5, 6, 7, 8, 9]
const nfts = nftList.filter((nft) => starterBunnyIds.includes(nft.bunnyId))

const Mint: React.FC = () => {
  const [hasMinted, setHasMinted] = useState(false)
  const [bunnyId, setBunnyId] = useState(null)
  const { nextStep } = useContext(ProfileCreationContext)
  const TranslateString = useI18n()

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
              <NftSelectionCard
                key={nft.bunnyId}
                nft={nft}
                isChecked={bunnyId === nft.bunnyId}
                onChange={handleChange}
              />
            )
          })}
          <Flex py="8px">
            <Button disabled={bunnyId === null} onClick={() => setHasMinted(true)}>
              {TranslateString(999, 'Approve')}
            </Button>
            <ChevronRightIcon width="24px" color="textDisabled" />
            <Button disabled>{TranslateString(999, 'Confirmed')}</Button>
          </Flex>
        </CardBody>
      </Card>
      <NextStepButton onClick={nextStep} disabled={!hasMinted}>
        {TranslateString(999, 'Next Step')}
      </NextStepButton>
    </>
  )
}

export default Mint
