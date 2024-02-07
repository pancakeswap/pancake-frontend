import { useTranslation } from '@pancakeswap/localization'
import { Box, BoxProps, Button, Flex, Text, useMatchBreakpoints, useModal } from '@pancakeswap/uikit'
import { formatNumber, getBalanceAmount, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
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

interface TextInfoProps extends BoxProps {
  title: string
  value: string
  bold?: boolean
}

const TextInfo: React.FC<React.PropsWithChildren<TextInfoProps>> = (props) => {
  const { title, value, bold } = props
  const { isDesktop, isTablet } = useMatchBreakpoints()

  return (
    <Flex flexDirection={['column', 'column', 'row']} justifyContent="space-between" {...props}>
      <Text maxWidth={['100%', '100%', '100%', '170px']} lineHeight="120%" color="textSubtle" fontSize="14px">
        {title}
      </Text>
      <Text bold={bold} style={{ alignSelf: isTablet || isDesktop ? 'center' : 'flex-start' }}>
        {value}
      </Text>
    </Flex>
  )
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
    () => getBalanceAmount(new BigNumber(userCreditWithTime)).toFixed(2, BigNumber.ROUND_DOWN),
    [userCreditWithTime],
  )

  return (
    <Box {...props}>
      <GreyCard>
        <TextInfo title={t('Min. veCAKE at snapshot time:')} value={minVeCake} mb="12px" />
        <TextInfo title={t('Preview of your veCAKE⌛ at snapshot time:')} value={previewVeCakeAtSnapshot} mb="12px" />
        <TextInfo title={t('Snapshot at / Campaign Ends:')} value={timeFormat(locale, endTime)} />
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
