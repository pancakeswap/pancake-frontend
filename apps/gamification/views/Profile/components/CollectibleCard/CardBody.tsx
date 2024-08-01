import { CardBody, Flex, Text } from '@pancakeswap/uikit'
import NFTMedia from '../NFTMedia'
import LocationTag from './LocationTag'
import PreviewImage from './PreviewImage'
import { CollectibleCardProps } from './types'

const CollectibleCardBody: React.FC<React.PropsWithChildren<CollectibleCardProps>> = ({ nft, nftLocation }) => {
  const { name } = nft

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
    </CardBody>
  )
}

export default CollectibleCardBody
