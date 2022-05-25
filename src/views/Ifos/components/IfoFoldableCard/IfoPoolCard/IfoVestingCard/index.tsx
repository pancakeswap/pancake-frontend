import { useMemo } from 'react'
import { Flex, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import Divider from 'components/Divider'
import { Ifo, PoolIds } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import useIfoVesting from 'hooks/useIfoVesting'
import { getBalanceNumber, formatNumber } from 'utils/formatBalance'
import ProgressStepper from './ProgressStepper'
import TotalPurchased from './TotalPurchased'
import TotalAvailableClaim from './TotalAvailableClaim'
import ReleasedTokenInfo from './ReleasedTokenInfo'
import IfoVestingFooter from './IfoVestingFooter'
import ClaimButton from '../ClaimButton'
import VestingClaimButton from '../VestingClaimButton'

interface IfoVestingCardProps {
  poolId: PoolIds
  ifo: Ifo
  isLoading: boolean
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const IfoVestingCard: React.FC<IfoVestingCardProps> = ({ poolId, ifo, isLoading, publicIfoData, walletIfoData }) => {
  const { t } = useTranslation()
  const { token } = ifo
  const { userVestingSheduleCount, amountAvailableToClaim, amountAlreadyClaimed } = useIfoVesting({
    poolId,
    publicIfoData,
    walletIfoData,
  })

  const amountClaimed = useMemo(() => {
    const amount = getBalanceNumber(amountAlreadyClaimed, token.decimals)
    return amount > 0 ? formatNumber(amount, 4, 4) : 0
  }, [token, amountAlreadyClaimed])

  return (
    <Flex flexDirection="column">
      <Box>
        <ProgressStepper publicIfoData={publicIfoData} />
        <TotalPurchased ifo={ifo} poolId={poolId} walletIfoData={walletIfoData} />
        <ReleasedTokenInfo />
        <Divider />
        <TotalAvailableClaim ifo={ifo} amountAvailableToClaim={amountAvailableToClaim} />
        <Text mb="24px" color="textSubtle" fontSize="14px">
          {t('You’ve already claimed %amount% %symbol%', { symbol: token.symbol, amount: amountClaimed })}
        </Text>
        <Box mb="24px">
          {userVestingSheduleCount.eq(0) ? (
            <ClaimButton poolId={poolId} ifoVersion={ifo.version} walletIfoData={walletIfoData} />
          ) : (
            <VestingClaimButton poolId={poolId} walletIfoData={walletIfoData} />
          )}
        </Box>
      </Box>
      <IfoVestingFooter ifo={ifo} poolId={poolId} publicIfoData={publicIfoData} walletIfoData={walletIfoData} />
    </Flex>
  )
}

export default IfoVestingCard
