import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, Card, ICakeIcon, BCakeIcon, VCakeIcon, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import Image from 'next/image'
import BenefitsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsText'
import useCakeBenefits from 'components/Menu/UserMenu/hooks/useCakeBenefits'

const LockedBenefits = () => {
  const { t } = useTranslation()
  const { data: cakeBenefits } = useCakeBenefits()

  const iCakeTooltipComponent = () => (
    <>
      <Text>
        {t(`iCAKE allows you to participate in the IFO public sales and commit up to %iCake% amount of CAKE.`, {
          iCake: cakeBenefits?.iCake,
        })}
      </Text>
      <NextLinkFromReactRouter to="/ifo">
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>
  )

  const bCakeTooltipComponent = () => (
    <>
      <Text>{t(`bCAKE allows you to boost your yield in PancakeSwap Farms by up to 2x.`)}</Text>
      <NextLinkFromReactRouter to="/farms">
        <Text bold color="primary">
          {t('Learn More')}
        </Text>
      </NextLinkFromReactRouter>
    </>
  )

  const vCakeTooltipComponent = () => (
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
    </>
  )

  return (
    <Box position="relative">
      <Box position="absolute" right="20px" top="-55px" zIndex={1}>
        <Image width={73} height={84} alt="lockCAKEbenefit" src="/images/pool/lockCAKEbenefit.png" />
      </Box>
      <Card mb="24px">
        <Box padding={16}>
          <Text fontSize={12} bold color="secondary" textTransform="uppercase">
            {t('locked benefits')}
          </Text>
          <Box mt="8px">
            <Flex mt="8px" flexDirection="row" alignItems="center">
              <Text color="textSubtle" fontSize="14px" mr="auto">
                Cake Yield
              </Text>
              <Text bold>15.23%</Text>
            </Flex>
            <BenefitsText
              title="iCake"
              value={cakeBenefits?.iCake}
              tooltipComponent={iCakeTooltipComponent()}
              icon={<ICakeIcon width={24} height={24} />}
            />
            <BenefitsText
              title="bCake"
              value={t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
              tooltipComponent={bCakeTooltipComponent()}
              icon={<BCakeIcon width={24} height={24} />}
            />
            <BenefitsText
              title="vCake"
              value={cakeBenefits?.vCake?.vaultScore}
              tooltipComponent={vCakeTooltipComponent()}
              icon={<VCakeIcon width={24} height={24} />}
            />
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default LockedBenefits
