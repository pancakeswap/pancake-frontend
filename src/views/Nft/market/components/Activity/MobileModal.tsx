import { InjectedModalProps, Modal, Flex, Text, Button, BinanceIcon, Box } from '@pancakeswap/uikit'
import { Price, Currency } from '@pancakeswap/sdk'
import useTheme from 'hooks/useTheme'
import { Activity, NftToken } from 'state/nftMarket/types'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { multiplyPriceByAmount } from 'utils/prices'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { getBlockExploreLink } from 'utils'
import ActivityEventText from './ActivityEventText'
import NFTMedia from '../NFTMedia'

interface MobileModalProps extends InjectedModalProps {
  activity: Activity
  nft: NftToken
  bnbBusdPrice: Price<Currency, Currency>
  localeTimestamp: string
  isUserActivity?: boolean
}

const MobileModal: React.FC<React.PropsWithChildren<MobileModalProps>> = ({
  nft,
  activity,
  bnbBusdPrice,
  localeTimestamp,
  onDismiss,
  isUserActivity = false,
}) => {
  const { chainId } = useActiveWeb3React()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const priceAsFloat = parseFloat(activity.price)
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, priceAsFloat)

  return (
    <Modal
      title={t('Transaction Details')}
      maxWidth="320px"
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradientCardHeader}
    >
      <Flex flexDirection="column">
        <Flex alignItems="center" mb="16px" justifyContent="space-between">
          <Box width={68} mr="16px">
            <NFTMedia nft={nft} width={68} height={68} />
          </Box>
          <Flex flexDirection="column">
            <Text fontSize="12px" color="textSubtle" textAlign="right">
              {nft?.collectionName}
            </Text>
            <Text bold textAlign="right">
              {nft?.name}
            </Text>
          </Flex>
        </Flex>
        <LightGreyCard p="16px">
          <Flex mb="24px" justifyContent="space-between">
            <ActivityEventText fontSize="14px" marketEvent={activity.marketEvent} />
            {priceAsFloat ? (
              <Flex justifyContent="flex-end" alignItems="center">
                <BinanceIcon width="12px" height="12px" mr="4px" />
                <Text mr="4px" bold>
                  {priceAsFloat}
                </Text>
                <Text color="textSubtle">
                  {`(~$${priceInUsd.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })})`}
                </Text>
              </Flex>
            ) : (
              '-'
            )}
          </Flex>
          {isUserActivity ? (
            <Flex mb="24px" justifyContent="space-between">
              <Text fontSize="14px" color="textSubtle">
                {t('From/To')}
              </Text>
              <Text>{activity.otherParty ? truncateHash(activity.otherParty) : '-'}</Text>
            </Flex>
          ) : (
            <>
              <Flex mb="24px" justifyContent="space-between">
                <Text fontSize="14px" color="textSubtle">
                  {t('From')}
                </Text>
                <Text>{activity.seller ? truncateHash(activity.seller) : '-'}</Text>
              </Flex>
              <Flex mb="24px" justifyContent="space-between">
                <Text fontSize="14px" color="textSubtle">
                  {t('To')}
                </Text>
                <Text>{activity.buyer ? truncateHash(activity.buyer) : '-'}</Text>
              </Flex>
            </>
          )}
          <Flex justifyContent="space-between">
            <Text fontSize="14px" color="textSubtle">
              {t('Date')}
            </Text>
            <Text>{localeTimestamp}</Text>
          </Flex>
        </LightGreyCard>
        <Flex flexDirection="column" pt="16px" alignItems="center">
          <Button as="a" external href={getBlockExploreLink(activity.tx, 'transaction', chainId)}>
            {t('View on BscScan')}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default MobileModal
