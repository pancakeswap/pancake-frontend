import { useTranslation } from '@pancakeswap/localization'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { DeserializedPotteryUserData } from 'state/types'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import ClaimButton from './ClaimButton'

interface PrizeToBeClaimedProps {
  userData: DeserializedPotteryUserData
}

const PrizeToBeClaimed: React.FC<React.PropsWithChildren<PrizeToBeClaimedProps>> = ({ userData }) => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeBusd()

  const rewardToken = getBalanceNumber(userData.rewards)
  const rewardInBusd = new BigNumber(rewardToken).times(cakePriceBusd).toNumber()

  return (
    <Box mt="20px">
      <Text fontSize="12px" color="secondary" bold as="span" textTransform="uppercase">
        {t('prize')}
      </Text>
      <Text fontSize="12px" color="textSubtle" bold as="span" ml="4px" textTransform="uppercase">
        {t('to be claimed')}
      </Text>
      <Flex>
        <Box style={{ alignSelf: 'center' }}>
          <Balance fontSize="20px" lineHeight="110%" value={rewardToken} decimals={2} bold />
          <Balance fontSize="12px" lineHeight="110%" color="textSubtle" value={rewardInBusd} decimals={2} unit=" USD" />
        </Box>
        <ClaimButton rewardToken={rewardToken} />
      </Flex>
    </Box>
  )
}

export default PrizeToBeClaimed
