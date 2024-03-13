import { useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, Text, Card, ICakeIcon, BCakeIcon, VCakeIcon } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from '@pancakeswap/widgets-internal'

import Image from 'next/image'
import BigNumber from 'bignumber.js'
import BenefitsText from 'views/Pools/components/RevenueSharing/BenefitsModal/BenefitsText'
import useCakeBenefits from 'components/Menu/UserMenu/hooks/useCakeBenefits'
import { useVaultApy } from 'hooks/useVaultApy'
import { VaultKey, DeserializedLockedCakeVault } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import useUserDataInVaultPresenter from 'views/Pools/components/LockedPool/hooks/useUserDataInVaultPresenter'

const LockedBenefits = () => {
  const { t } = useTranslation()
  const { data: cakeBenefits } = useCakeBenefits()
  const { getLockedApy, getBoostFactor } = useVaultApy()
  const { userData } = useVaultPoolByKey(VaultKey.CakeVault) as DeserializedLockedCakeVault
  const { secondDuration } = useUserDataInVaultPresenter({
    lockStartTime: userData?.lockStartTime ?? '0',
    lockEndTime: userData?.lockEndTime ?? '0',
  })

  const lockedApy = useMemo(() => getLockedApy(secondDuration), [getLockedApy, secondDuration])
  const boostFactor = useMemo(() => getBoostFactor(secondDuration), [getBoostFactor, secondDuration])
  const delApy = useMemo(() => new BigNumber(lockedApy || 0).div(boostFactor).toNumber(), [lockedApy, boostFactor])

  const iCakeTooltipComponent = () => (
    <>
      <Text>
        {t('iCAKE allows you to participate in the IFO public sales and commit up to %iCake% amount of CAKE.', {
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
      <Text>{t('bCAKE allows you to boost your yield in PancakeSwap Farms by up to 2x.')}</Text>
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
        {t('vCAKE boosts your voting power to %totalScore% in the PancakeSwap voting governance.', {
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
                {t('CAKE Yield')}
              </Text>
              <Text style={{ display: 'inline-block' }} color="success" bold>
                {`${Number(lockedApy).toFixed(2)}%`}
              </Text>
              <Text ml="2px" as="del" bold>{`${Number(delApy).toFixed(2)}%`}</Text>
            </Flex>
            <BenefitsText
              title="iCAKE"
              value={cakeBenefits?.iCake || ''}
              tooltipComponent={iCakeTooltipComponent()}
              icon={<ICakeIcon width={24} height={24} mr="8px" />}
            />
            <BenefitsText
              title="bCAKE"
              value={t('Up to %boostMultiplier%x', { boostMultiplier: 2 })}
              tooltipComponent={bCakeTooltipComponent()}
              icon={<BCakeIcon width={24} height={24} mr="8px" />}
            />
            <BenefitsText
              title="vCAKE"
              value={cakeBenefits?.vCake?.vaultScore || ''}
              tooltipComponent={vCakeTooltipComponent()}
              icon={<VCakeIcon width={24} height={24} mr="8px" />}
            />
          </Box>
        </Box>
      </Card>
    </Box>
  )
}

export default LockedBenefits
