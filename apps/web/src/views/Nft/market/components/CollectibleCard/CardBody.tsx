import { useTranslation } from '@pancakeswap/localization'
import { Box, CardBody, Flex, Text } from '@pancakeswap/uikit'
import { useBNBPrice } from 'hooks/useBNBPrice'
import { safeGetAddress } from 'utils'
import { pancakeBunniesAddress } from '../../constants'
import { useGetLowestPriceFromNft } from '../../hooks/useGetLowestPrice'
import NFTMedia from '../NFTMedia'
import LocationTag from './LocationTag'
import PreviewImage from './PreviewImage'
import { CostLabel, LowestPriceMetaRow, MetaRow } from './styles'
import { CollectibleCardProps } from './types'

const CollectibleCardBody: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({
  nft,
  nftLocation,
  currentAskPrice,
  isUserNft,
}) => {
  const { t } = useTranslation()
  const { name } = nft
  const bnbBusdPrice = useBNBPrice()
  const isPancakeBunny = safeGetAddress(nft.collectionAddress) === safeGetAddress(pancakeBunniesAddress)
  const { isFetching, lowestPrice } = useGetLowestPriceFromNft(nft)

  return (
    <CardBody p="8px">
      <NFTMedia as={PreviewImage} nft={nft} height={320} width={320} mb="8px" borderRadius="8px" />
      <Flex alignItems="center" justifyContent="space-between">
        {nft?.collectionName && (
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {nft?.collectionName}
          </Text>
        )}
        {nftLocation && <LocationTag nftLocation={nftLocation} />}
      </Flex>
      <Text as="h4" fontWeight="600" mb="8px">
        {name}
      </Text>
      <Box borderTop="1px solid" borderTopColor="cardBorder" pt="8px">
        {isPancakeBunny && (
          <LowestPriceMetaRow lowestPrice={lowestPrice ?? 0} isFetching={isFetching} bnbBusdPrice={bnbBusdPrice} />
        )}
        {currentAskPrice && (
          <MetaRow title={isUserNft ? t('Your price') : t('Asking price')}>
            <CostLabel cost={currentAskPrice} bnbBusdPrice={bnbBusdPrice} />
          </MetaRow>
        )}
      </Box>
    </CardBody>
  )
}

export default CollectibleCardBody
