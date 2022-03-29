import { Tag, TagProps, Text, SplitIcon, LockIcon, UnlockIcon, HotIcon, Box } from '@pancakeswap/uikit'
import { FlexGap, FlexGapProps } from 'components/Layout/Flex'
import { useTranslation } from 'contexts/Localization'
import { FC, useMemo } from 'react'
import { DeserializedLockedVaultUser } from 'state/types'
import { isAfterBurning, isLocked, isLockedEnd, isStaked } from 'utils/cakePool'

enum VaultPosition {
  Flexible = 'Flexible',
  Locked = 'Locked',
  LockedEnd = 'Locked End',
  AfterBurning = 'After Burning',
}

const getPosition = (userData: DeserializedLockedVaultUser): VaultPosition => {
  if (isAfterBurning(userData)) {
    return VaultPosition.AfterBurning
  }
  if (isLockedEnd(userData)) {
    return VaultPosition.LockedEnd
  }
  if (isLocked(userData)) {
    return VaultPosition.Locked
  }
  if (isStaked(userData)) {
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

export const VaultPositionTagWithLabel: FC<{ userData: DeserializedLockedVaultUser } & FlexGapProps> = ({
  userData,
  ...props
}) => {
  const { t } = useTranslation()

  const position = useMemo(() => getPosition(userData), [userData])

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
