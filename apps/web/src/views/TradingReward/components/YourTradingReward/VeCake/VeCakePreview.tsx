import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, Link, Message, Text, TooltipText, useModal, useTooltip } from '@pancakeswap/uikit'
import { GreyCard } from 'components/Card'
import Image from 'next/image'
import { NoLockingCakeModal } from 'views/TradingReward/components/YourTradingReward/VeCake/NoLockingCakeModal'
import { VeCakePreviewTextInfo } from 'views/TradingReward/components/YourTradingReward/VeCake/VeCakePreviewTextInfo'

export const VeCakePreview = () => {
  const { t } = useTranslation()
  const [onPresentNoLockingCakeModal] = useModal(<NoLockingCakeModal />)

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
    <Flex flexDirection={['column']}>
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
      <GreyCard mb="24px">
        <VeCakePreviewTextInfo title={t('Min. veCAKE at snapshot time:')} value="500" bold mb="18px" />
        <VeCakePreviewTextInfo title={t('Preview of your veCAKE⌛ at snapshot time:')} value="0" mb="18px" />
        <VeCakePreviewTextInfo title={t('Snapshot at / Campaign Ends:')} value="16 Feb 2024, 21:45" />
      </GreyCard>
      <Message variant="warning">
        <Flex flexDirection="column" width="100%">
          <Text lineHeight="120%" mb="11px">
            {t('Get veCAKE to start earning')}
            {/* {t('Increase veCAKE to reach min. requirement')} */}
          </Text>
          <Button ml="-36px" onClick={onPresentNoLockingCakeModal}>
            {t('Get veCAKE')}
            {/* {t('Increae veCAKE')} */}
          </Button>
        </Flex>
      </Message>
    </Flex>
  )
}
