import { useTranslation } from '@pancakeswap/localization'
import { Text, Flex, Box } from '@pancakeswap/uikit'
import { memo } from 'react'
import { ShineStyledBox } from './VeCakeCard'
import { VeCakeButton } from './VeCakeButton'
import { useIsMigratedToVeCake } from '../../hooks/useIsMigratedToVeCake'

export const VeCakeMigrateCard: React.FC<{ isTableView?: boolean }> = memo(({ isTableView }) => {
  const { t } = useTranslation()
  const isMigratedToVeCake = useIsMigratedToVeCake()
  return (
    <ShineStyledBox p="10px" style={{ alignItems: 'center', gap: 10, flexDirection: 'column' }}>
      <Flex alignItems="center" style={{ gap: 10 }}>
        <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="38px" />
        <Box>
          <Text color="white" bold fontSize={14} pr="20px">
            {isMigratedToVeCake
              ? t('Your CAKE pool position has been migrated to veCAKE.')
              : t('All fixed term staking positions must migrate to veCAKE to continue receiving rewards. Learn more')}
          </Text>
          {isMigratedToVeCake && (
            <Text mt="10px" color="white" bold fontSize={14} pr="20px">
              {t(
                'Extending or adding CAKE is not available for migrated positions. You will be able to withdraw CAKE when the lock ends. Learn more',
              )}
            </Text>
          )}
        </Box>
      </Flex>
      {!isTableView && <VeCakeButton type="migrate" />}
    </ShineStyledBox>
  )
})
