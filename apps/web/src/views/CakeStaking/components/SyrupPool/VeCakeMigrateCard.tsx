import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { memo } from 'react'
import { useCheckIsUserAllowMigrate } from '../../hooks/useCheckIsUserAllowMigrate'
import { useIsMigratedToVeCake } from '../../hooks/useIsMigratedToVeCake'
import { LearnMoreLink } from './LearnMoreLink'
import { VeCakeButton } from './VeCakeButton'
import { ShineStyledBox } from './VeCakeCard'

export const VeCakeMigrateCard: React.FC<{ isTableView?: boolean; lockEndTime?: string }> = memo(
  ({ isTableView, lockEndTime }) => {
    const { t } = useTranslation()
    const isMigratedToVeCake = useIsMigratedToVeCake()
    const isUserAllowMigrate = useCheckIsUserAllowMigrate(lockEndTime)
    if (!isUserAllowMigrate && !isMigratedToVeCake) return null
    return (
      <ShineStyledBox
        p="10px"
        style={{ alignItems: 'center', gap: 10, flexDirection: 'column', flexBasis: isTableView ? '50%' : undefined }}
      >
        <Flex alignItems="center" style={{ gap: 10 }}>
          <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="38px" />
          <Box>
            <Text color="white" bold fontSize={14} pr="20px">
              {isMigratedToVeCake ? (
                t('Your CAKE pool position has been migrated to veCAKE.')
              ) : (
                <>
                  {t('All fixed term staking positions must migrate to veCAKE to continue receiving rewards.')}
                  <LearnMoreLink />
                </>
              )}
            </Text>
            {isMigratedToVeCake && (
              <Text mt="10px" color="white" bold fontSize={14} pr="20px">
                {t(
                  'Extending or adding CAKE is not available for migrated positions. You will be able to withdraw CAKE when the lock ends.',
                )}
                <LearnMoreLink />
              </Text>
            )}
          </Box>
        </Flex>
        {!isTableView && !isMigratedToVeCake && <VeCakeButton type="migrate" />}
      </ShineStyledBox>
    )
  },
)
