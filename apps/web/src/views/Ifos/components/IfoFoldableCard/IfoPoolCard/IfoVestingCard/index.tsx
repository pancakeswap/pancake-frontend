import { useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Flex, Box, Text, IfoProgressStepper, IfoVestingFooter } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import Divider from 'components/Divider'
import { Ifo, PoolIds } from '@pancakeswap/ifos'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import useIfoVesting from 'views/Ifos/hooks/useIfoVesting'
import { getFullDisplayBalance } from '@pancakeswap/utils/formatBalance'
import { BIG_ONE, BIG_ZERO } from '@pancakeswap/utils/bigNumber'

import { useActiveChainId } from 'hooks/useActiveChainId'

import TotalPurchased from './TotalPurchased'
import TotalAvailableClaim from './TotalAvailableClaim'
import ReleasedTokenInfo from './ReleasedTokenInfo'
import ClaimButton from '../ClaimButton'
import VestingClaimButton from '../VestingClaimButton'
import { SwitchNetworkTips } from '../SwitchNetworkTips'

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
  const { chainId } = useActiveChainId()
  const { token } = ifo
  const { vestingStartTime } = publicIfoData
  const userPool = walletIfoData[poolId]
  const vestingInformation = publicIfoData[poolId]?.vestingInformation

  const { amountReleased, amountInVesting, amountAvailableToClaim, amountAlreadyClaimed, isVestingOver } =
    useIfoVesting({
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
    const rate = new BigNumber(userPool?.vestingAmountTotal || BIG_ZERO).div(vestingInformation?.duration || BIG_ONE)
    const rateBalance = getFullDisplayBalance(rate, token.decimals, 5)
    return new BigNumber(rateBalance).gte(0.00001) ? rateBalance : '< 0.00001'
  }, [vestingInformation, userPool, token])

  const claimButton = !userPool?.isVestingInitialized ? (
    <ClaimButton poolId={poolId} ifoVersion={ifo.version} walletIfoData={walletIfoData} />
  ) : (
    <VestingClaimButton
      poolId={poolId}
      amountAvailableToClaim={amountAvailableToClaim || BIG_ZERO}
      walletIfoData={walletIfoData}
    />
  )

  const claimAction = ifo.chainId === chainId ? claimButton : <SwitchNetworkTips ifoChainId={ifo.chainId} />

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
        <TotalAvailableClaim ifo={ifo} amountAvailableToClaim={amountAvailableToClaim || BIG_ZERO} />
        <Text mb="24px" color="textSubtle" fontSize="14px">
          {t('You’ve already claimed %amount% %symbol%', { symbol: token.symbol, amount: amountClaimed })}
        </Text>
        <Box mb="24px">{claimAction}</Box>
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
