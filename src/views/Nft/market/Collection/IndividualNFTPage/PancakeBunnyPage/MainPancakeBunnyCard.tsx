import { Flex, Box, Card, CardBody, Text, Button, BinanceIcon, Skeleton, useModal } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { formatNumber } from 'utils/formatBalance'
import { multiplyPriceByAmount } from 'utils/prices'
import { NftToken } from 'state/nftMarket/types'
import NFTMedia from 'views/Nft/market/components/NFTMedia'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import BuyModal from '../../../components/BuySellModals/BuyModal'
import SellModal from '../../../components/BuySellModals/SellModal'
import { nftsBaseUrl } from '../../../constants'
import { Container, CollectionLink } from '../shared/styles'

interface MainPancakeBunnyCardProps {
  cheapestNft: NftToken
  cheapestNftFromOtherSellers: NftToken
  isCheapestNftFromOtherSellersFetched: boolean
  nothingForSaleBunny: NftToken
  onSuccessSale: () => void
}

const MainPancakeBunnyCard: React.FC<MainPancakeBunnyCardProps> = ({
  cheapestNft,
  cheapestNftFromOtherSellers,
  isCheapestNftFromOtherSellersFetched,
  nothingForSaleBunny,
  onSuccessSale,
}) => {
  const { t } = useTranslation()
  const bnbBusdPrice = useBNBBusdPrice()

  const nftToDisplay = cheapestNftFromOtherSellers || cheapestNft || nothingForSaleBunny

  const onlyOwnNftsOnSale = isCheapestNftFromOtherSellersFetched && !cheapestNftFromOtherSellers
  const hasListings = cheapestNftFromOtherSellers || cheapestNft

  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, parseFloat(nftToDisplay?.marketData?.currentAskPrice))
  const [onPresentBuyModal] = useModal(<BuyModal nftToBuy={nftToDisplay} />)
  const [onPresentAdjustPriceModal] = useModal(
    <SellModal variant="edit" nftToSell={cheapestNft} onSuccessSale={onSuccessSale} />,
  )

  const actionButton = onlyOwnNftsOnSale ? (
    <Button
      variant="danger"
      minWidth="168px"
      width={['100%', null, 'max-content']}
      mt="24px"
      onClick={onPresentAdjustPriceModal}
    >
      {t('Adjust Sale Price')}
    </Button>
  ) : (
    <Button minWidth="168px" width={['100%', null, 'max-content']} mt="24px" onClick={onPresentBuyModal}>
      {t('Buy')}
    </Button>
  )
  return (
    <Card mb="40px">
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2">
            <Box>
              <CollectionLink to={`${nftsBaseUrl}/collections/${nftToDisplay.collectionAddress}`}>
                {nftToDisplay?.collectionName}
              </CollectionLink>
              <Text fontSize="40px" bold mt="12px">
                {nftToDisplay.name}
              </Text>
              <Text mt={['16px', '16px', '48px']}>{t(nftToDisplay.description)}</Text>
              {hasListings && (
                <>
                  <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                    {t('Lowest price')}
                  </Text>
                  <Flex alignItems="center" mt="8px">
                    <BinanceIcon width={18} height={18} mr="4px" />
                    <Text fontSize="24px" bold mr="4px">
                      {formatNumber(parseFloat(nftToDisplay?.marketData?.currentAskPrice), 0, 5)}
                    </Text>
                    {bnbBusdPrice ? (
                      <Text color="textSubtle">{`(~${priceInUsd.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })} USD)`}</Text>
                    ) : (
                      <Skeleton width="64px" />
                    )}
                  </Flex>
                  {actionButton}
                </>
              )}
            </Box>
          </Flex>
          <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center" maxWidth={440}>
            <NFTMedia key={nftToDisplay.name} nft={nftToDisplay} width={440} height={440} />
          </Flex>
        </Container>
      </CardBody>
    </Card>
  )
}

export default MainPancakeBunnyCard
