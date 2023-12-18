import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import NextLink from 'next/link'
import { useCallback, useMemo } from 'react'
import {
  useBCakeBoostLimitAndLockInfo,
  useUserBoostedPoolsTokenId,
  useUserPositionInfo,
  useVeCakeUserMultiplierBeforeBoosted,
} from '../../hooks/bCakeV3/useBCakeV3Info'
import { useBoostStatus } from '../../hooks/bCakeV3/useBoostStatus'
import { useUpdateLiquidity } from '../../hooks/bCakeV3/useUpdateLiquidity'

import { StatusView } from './StatusView'

const SHOULD_UPDATE_THRESHOLD = 1.1

export const BCakeV3CardView: React.FC<{
  tokenId: string
  pid: number
  isFarmStaking?: boolean
}> = ({ tokenId, pid, isFarmStaking }) => {
  const { t } = useTranslation()
  const { status: boostStatus, updateStatus } = useBoostStatus(pid, tokenId)
  const { updateBoostedPoolsTokenId } = useUserBoostedPoolsTokenId()
  const {
    data: { boostMultiplier },
    updateUserPositionInfo,
  } = useUserPositionInfo(tokenId)

  const onDone = useCallback(() => {
    updateStatus()
    updateUserPositionInfo()
    updateBoostedPoolsTokenId()
  }, [updateStatus, updateUserPositionInfo, updateBoostedPoolsTokenId])
  const { locked, isLockEnd } = useBCakeBoostLimitAndLockInfo()

  const { updateLiquidity, isConfirming } = useUpdateLiquidity(tokenId, onDone)
  const { veCakeUserMultiplierBeforeBoosted } = useVeCakeUserMultiplierBeforeBoosted(tokenId)
  const { theme } = useTheme()
  const lockValidated = useMemo(() => {
    return locked && !isLockEnd
  }, [locked, isLockEnd])
  const shouldUpdate = useMemo(() => {
    if (
      boostMultiplier &&
      veCakeUserMultiplierBeforeBoosted &&
      locked &&
      boostMultiplier * SHOULD_UPDATE_THRESHOLD <= veCakeUserMultiplierBeforeBoosted
    )
      return true
    return false
  }, [boostMultiplier, veCakeUserMultiplierBeforeBoosted, locked])

  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between">
      <StatusView
        status={boostStatus}
        boostedMultiplier={boostMultiplier}
        expectMultiplier={veCakeUserMultiplierBeforeBoosted}
        isFarmStaking={isFarmStaking}
        shouldUpdate={shouldUpdate}
      />
      <Box>
        {!lockValidated && (
          <NextLink href="/cake-staking" passHref>
            <Button style={{ whiteSpace: 'nowrap' }}>{t('Go to Lock')}</Button>
          </NextLink>
        )}
        {shouldUpdate && lockValidated && (
          <Button
            onClick={() => {
              updateLiquidity()
            }}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${theme.colors.primary}`,
              color: theme.colors.primary,
              padding: isConfirming ? '0 10px' : undefined,
            }}
            isLoading={isConfirming}
          >
            {isConfirming ? t('Confirming') : t('Update')}
          </Button>
        )}
      </Box>
    </Flex>
  )
}
