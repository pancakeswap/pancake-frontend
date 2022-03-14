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
import { NftLocation, NftToken } from 'state/nftMarket/types'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import ExpandableCard from '../shared/ExpandableCard'
import SellModal from '../../../components/BuySellModals/SellModal'
import ProfileNftModal from '../../../components/ProfileNftModal'
import { SmallRoundedImage, CollectibleRowContainer } from '../shared/styles'

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
  onSuccess: () => void
}

const CollectibleRow: React.FC<CollectibleRowProps> = ({ nft, onSuccess }) => {
  const { t } = useTranslation()
  const modalVariant = nft.location === NftLocation.WALLET ? 'sell' : 'edit'
  const [onPresentProfileNftModal] = useModal(<ProfileNftModal nft={nft} />)
  const [onPresentModal] = useModal(<SellModal variant={modalVariant} nftToSell={nft} onSuccessSale={onSuccess} />)
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
          {nft?.collectionName}
        </Text>
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

interface CollectibleByLocationProps {
  nft: NftToken
  onSuccess: () => void
}

const CollectibleByLocation: React.FC<CollectibleByLocationProps> = ({ nft, onSuccess }) => {
  const { t } = useTranslation()
  const IconComponent = LocationIcons[nft.location]
  return (
    <Flex flexDirection="column">
      <Grid gridTemplateColumns="32px 1fr" px="16px" pb="8px">
        <IconComponent color={LocationColors[nft.location]} width="24px" height="24px" />
        <Text display="inline" bold color={LocationColors[nft.location]}>
          {t(nft.location)}
        </Text>
      </Grid>
      <CollectibleRow key={nft.tokenId} nft={nft} onSuccess={onSuccess} />
    </Flex>
  )
}

interface ManageNFTsCardProps {
  nft?: NftToken
  isLoading: boolean
  isOwnNft: boolean
  onSuccess: () => void
}

const ManageNFTsCard: React.FC<ManageNFTsCardProps> = ({ nft, isLoading, isOwnNft, onSuccess }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const hasThisNft = isOwnNft && nft

  const content = (
    <Box pt="16px">
      {!account && (
        <Flex mb="16px" justifyContent="center">
          <ConnectWalletButton />
        </Flex>
      )}
      {account && isLoading && (
        <Box px="16px" pb="8px">
          <Skeleton mb="8px" />
          <Skeleton mb="8px" />
          <Skeleton mb="8px" />
        </Box>
      )}
      {account && !isLoading && !hasThisNft && (
        <Text px="16px" pb="16px" color="textSubtle">
          {t('You don’t have this item.')}
        </Text>
      )}
      {!isLoading && hasThisNft && <CollectibleByLocation nft={nft} onSuccess={onSuccess} />}
    </Box>
  )
  return <ExpandableCard title={t('Manage Yours')} icon={<CogIcon width="24px" height="24px" />} content={content} />
}

export default ManageNFTsCard
