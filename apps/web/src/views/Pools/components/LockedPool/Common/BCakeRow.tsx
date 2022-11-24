import { Flex, Text, TooltipText, useTooltip, NextLinkFromReactRouter, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

interface BCakeRowProps {
  titleColor?: string
}

const BCakeRow: React.FC<React.PropsWithChildren<BCakeRowProps>> = ({ titleColor = 'textSubtle' }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const {
    targetRef: bCakeTargetRef,
    tooltip: bCakeTooltip,
    tooltipVisible: bCakeTooltipVisible,
  } = useTooltip(
    <>
      <Text>{t(`bCAKE allows you to boost your yield in PancakeSwap Farms by up to 2x.`)}</Text>
      <NextLinkFromReactRouter to="/farms">
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>,
    {
      placement: 'bottom',
      ...(isMobile && { hideTimeout: 2000 }),
    },
  )

  return (
    <Flex alignItems="center" justifyContent="space-between">
      {bCakeTooltipVisible && bCakeTooltip}
      <TooltipText>
        <Text ref={bCakeTargetRef} color={titleColor} bold fontSize="12px">
          {t('bCAKE')}
        </Text>
      </TooltipText>
      <Text color="text" bold fontSize="16px">
        {t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
      </Text>
    </Flex>
  )
}

export default BCakeRow
