import React from 'react'
import { Card, CardBody, Heading, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import NftSelectionCard from '../components/NftSelectionCard'
import NextStepButton from '../components/NextStepButton'

interface MintProps {
  nextStep: () => void
}

const nft = {
  name: 'Swapsies',
  description: 'These bunnies love nothing more than swapping pancakes. Especially on BSC.',
  originalImage: 'https://gateway.pinata.cloud/ipfs/QmXdHqg3nywpNJWDevJQPtkz93vpfoHcZWQovFz2nmtPf5/swapsies.png',
  previewImage: 'swapsies-preview.png',
  blurImage: 'swapsies-blur.png',
  sortOrder: 999,
  bunnyId: 0,
}

const nft1 = {
  name: 'Drizzle',
  description: "It's raining syrup on this bunny, but he doesn't seem to mind. Can you blame him?",
  originalImage: 'https://gateway.pinata.cloud/ipfs/QmXdHqg3nywpNJWDevJQPtkz93vpfoHcZWQovFz2nmtPf5/drizzle.png',
  previewImage: 'drizzle-preview.png',
  blurImage: 'drizzle-blur.png',
  sortOrder: 999,
  bunnyId: 1,
}

const Mint: React.FC<MintProps> = ({ nextStep }) => {
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
          <NftSelectionCard nft={nft} />
          <NftSelectionCard nft={nft1} isChecked />
        </CardBody>
      </Card>
      <NextStepButton onClick={nextStep}>{TranslateString(999, 'Next Step')}</NextStepButton>
    </>
  )
}

export default Mint
