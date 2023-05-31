import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Box, Button, Flex } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useCallback } from 'react'
import {
  useUserBoostedMultiplier,
  useUserPositionInfo,
  useUserBoostedPoolsTokenId,
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

  const { activate, deactivate, isConfirming } = useBoosterFarmV3Handlers(tokenId, onDone)

  const multiplierBeforeBoosted = useUserBoostedMultiplier(tokenId)
  const { theme } = useTheme()
  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between">
      <StatusView
        status={boostStatus}
        boostedMultiplier={boostStatus === BoostStatus.farmCanBoostButNot ? boostMultiplier : multiplierBeforeBoosted}
        isFarmStaking={isFarmStaking}
      />
      <Box>
        {boostStatus === BoostStatus.farmCanBoostButNot && isFarmStaking && (
          <Button
            onClick={() => {
              activate()
            }}
            isLoading={isConfirming}
            endIcon={isConfirming && <AutoRenewIcon spin color="currentColor" />}
          >
            {t('Boost')}
          </Button>
        )}
        {boostStatus === BoostStatus.Boosted && (
          <Button
            onClick={() => {
              deactivate()
            }}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${theme.colors.primary}`,
              color: theme.colors.primary,
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
