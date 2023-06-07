import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Box, Button, Flex } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import NextLink from 'next/link'
import { useCallback, useMemo } from 'react'
import {
  useBCakeBoostLimitAndLockInfo,
  useUserMultiplierBeforeBoosted,
  useUserBoostedPoolsTokenId,
  useUserPositionInfo,
} from '../../hooks/bCakeV3/useBCakeV3Info'
import { useBoosterFarmV3Handlers } from '../../hooks/bCakeV3/useBoostBcakeV3'
import { BoostStatus, useBoostStatus } from '../../hooks/bCakeV3/useBoostStatus'
import { StatusView } from './StatusView'

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
  const { isReachedMaxBoostLimit, locked, isLockEnd } = useBCakeBoostLimitAndLockInfo()

  const { activate, deactivate, isConfirming } = useBoosterFarmV3Handlers(tokenId, onDone)
  const { userMultiplierBeforeBoosted } = useUserMultiplierBeforeBoosted(tokenId)
  const { theme } = useTheme()
  const lockValidated = useMemo(() => {
    return locked && !isLockEnd
  }, [locked, isLockEnd])

  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between">
      <StatusView
        status={boostStatus}
        boostedMultiplier={
          boostStatus === BoostStatus.farmCanBoostButNot ? userMultiplierBeforeBoosted : boostMultiplier
        }
        isFarmStaking={isFarmStaking}
      />
      <Box>
        {!lockValidated && (
          <NextLink href="/pools" passHref>
            <Button style={{ whiteSpace: 'nowrap' }}>{t('Go to Pool')}</Button>
          </NextLink>
        )}
        {boostStatus === BoostStatus.farmCanBoostButNot && isFarmStaking && lockValidated && (
          <Button
            onClick={() => {
              activate()
            }}
            style={{ padding: isConfirming && '0 10px' }}
            isLoading={isConfirming}
            endIcon={isConfirming && <AutoRenewIcon spin color="currentColor" />}
            disabled={isReachedMaxBoostLimit}
          >
            {t('Boost')}
          </Button>
        )}
        {boostStatus === BoostStatus.Boosted && lockValidated && (
          <Button
            onClick={() => {
              deactivate()
            }}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${theme.colors.primary}`,
              color: theme.colors.primary,
              padding: isConfirming && '0 10px',
            }}
            isLoading={isConfirming}
            endIcon={isConfirming && <AutoRenewIcon spin color="currentColor" />}
          >
            {t('Unset')}
          </Button>
        )}
      </Box>
    </Flex>
  )
}
