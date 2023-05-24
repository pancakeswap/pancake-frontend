import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, AutoRenewIcon } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useUserBoostedMultiplier } from '../../hooks/bCakeV3/useBCakeV3Info'
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
  const { activate, deactivate, isConfirming } = useBoosterFarmV3Handlers(tokenId, updateStatus)

  const boostedMultiplier = useUserBoostedMultiplier(tokenId)
  const { theme } = useTheme()
  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between">
      <StatusView status={boostStatus} boostedMultiplier={boostedMultiplier} isFarmStaking={isFarmStaking} />
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
