import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, Card, ICakeIcon, BCakeIcon, VCakeIcon } from '@pancakeswap/uikit'
import Image from 'next/image'
import BenefitsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsText'

const LockedBenefits = () => {
  const { t } = useTranslation()
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
            <BenefitsText title="iCake" value="6.45" icon={<ICakeIcon width={24} height={24} />} />
            <BenefitsText title="bCake" value="Up to 2x" icon={<BCakeIcon width={24} height={24} />} />
            <BenefitsText title="iCake" value="51.12" icon={<VCakeIcon width={24} height={24} />} />
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default LockedBenefits
