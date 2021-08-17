import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch } from 'state'
import { useWeb3React } from '@web3-react/core'
import { useGetCurrentLotteryId } from 'state/lottery/hooks'
import { getGraphLotteryUser } from 'state/lottery/getUserLotteryData'
import { UserRound } from 'state/types'
import { getBunnySpecialLotteryAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import bunnySpecialLotteryAbi from 'config/abi/bunnySpecialLottery.json'
import Nfts from 'config/constants/nfts'
import { fetchCurrentLotteryId } from 'state/lottery'
import { getBallerClaim, getLottieClaim, getLuckyClaim, NftClaim, NO_CLAIM } from '../helpers'

const useBunnySpecialLottery = (): {
  canClaimLottie: () => Promise<NftClaim>
  canClaimLucky: () => Promise<NftClaim>
  canClaimBaller: () => Promise<NftClaim>
} => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const currentLotteryId = useGetCurrentLotteryId()
  const currentLotteryIdNum = currentLotteryId && parseInt(currentLotteryId)
  const [userRounds, setUserRounds] = useState<UserRound[]>(null)

  useEffect(() => {
    dispatch(fetchCurrentLotteryId())
  }, [dispatch])

  useEffect(() => {
    setUserRounds(null)
  }, [account])

  useEffect(() => {
    const getUserData = async () => {
      const lotteryNftContractAddress = getBunnySpecialLotteryAddress()
      const calls = [
        {
          name: 'startLotteryRound',
          address: lotteryNftContractAddress,
          params: [],
        },
        {
          name: 'finalLotteryRound',
          address: lotteryNftContractAddress,
          params: [],
        },
      ]

      const [[startRound], [finalRound]] = await multicallv2(bunnySpecialLotteryAbi, calls)
      const startLotteryRoundInt = startRound.toNumber()
      const finalLotteryRoundInt = finalRound.toNumber()

      const lotteryIdsArray = []
      for (let i = startLotteryRoundInt; i <= finalLotteryRoundInt; i++) {
        lotteryIdsArray.push(`${i}`)
      }
      const userParticipation = await getGraphLotteryUser(account, undefined, undefined, {
        lottery_in: lotteryIdsArray,
      })
      setUserRounds(userParticipation.rounds)
    }

    if (account && currentLotteryIdNum && !userRounds) {
      getUserData()
    }
  }, [currentLotteryIdNum, userRounds, account])

  const canClaimLottie = useCallback(async () => {
    if (!userRounds || userRounds.length === 0) {
      return NO_CLAIM
    }

    const { variationId } = Nfts.find((nft) => nft.identifier === 'lottie')
    const [userRound] = userRounds
    const lottieClaim = await getLottieClaim(account, variationId, userRound.lotteryId)
    return lottieClaim
  }, [account, userRounds])

  const canClaimLucky = useCallback(async () => {
    if (!userRounds || userRounds.length === 0) {
      return NO_CLAIM
    }

    const { variationId } = Nfts.find((nft) => nft.identifier === 'lucky')
    const luckyClaim = await getLuckyClaim(account, variationId, userRounds)
    return luckyClaim
  }, [account, userRounds])

  const canClaimBaller = useCallback(async () => {
    const { variationId } = Nfts.find((nft) => nft.identifier === 'baller')
    const lotteryId = userRounds && userRounds.length > 0 && userRounds[0].lotteryId

    const lottieClaim = await getBallerClaim(account, variationId, lotteryId)
    return lottieClaim
  }, [account, userRounds])

  return { canClaimLottie, canClaimLucky, canClaimBaller }
}

export default useBunnySpecialLottery
