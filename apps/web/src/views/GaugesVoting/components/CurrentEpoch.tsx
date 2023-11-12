import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, Card, FlexGap, Text, TooltipText } from '@pancakeswap/uikit'
import { Tooltips } from 'views/CakeStaking/components/Tooltips'

export const CurrentEpoch = () => {
  const { t } = useTranslation()
  return (
    <Card isActive innerCardProps={{ padding: 24 }}>
      <FlexGap gap="8px" flexDirection="column">
        <AutoRow justifyContent="space-between">
          <Text bold fontSize={20}>
            {t('Current Epoch')}
          </Text>

          <FlexGap gap="8px" alignItems="baseline">
            <Tooltips content={t('@todo')}>
              <TooltipText fontSize={14} color="textSubtle">
                {t('Ends in')}
              </TooltipText>
            </Tooltips>
            <FlexGap alignItems="baseline" gap="2px">
              <Text bold fontSize={16}>
                7 days
              </Text>
              <Text fontSize={14}>(16 Jul 2042) </Text>
            </FlexGap>
          </FlexGap>
        </AutoRow>
        <AutoRow justifyContent="space-between">
          <Tooltips content={t('@todo')}>
            <TooltipText fontSize={14} color="textSubtle">
              {t('CAKE rewards')}
            </TooltipText>
          </Tooltips>

          <FlexGap alignItems="baseline" gap="2px">
            <Text bold fontSize={16}>
              321,321.33
            </Text>
            <Text fontSize={14}>(1.32 CAKE/sec) </Text>
          </FlexGap>
        </AutoRow>
        <AutoRow justifyContent="space-between">
          <Tooltips content={t('@todo')}>
            <TooltipText fontSize={14} color="textSubtle">
              {t('Total votes')}
            </TooltipText>
          </Tooltips>

          <Text bold fontSize={16}>
            312,312,132 veCAKE
          </Text>
        </AutoRow>
      </FlexGap>
    </Card>
  )
}
