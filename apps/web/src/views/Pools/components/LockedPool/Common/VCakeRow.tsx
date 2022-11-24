import { Flex, Text, TooltipText, useTooltip, NextLinkFromReactRouter, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useCakeBenefits from 'components/Menu/UserMenu/hooks/useCakeBenefits'

interface VCakeRowProps {
  titleColor?: string
}

const VCakeRow: React.FC<React.PropsWithChildren<VCakeRowProps>> = ({ titleColor = 'textSubtle' }) => {
  const { t } = useTranslation()
  const { data: cakeBenefits } = useCakeBenefits()
  const { isMobile } = useMatchBreakpoints()

  const {
    targetRef: vCakeTargetRef,
    tooltip: vCakeTooltip,
    tooltipVisible: vCakeTooltipVisible,
  } = useTooltip(
    <>
      <Text>
        {t(`vCAKE boosts your voting power to %totalScore% in the PancakeSwap voting governance.`, {
          totalScore: cakeBenefits?.vCake?.totalScore,
        })}
      </Text>
      <NextLinkFromReactRouter to="/voting">
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
      {vCakeTooltipVisible && vCakeTooltip}
      <TooltipText>
        <Text ref={vCakeTargetRef} color={titleColor} bold fontSize="12px">
          {t('vCAKE')}
        </Text>
      </TooltipText>
      <Text color="text" bold fontSize="16px">
        {cakeBenefits?.vCake?.vaultScore}
      </Text>
    </Flex>
  )
}

export default VCakeRow
