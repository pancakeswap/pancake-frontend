import { ReactElement } from 'react'
import {
  Card,
  BinanceIcon,
  Box,
  BoxProps,
  CameraIcon,
  Flex,
  FlexProps,
  SellIcon,
  Text,
  WalletFilledIcon,
  Skeleton,
} from '@pancakeswap/uikit'
import { Price } from '@pancakeswap/sdk'
import { useTranslation } from '@pancakeswap/localization'
import { multiplyPriceByAmount } from 'utils/prices'
import styled from 'styled-components'

export const Footer: React.FC<React.PropsWithChildren<BoxProps>> = ({ children, ...props }) => (
  <Box borderTop={[null, null, null, '1px solid']} borderColor="cardBorder" pt="8px" {...props}>
    {children}
  </Box>
)

interface BNBAmountLabelProps extends FlexProps {
  amount: number
}

export const BNBAmountLabel: React.FC<React.PropsWithChildren<BNBAmountLabelProps>> = ({ amount, ...props }) => (
  <Flex alignItems="center" {...props}>
    <BinanceIcon width="16px" mx="4px" />
    <Text fontWeight="600">
      {amount.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 5,
      })}
    </Text>
  </Flex>
)

interface CostLabelProps extends FlexProps {
  cost: number
  bnbBusdPrice: Price
}

export const CostLabel: React.FC<React.PropsWithChildren<CostLabelProps>> = ({ cost, bnbBusdPrice, ...props }) => {
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, cost)

  return (
    <Flex alignItems="center" {...props}>
      {priceInUsd > 0 && (
        <Text fontSize="12px" color="textSubtle">{`($${priceInUsd.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })})`}</Text>
      )}
      <BNBAmountLabel amount={cost} />
    </Flex>
  )
}

interface MetaRowProps extends FlexProps {
  title: string
}

export const MetaRow: React.FC<React.PropsWithChildren<MetaRowProps>> = ({ title, children, ...props }) => (
  <Flex alignItems="center" justifyContent="space-between" {...props}>
    <Text fontSize="12px" color="textSubtle" maxWidth="120px" ellipsis title={title}>
      {title}
    </Text>
    <Box>{children}</Box>
  </Flex>
)

export interface NftTagProps extends FlexProps {
  icon?: ReactElement
  color?: string
}

export const NftTag: React.FC<React.PropsWithChildren<NftTagProps>> = ({
  icon,
  color = 'text',
  children,
  ...props
}) => (
  <Flex display="inline-flex" alignItems="center" height="24px" {...props}>
    {icon}
    <Text color={color} fontSize="14px" fontWeight="600">
      {children}
    </Text>
  </Flex>
)

export const ProfileNftTag: React.FC<React.PropsWithChildren<NftTagProps>> = (props) => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<CameraIcon mr="4px" width="16px" color="textSubtle" />} color="textSubtle" {...props}>
      {t('Profile')}
    </NftTag>
  )
}

export const WalletNftTag: React.FC<React.PropsWithChildren<NftTagProps>> = (props) => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<WalletFilledIcon mr="4px" width="16px" color="secondary" />} color="secondary" {...props}>
      {t('Wallet')}
    </NftTag>
  )
}

export const SellingNftTag: React.FC<React.PropsWithChildren<NftTagProps>> = (props) => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<SellIcon mr="4px" width="16px" color="failure" />} color="failure" {...props}>
      {t('Selling')}
    </NftTag>
  )
}

export const StyledCollectibleCard = styled(Card)`
  border-radius: 8px;
  max-width: 320px;
  transition: opacity 200ms;

  & > div {
    border-radius: 8px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    &:hover {
      cursor: pointer;
      opacity: 0.6;
    }
  }
`
interface LowestPriceMetaRowProps {
  lowestPrice: number
  isFetching: boolean
  bnbBusdPrice: Price
}

export const LowestPriceMetaRow = ({ lowestPrice, isFetching, bnbBusdPrice }: LowestPriceMetaRowProps) => {
  const { t } = useTranslation()

  if (!isFetching && !lowestPrice) {
    return null
  }

  return (
    <MetaRow title={t('Lowest price')}>
      {isFetching ? (
        <Skeleton height="24px" width="30px" />
      ) : (
        <CostLabel cost={lowestPrice} bnbBusdPrice={bnbBusdPrice} />
      )}
    </MetaRow>
  )
}
