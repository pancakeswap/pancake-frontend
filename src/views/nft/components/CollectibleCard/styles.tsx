import React, { ReactElement } from 'react'
import {
  BinanceIcon,
  Box,
  BoxProps,
  CameraIcon,
  Flex,
  FlexProps,
  SellIcon,
  Text,
  WalletFilledIcon,
} from '@pancakeswap/uikit'
import { Price } from '@pancakeswap/sdk'
import { useTranslation } from 'contexts/Localization'
import { multiplyPriceByAmount } from 'utils/prices'

export const Footer: React.FC<BoxProps> = ({ children, ...props }) => (
  <Box borderTop={[null, null, null, '1px solid']} borderColor="cardBorder" pt="8px" {...props}>
    {children}
  </Box>
)

interface CostLabelProps extends FlexProps {
  cost: number
  bnbBusdPrice: Price
}

export const CostLabel: React.FC<CostLabelProps> = ({ cost, bnbBusdPrice, ...props }) => {
  const priceInUsd = multiplyPriceByAmount(bnbBusdPrice, cost)

  return (
    <Flex alignItems="center" {...props}>
      <Text fontSize="12px" color="textSubtle">{`($${priceInUsd.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })})`}</Text>
      <BinanceIcon width="16px" mx="4px" />
      <Text fontWeight="600">
        {cost.toLocaleString(undefined, {
          minimumFractionDigits: 0,
          maximumFractionDigits: 4,
        })}
      </Text>
    </Flex>
  )
}

interface MetaRowProps extends FlexProps {
  title: string
}

export const MetaRow: React.FC<MetaRowProps> = ({ title, children, ...props }) => (
  <Flex alignItems="center" justifyContent="space-between" {...props}>
    <Text fontSize="12px" color="textSubtle">
      {title}
    </Text>
    <Box>{children}</Box>
  </Flex>
)

export interface NftTagProps extends FlexProps {
  icon?: ReactElement
  color?: string
}

export const NftTag: React.FC<NftTagProps> = ({ icon, color = 'text', children, ...props }) => (
  <Flex display="inline-flex" alignItems="center" height="24px" {...props}>
    {icon}
    <Text color={color} fontSize="14px" fontWeight="600">
      {children}
    </Text>
  </Flex>
)

export const ProfileNftTag: React.FC<NftTagProps> = (props) => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<CameraIcon mr="4px" width="16px" color="textSubtle" />} color="textSubtle" {...props}>
      {t('Profile')}
    </NftTag>
  )
}

export const WalletNftTag: React.FC<NftTagProps> = (props) => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<WalletFilledIcon mr="4px" width="16px" color="secondary" />} color="secondary" {...props}>
      {t('Wallet')}
    </NftTag>
  )
}

export const SellingNftTag: React.FC<NftTagProps> = (props) => {
  const { t } = useTranslation()

  return (
    <NftTag icon={<SellIcon mr="4px" width="16px" color="failure" />} color="failure" {...props}>
      {t('Selling')}
    </NftTag>
  )
}
