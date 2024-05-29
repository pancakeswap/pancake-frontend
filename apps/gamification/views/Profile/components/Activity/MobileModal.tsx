import { useTranslation } from '@pancakeswap/localization'
import { BinanceIcon, Box, BscScanIcon, Button, Flex, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import BigNumber from 'bignumber.js'
import { LightGreyCard } from 'components/Card'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { Activity, NftToken } from 'hooks/useProfile/nft/types'
import useTheme from 'hooks/useTheme'
import { getBlockExploreLink } from 'utils'
import NFTMedia from '../NFTMedia'
import ActivityEventText from './ActivityEventText'

interface MobileModalProps extends InjectedModalProps {
  activity: Activity
  nft?: NftToken
  bnbBusdPrice: BigNumber
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
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const priceAsFloat = parseFloat(activity.price ?? '0')
  const priceInUsd = bnbBusdPrice.multipliedBy(priceAsFloat)
  const { domainName: otherPartySidName } = useDomainNameForAddress(activity.otherParty)
  const { domainName: sellerSidName } = useDomainNameForAddress(activity.seller)
  const { domainName: buyerSidName } = useDomainNameForAddress(activity.buyer)

  return (
    <Modal title={t('Transaction Details')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
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
                  {`(~$${priceInUsd.toNumber().toLocaleString(undefined, {
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
              <Text>{activity.otherParty ? otherPartySidName || truncateHash(activity.otherParty) : '-'}</Text>
            </Flex>
          ) : (
            <>
              <Flex mb="24px" justifyContent="space-between">
                <Text fontSize="14px" color="textSubtle">
                  {t('From')}
                </Text>
                <Text>{activity.seller ? sellerSidName || truncateHash(activity.seller) : '-'}</Text>
              </Flex>
              <Flex mb="24px" justifyContent="space-between">
                <Text fontSize="14px" color="textSubtle">
                  {t('To')}
                </Text>
                <Text>{activity.buyer ? buyerSidName || truncateHash(activity.buyer) : '-'}</Text>
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
            <BscScanIcon color="invertedContrast" ml="4px" />
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

export default MobileModal
