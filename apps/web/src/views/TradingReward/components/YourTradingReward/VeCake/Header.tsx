import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Link, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import Image from 'next/image'

export const Header = () => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Box>
      <Text>{t('The estimated veCAKE amount at the snapshot time based on veCAKE’s linearly decreasing math.')}</Text>
      <Link external href="https://">
        {t('Learn More')}
      </Link>
    </Box>,
    {
      placement: 'top',
    },
  )

  return (
    <Flex flexDirection={['column']} alignItems="center" mb={['24px']}>
      <Image
        width={62}
        height={62}
        alt="trading-reward-vecake"
        src="/images/trading-reward/trading-reward-vecake-icon.png"
      />
      <Text textAlign="center" lineHeight="120%" m="24px 0 4px 0">
        {t('To earn trading reward, there is a minimum requirement of your')}
      </Text>
      <TooltipText ref={targetRef} bold textAlign="center">
        {t('veCAKE at snapshot time.')}
      </TooltipText>
      {tooltipVisible && tooltip}
    </Flex>
  )
}
