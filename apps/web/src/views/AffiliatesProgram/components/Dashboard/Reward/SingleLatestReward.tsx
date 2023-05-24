import { Flex, Text, Button } from '@pancakeswap/uikit'
import { LightGreyCard } from 'components/Card'
import { useTranslation } from '@pancakeswap/localization'
import { formatNumber } from '@pancakeswap/utils/formatBalance'

interface SingleLatestRewardProps {
  usdAmountTitle: string
  usdAmount: number
  cakeAmountTitle: string
  cakeAmount: number
  disabled: boolean
  clickClaim: () => void
}

const SingleLatestReward: React.FC<React.PropsWithChildren<SingleLatestRewardProps>> = ({
  usdAmountTitle,
  usdAmount,
  cakeAmountTitle,
  cakeAmount,
  disabled,
  clickClaim,
}) => {
  const { t } = useTranslation()

  return (
    <LightGreyCard>
      <Flex justifyContent="space-between" mb="7px">
        <Text textTransform="uppercase" color="textSubtle" fontSize="14px">
          {usdAmountTitle}
        </Text>
        <Text bold fontSize="14px">
          {`$ ${formatNumber(usdAmount)}`}
        </Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Text textTransform="uppercase" color="textSubtle" fontSize="14px">
          {cakeAmountTitle}
        </Text>
        <Text bold fontSize="14px">
          {`~ ${formatNumber(cakeAmount)} CAKE`}
        </Text>
      </Flex>
      <Button onClick={clickClaim} disabled={disabled} mt="18px" width="100%">
        {t('Claim')}
      </Button>
    </LightGreyCard>
  )
}

export default SingleLatestReward
