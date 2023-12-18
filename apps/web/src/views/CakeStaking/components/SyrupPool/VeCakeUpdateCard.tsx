import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { memo } from 'react'
import { CakeStakingPageLink, LearnMoreLink } from './LearnMoreLink'
import { VeCakeButton } from './VeCakeButton'
import { ShineStyledBox } from './VeCakeCard'

export const VeCakeUpdateCard: React.FC<{
  isFlexibleStake?: boolean
  isTableView?: boolean
  isLockEndOrAfterLock?: boolean
}> = memo(({ isFlexibleStake, isTableView, isLockEndOrAfterLock }) => {
  const { t } = useTranslation()
  return (
    <ShineStyledBox
      mb={isTableView ? undefined : '15px'}
      p="10px"
      style={{ alignItems: 'center', gap: 10, flexDirection: 'column', flexBasis: isTableView ? '50%' : undefined }}
    >
      <Flex alignItems="center" style={{ gap: 10 }}>
        <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="38px" />
        <Box>
          <Text color="white" bold fontSize={14} pr="20px">
            {isFlexibleStake ? (
              <>
                {t('This product has been upgraded to')}
                <CakeStakingPageLink />
              </>
            ) : (
              <>
                {t('This product have been upgraded. Check out the brand new veCAKE for more CAKE staking benefits.')}
                <LearnMoreLink />
              </>
            )}
          </Text>
        </Box>
      </Flex>
      {!isFlexibleStake && <VeCakeButton type={isLockEndOrAfterLock ? 'check' : 'get'} />}
    </ShineStyledBox>
  )
})

export const VeCakeUpdateCardTableView: React.FC = memo(() => {
  const { t } = useTranslation()
  return (
    <ShineStyledBox mb="15px" p="10px" style={{ alignItems: 'center', gap: 10, flexDirection: 'column' }}>
      <Flex alignItems="center" style={{ gap: 10 }}>
        <img src="/images/cake-staking/token-vecake.png" alt="token-vecake" width="38px" />
        <Box>
          <Text color="white" bold fontSize={14} pr="20px">
            {t('This product have been upgraded. Check out the brand new veCAKE for more CAKE staking benefits.')}
            <LearnMoreLink />
          </Text>
        </Box>
      </Flex>
    </ShineStyledBox>
  )
})
