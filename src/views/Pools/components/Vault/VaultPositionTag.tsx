import { Tag, TagProps, Text, FlexProps, SplitIcon, LockIcon, UnlockIcon, HotIcon, Box } from '@pancakeswap/uikit'
import { FlexGap, FlexGapProps } from 'components/Layout/Flex'
import { useTranslation } from 'contexts/Localization'
import { FC, useMemo } from 'react'
import { DeserializedCakeVault } from 'state/types'
import { isAfterBurning, isLocked, isLockedEnd, isStake } from 'utils/cakePool'

enum VaultPosition {
  Flexible = 'Flexible',
  Locked = 'Locked',
  LockedEnd = 'Locked End',
  AfterBurning = 'After Burning',
}

const getPosition = (pool: DeserializedCakeVault): VaultPosition => {
  if (isAfterBurning(pool)) {
    return VaultPosition.AfterBurning
  }
  if (isLockedEnd(pool)) {
    return VaultPosition.LockedEnd
  }
  if (isLocked(pool)) {
    return VaultPosition.Locked
  }
  if (isStake(pool)) {
    return VaultPosition.Flexible
  }
  return null
}

const tagConfig: Record<VaultPosition, TagProps> = {
  [VaultPosition.Flexible]: {
    variant: 'success',
  },
  [VaultPosition.Locked]: {
    variant: 'secondary',
  },
  [VaultPosition.LockedEnd]: {
    variant: 'secondary',
    outline: true,
  },
  [VaultPosition.AfterBurning]: {
    variant: 'failure',
    outline: true,
  },
}
const iconConfig: Record<VaultPosition, any> = {
  [VaultPosition.Flexible]: SplitIcon,
  [VaultPosition.Locked]: LockIcon,
  [VaultPosition.LockedEnd]: UnlockIcon,
  [VaultPosition.AfterBurning]: HotIcon,
}

const VaultPositionTag: FC<{ position: VaultPosition }> = ({ position }) => {
  return (
    <Tag {...tagConfig[position]}>
      <Box as={iconConfig[position]} mr="4px" />
      {position}
    </Tag>
  )
}

export const VaultPositionTagWithLabel: FC<{ pool: DeserializedCakeVault } & FlexGapProps> = ({ pool, ...props }) => {
  const { t } = useTranslation()

  const position = useMemo(() => getPosition(pool), [pool])

  if (position) {
    return (
      <FlexGap alignItems="center" justifyContent="space-between" mb="8px" gap="12px" {...props}>
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold>
          {t('My Position')}
        </Text>
        <VaultPositionTag position={position} />
      </FlexGap>
    )
  }

  return null
}
