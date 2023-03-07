import { useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Box, Text, IfoProgressStepper, IfoVestingFooter } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Divider from 'components/Divider'
import { Ifo, PoolIds } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import useIfoVesting from 'views/Ifos/hooks/useIfoVesting'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import TotalPurchased from './TotalPurchased'
import TotalAvailableClaim from './TotalAvailableClaim'
import ReleasedTokenInfo from './ReleasedTokenInfo'
import ClaimButton from '../ClaimButton'
import VestingClaimButton from '../VestingClaimButton'

interface IfoVestingCardProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
}

const IfoVestingCard: React.FC<React.PropsWithChildren<IfoVestingCardProps>> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
}) => {
  const { t } = useTranslation()
  const { token } = ifo
  const { vestingStartTime } = publicIfoData
  const userPool = walletIfoData[poolId]
  const { vestingInformation } = publicIfoData[poolId]

  const currentTimeStamp = Date.now()
  const timeVestingEnd =
    vestingStartTime === 0 ? currentTimeStamp : (vestingStartTime + vestingInformation.duration) * 1000
  const isVestingOver = currentTimeStamp > timeVestingEnd

  const { amountReleased, amountInVesting, amountAvailableToClaim, amountAlreadyClaimed } = useIfoVesting({
    poolId,
    publicIfoData,
    walletIfoData,
  })

  const amountClaimed = useMemo(
    () => (amountAlreadyClaimed.gt(0) ? getFullDisplayBalance(amountAlreadyClaimed, token.decimals, 4) : '0'),
    [token, amountAlreadyClaimed],
  )

  const getNow = useCallback(() => {
    return Date.now()
  }, [])

  const releaseRate = useMemo(() => {
    const rate = new BigNumber(userPool?.vestingAmountTotal).div(vestingInformation.duration)
    const rateBalance = getFullDisplayBalance(rate, token.decimals, 5)
    return new BigNumber(rateBalance).gte(0.00001) ? rateBalance : '< 0.00001'
  }, [vestingInformation, userPool, token])

  return (
    <Flex flexDirection="column">
      <Box>
        <IfoProgressStepper
          vestingStartTime={publicIfoData.vestingStartTime || 0}
          cliff={vestingInformation?.cliff || 0}
          duration={vestingInformation?.duration || 0}
          getNow={getNow}
        />
        <TotalPurchased ifo={ifo} poolId={poolId} walletIfoData={walletIfoData} />
        <ReleasedTokenInfo
          ifo={ifo}
          amountReleased={amountReleased}
          amountInVesting={amountInVesting}
          isVestingOver={isVestingOver}
        />
        <Divider />
        <TotalAvailableClaim ifo={ifo} amountAvailableToClaim={amountAvailableToClaim} />
        <Text mb="24px" color="textSubtle" fontSize="14px">
          {t('You’ve already claimed %amount% %symbol%', { symbol: token.symbol, amount: amountClaimed })}
        </Text>
        <Box mb="24px">
          {!userPool.isVestingInitialized ? (
            <ClaimButton poolId={poolId} ifoVersion={ifo.version} walletIfoData={walletIfoData} />
          ) : (
            <VestingClaimButton
              poolId={poolId}
              amountAvailableToClaim={amountAvailableToClaim}
              walletIfoData={walletIfoData}
            />
          )}
        </Box>
      </Box>
      <IfoVestingFooter
        duration={vestingInformation?.duration || 0}
        vestingStartTime={vestingStartTime}
        releaseRate={releaseRate}
        getNow={getNow}
      />
    </Flex>
  )
}

export default IfoVestingCard
