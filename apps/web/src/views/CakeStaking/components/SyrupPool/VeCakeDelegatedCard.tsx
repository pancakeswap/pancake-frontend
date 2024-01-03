import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { memo } from 'react'
import { VeCakeButton } from './VeCakeButton'
import { ShineStyledBox } from './VeCakeCard'

export const VeCakeDelegatedCard: React.FC<{ isTableView?: boolean }> = memo(({ isTableView }) => {
  const { t } = useTranslation()
  return (
    <ShineStyledBox
      p="10px"
      style={{ alignItems: 'center', gap: 10, flexDirection: 'column', flexBasis: isTableView ? '50%' : undefined }}
    >
      <Flex alignItems="center" style={{ gap: 10 }}>
        <img src={`${ASSET_CDN}/web/vecake/token-vecake.png`} alt="token-vecake" width="38px" />
        <Box>
          <Text color="white" bold fontSize={14} pr="20px" mb="10px">
            {t('Your CAKE pool position has been converted to one of the 3rd party veCAKE locker protocols.')}
          </Text>
          <Text color="white" bold fontSize={14} pr="20px" mb="10px">
            {t('To check out your converted position, please visit the protocol page.')}
          </Text>
          <Text color="white" bold fontSize={14} pr="20px">
            {t('You can create a native veCAKE position by locking CAKE.')}
          </Text>
        </Box>
      </Flex>
      {!isTableView && <VeCakeButton type="check" />}
    </ShineStyledBox>
  )
})
