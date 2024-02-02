import { useTranslation } from '@pancakeswap/localization'
import { Box, BoxProps, Button, Flex, Text, useModal } from '@pancakeswap/uikit'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { GreyCard } from 'components/Card'
import { useMemo } from 'react'
import { useVeCakeUserCreditWithTime } from 'views/CakeStaking/hooks/useVeCakeUserCreditWithTime'
import {
  VeCakeAddCakeOrWeeksModal,
  VeCakeModalView,
} from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakeAddCakeOrWeeksModal'
import { timeFormat } from 'views/TradingReward/utils/timeFormat'

interface VeCakePreviewTextInfoProps extends BoxProps {
  thresholdLockAmount: number
  endTime: number
  showIncreaseButton?: boolean
}

export const VeCakePreviewTextInfo: React.FC<React.PropsWithChildren<VeCakePreviewTextInfoProps>> = (props) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { endTime, thresholdLockAmount, showIncreaseButton } = props
  const { userCreditWithTime } = useVeCakeUserCreditWithTime(endTime)

  const [onPresentVeCakeAddCakeModal] = useModal(
    <VeCakeAddCakeOrWeeksModal
      showSwitchButton
      viewMode={VeCakeModalView.CAKE_FORM_VIEW}
      endTime={endTime}
      thresholdLockAmount={thresholdLockAmount}
    />,
  )

  const minVeCake = useMemo(
    () => formatNumber(getBalanceNumber(new BigNumber(thresholdLockAmount)), 2, 2),
    [thresholdLockAmount],
  )

  const previewVeCakeAtSnapshot = useMemo(
    () => formatNumber(getBalanceNumber(new BigNumber(userCreditWithTime)), 2, 2),
    [userCreditWithTime],
  )

  return (
    <Box {...props}>
      <GreyCard>
        <Flex justifyContent="space-between" mb="12px">
          <Text maxWidth={170} lineHeight="120%" color="textSubtle" fontSize="14px">
            {t('Min. veCAKE at snapshot time:')}
          </Text>
          <Text bold>{minVeCake}</Text>
        </Flex>
        <Flex justifyContent="space-between" mb="12px">
          <Text maxWidth={170} lineHeight="120%" color="textSubtle" fontSize="14px">
            {t('Preview of your veCAKE⌛ at snapshot time:')}
          </Text>
          <Text>{previewVeCakeAtSnapshot}</Text>
        </Flex>
        <Flex justifyContent="space-between" {...props}>
          <Text maxWidth={170} lineHeight="120%" color="textSubtle" fontSize="14px">
            {t('Snapshot at / Campaign Ends:')}
          </Text>
          <Text>{timeFormat(locale, endTime)}</Text>
        </Flex>
        {showIncreaseButton && (
          <Box mt="12px">
            <Text fontSize={14} mb={12}>
              {t('Increase your veCAKE to continue earning')}
            </Text>
            <Button width="100%" onClick={onPresentVeCakeAddCakeModal}>
              {t('Increase veCAKE')}
            </Button>
          </Box>
        )}
      </GreyCard>
    </Box>
  )
}
