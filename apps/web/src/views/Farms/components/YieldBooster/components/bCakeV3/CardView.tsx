import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useUserBoostedMultiplier } from '../../hooks/bCakeV3/useBCakeV3Info'
import { useBoosterFarmV3Handlers } from '../../hooks/bCakeV3/useBoostBcakeV3'
import { BoostStatus, useBoostStatus } from '../../hooks/bCakeV3/useBoostStatus'
import { StatusView } from './StatusView'

export const BCakeV3CardView: React.FC<{
  tokenId: string
  pid: number
  onDone: () => void
}> = ({ tokenId, onDone, pid }) => {
  const { t } = useTranslation()
  const { activate, deactivate } = useBoosterFarmV3Handlers(tokenId, onDone)
  const boostedStatus = useBoostStatus(pid, tokenId)
  const boostedMultiplier = useUserBoostedMultiplier(tokenId)
  const { theme } = useTheme()
  return (
    <Flex width="100%" alignItems="center" justifyContent="space-between">
      <StatusView status={boostedStatus} boostedMultiplier={boostedMultiplier} />
      <Box>
        {boostedStatus === BoostStatus.farmCanBoostButNot && (
          <Button
            onClick={() => {
              activate()
            }}
          >
            {t('Boost')}
          </Button>
        )}
        {boostedStatus === BoostStatus.Boosted && (
          <Button
            onClick={() => {
              deactivate()
            }}
            style={{
              backgroundColor: 'transparent',
              border: `2px solid ${theme.colors.primary}`,
              color: theme.colors.primary,
            }}
          >
            {t('UnSet')}
          </Button>
        )}
      </Box>
    </Flex>
  )
}
