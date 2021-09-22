import React from 'react'
import styled from 'styled-components'
import {
  Box,
  Flex,
  Grid,
  Text,
  Image,
  CogIcon,
  SellIcon,
  WalletFilledIcon,
  CameraIcon,
  BinanceIcon,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import ExpandableCard from './ExpandableCard'
import { NFTLocation, UserCollectibles, Collectible } from './types'

const RoundedImage = styled(Image)`
  & > img {
    border-radius: ${({ theme }) => theme.radii.default};
  }
`

const ScrollableContainer = styled(Box)`
  overflow-y: auto;
  max-height: 224px;
`

const Divider = styled.div`
  margin: 16px 20px;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
`

const LocationColors = {
  [NFTLocation.FOR_SALE]: 'failure',
  [NFTLocation.IN_WALLET]: 'secondary',
  [NFTLocation.PROFILE_PIC]: 'textSubtle',
}

const LocationIcons = {
  [NFTLocation.FOR_SALE]: SellIcon,
  [NFTLocation.IN_WALLET]: WalletFilledIcon,
  [NFTLocation.PROFILE_PIC]: CameraIcon,
}

interface CollectibleRowProps {
  collectible: Collectible
}

const CollectibleRow: React.FC<CollectibleRowProps> = ({ collectible }) => {
  const { t } = useTranslation()
  return (
    <Grid gridTemplateColumns="96px 1fr" px="16px" pb="8px" my="16px">
      <RoundedImage src={collectible.nft.images.ipfs} width={64} height={64} mx="16px" />
      <Grid gridTemplateColumns="1fr 1fr">
        <Text bold>{collectible.nft.name}</Text>
        <Text fontSize="12px" color="textSubtle" textAlign="right">
          {collectible.name}
        </Text>
        <Text small color="textSubtle">
          {t('Lowest price')}
        </Text>
        <Flex justifySelf="flex-end" width="max-content">
          <BinanceIcon width="16px" height="16px" mr="4px" />
          <Text small>{collectible.lowestCost}</Text>
        </Flex>
        {collectible.status === 'selling' ? (
          <>
            <Text small color="textSubtle">
              {t('Your price')}
            </Text>
            <Flex justifySelf="flex-end" width="max-content">
              <BinanceIcon width="16px" height="16px" mr="4px" />
              <Text small>{collectible.cost}</Text>
            </Flex>
          </>
        ) : (
          <Text small color="textDisabled">
            {t('Not for sale')}
          </Text>
        )}
      </Grid>
    </Grid>
  )
}

interface CollectiblesByLocationProps {
  location: NFTLocation
  collectibles: Collectible[]
}

const CollectiblesByLocation: React.FC<CollectiblesByLocationProps> = ({ location, collectibles }) => {
  const IconComponent = LocationIcons[location]
  return (
    <Flex flexDirection="column">
      <Grid gridTemplateColumns="32px 1fr" px="16px" pb="8px">
        <IconComponent color={LocationColors[location]} width="24px" height="24px" />
        <Text display="inline" bold color={LocationColors[location]}>
          {location}
        </Text>
      </Grid>
      <ScrollableContainer>
        {collectibles.map((collectible, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <CollectibleRow key={index} collectible={collectible} />
        ))}
      </ScrollableContainer>
    </Flex>
  )
}

interface ManageCardProps {
  userCollectibles: UserCollectibles
}

const ManageCard: React.FC<ManageCardProps> = ({ userCollectibles }) => {
  const { t } = useTranslation()
  const content = (
    <Box pt="16px">
      <CollectiblesByLocation location={NFTLocation.FOR_SALE} collectibles={userCollectibles[NFTLocation.FOR_SALE]} />
      <Divider />
      <CollectiblesByLocation location={NFTLocation.IN_WALLET} collectibles={userCollectibles[NFTLocation.IN_WALLET]} />
      <Divider />
      <CollectiblesByLocation
        location={NFTLocation.PROFILE_PIC}
        collectibles={userCollectibles[NFTLocation.PROFILE_PIC]}
      />
    </Box>
  )
  return <ExpandableCard title={t('Manage Yours')} icon={<CogIcon width="24px" height="24px" />} content={content} />
}

export default ManageCard
