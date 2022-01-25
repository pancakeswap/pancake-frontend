import React from 'react'
import styled from 'styled-components'
import {
  Box,
  Flex,
  Grid,
  Text,
  CogIcon,
  SellIcon,
  WalletFilledIcon,
  CameraIcon,
  BinanceIcon,
  Skeleton,
  useModal,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@web3-react/core'
import { useProfile } from 'state/profile/hooks'
import { NftLocation, NftToken } from 'state/nftMarket/types'
import { formatNumber } from 'utils/formatBalance'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import ExpandableCard from '../shared/ExpandableCard'
import SellModal from '../../../components/BuySellModals/SellModal'
import ProfileNftModal from '../../../components/ProfileNftModal'
import { SmallRoundedImage, CollectibleRowContainer } from '../shared/styles'
import useNftsForAddress from '../../../hooks/useNftsForAddress'

const ScrollableContainer = styled(Box)`
  overflow-y: auto;
  max-height: 224px;
`

const Divider = styled.div`
  margin: 16px 20px;
  border-bottom: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
`

const LocationColors = {
  [NftLocation.FORSALE]: 'failure',
  [NftLocation.WALLET]: 'secondary',
  [NftLocation.PROFILE]: 'textSubtle',
}

const LocationIcons = {
  [NftLocation.FORSALE]: SellIcon,
  [NftLocation.WALLET]: WalletFilledIcon,
  [NftLocation.PROFILE]: CameraIcon,
}

interface CollectibleRowProps {
  nft: NftToken
  lowestPrice: string
  onSuccessSale: () => void
}

const CollectibleRow: React.FC<CollectibleRowProps> = ({ nft, lowestPrice, onSuccessSale }) => {
  const { t } = useTranslation()
  const modalVariant = nft.location === NftLocation.WALLET ? 'sell' : 'edit'
  const [onPresentProfileNftModal] = useModal(<ProfileNftModal nft={nft} />)
  const [onPresentModal] = useModal(<SellModal variant={modalVariant} nftToSell={nft} onSuccessSale={onSuccessSale} />)
  return (
    <CollectibleRowContainer
      gridTemplateColumns="96px 1fr"
      px="16px"
      pb="8px"
      my="16px"
      onClick={nft.location === NftLocation.PROFILE ? onPresentProfileNftModal : onPresentModal}
    >
      <SmallRoundedImage src={nft.image.thumbnail} width={64} height={64} mx="16px" />
      <Grid gridTemplateColumns="1fr 1fr">
        <Text bold>{nft.name}</Text>
        <Text fontSize="12px" color="textSubtle" textAlign="right">
          {nft.collectionName}
        </Text>
        {lowestPrice && (
          <>
            <Text small color="textSubtle">
              {t('Lowest price')}
            </Text>
            <Flex justifySelf="flex-end" width="max-content">
              <BinanceIcon width="16px" height="16px" mr="4px" />
              <Text small>{formatNumber(parseFloat(lowestPrice), 0, 5)}</Text>
            </Flex>
          </>
        )}
        {nft.location === NftLocation.FORSALE ? (
          <>
            <Text small color="textSubtle">
              {t('Your price')}
            </Text>
            <Flex justifySelf="flex-end" width="max-content">
              <BinanceIcon width="16px" height="16px" mr="4px" />
              <Text small>{nft.marketData.currentAskPrice}</Text>
            </Flex>
          </>
        ) : (
          <Text small color="textDisabled">
            {t('Not on sale')}
          </Text>
        )}
      </Grid>
    </CollectibleRowContainer>
  )
}

interface CollectiblesByLocationProps {
  location: NftLocation
  nfts: NftToken[]
  lowestPrice: string
  onSuccessSale: () => void
}

const CollectiblesByLocation: React.FC<CollectiblesByLocationProps> = ({
  location,
  nfts,
  lowestPrice,
  onSuccessSale,
}) => {
  const { t } = useTranslation()
  const IconComponent = LocationIcons[location]
  return (
    <Flex flexDirection="column">
      <Grid gridTemplateColumns="32px 1fr" px="16px" pb="8px">
        <IconComponent color={LocationColors[location]} width="24px" height="24px" />
        <Text display="inline" bold color={LocationColors[location]}>
          {t(location)}
        </Text>
      </Grid>
      <ScrollableContainer>
        {nfts.map((nft) => (
          <CollectibleRow key={nft.tokenId} nft={nft} lowestPrice={lowestPrice} onSuccessSale={onSuccessSale} />
        ))}
      </ScrollableContainer>
    </Flex>
  )
}

interface ManagePancakeBunniesCardProps {
  bunnyId: string
  lowestPrice?: string
}

const ManagePancakeBunniesCard: React.FC<ManagePancakeBunniesCardProps> = ({ bunnyId, lowestPrice }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const { isLoading: isProfileLoading, profile } = useProfile()
  const { nfts: userNfts, isLoading, refresh } = useNftsForAddress(account, profile, isProfileLoading)

  const bunniesInWallet = userNfts.filter(
    (nft) => nft.attributes[0].value === bunnyId && nft.location === NftLocation.WALLET,
  )
  const bunniesForSale = userNfts.filter(
    (nft) => nft.attributes[0].value === bunnyId && nft.location === NftLocation.FORSALE,
  )
  const profilePicBunny = userNfts.filter(
    (nft) => nft.attributes[0].value === bunnyId && nft.location === NftLocation.PROFILE,
  )

  const useHasNoBunnies =
    !isLoading && bunniesInWallet.length === 0 && bunniesForSale.length === 0 && profilePicBunny.length === 0
  const totalBunnies = bunniesInWallet.length + bunniesForSale.length + profilePicBunny.length
  const totalBunniesText = account && !useHasNoBunnies ? ` (${totalBunnies})` : ''

  const content = (
    <Box pt="16px">
      {!account && (
        <Flex mb="16px" justifyContent="center">
          <ConnectWalletButton />
        </Flex>
      )}
      {useHasNoBunnies && (
        <Text px="16px" pb="16px" color="textSubtle">
          {t('You don’t have any of this item.')}
        </Text>
      )}
      {account && isLoading && (
        <Box px="16px" pb="8px">
          <Skeleton mb="8px" />
          <Skeleton mb="8px" />
          <Skeleton mb="8px" />
        </Box>
      )}
      {bunniesForSale.length > 0 && (
        <CollectiblesByLocation
          location={NftLocation.FORSALE}
          nfts={bunniesForSale}
          lowestPrice={lowestPrice}
          onSuccessSale={refresh}
        />
      )}
      {bunniesInWallet.length > 0 && (
        <>
          {bunniesForSale.length > 0 && <Divider />}
          <CollectiblesByLocation
            location={NftLocation.WALLET}
            nfts={bunniesInWallet}
            lowestPrice={lowestPrice}
            onSuccessSale={refresh}
          />
        </>
      )}
      {profilePicBunny.length > 0 && (
        <>
          {(bunniesForSale.length > 0 || bunniesInWallet.length > 0) && <Divider />}
          <CollectiblesByLocation
            location={NftLocation.PROFILE}
            nfts={profilePicBunny}
            lowestPrice={lowestPrice}
            onSuccessSale={refresh}
          />
        </>
      )}
    </Box>
  )
  return (
    <ExpandableCard
      title={`${t('Manage Yours')}${totalBunniesText}`}
      icon={<CogIcon width="24px" height="24px" />}
      content={content}
    />
  )
}

export default ManagePancakeBunniesCard
