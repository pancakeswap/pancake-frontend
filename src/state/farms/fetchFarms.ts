import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import jarAbi from 'config/abi/GenericJar.json'
// import masterchefABI from 'config/abi/masterchef.json'
import multicall from 'utils/multicall'
import { BIG_TEN } from 'utils/bigNumber'
// import { getAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { getAddress } from 'utils/addressHelpers'
import { FarmConfig } from 'config/constants/types'
import { DEFAULT_TOKEN_DECIMAL } from 'config'

const fetchFarms = async (farmsToFetch: FarmConfig[]) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const lpAddress = getAddress(farmConfig.lpAddresses)
      const masterChefAddress = getAddress(farmConfig.masterChefAddresses)
      const jarAddress = getAddress(farmConfig.jarAddresses)
      const calls = [
        // Balance of token in the LP contract
        {
          address: getAddress(farmConfig.token.address),
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteToken.address),
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAddress,
          name: 'balanceOf',
          params: [masterChefAddress],
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: getAddress(farmConfig.token.address),
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteToken.address),
          name: 'decimals',
        },
      ]

      const [tokenBalanceLP, quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, tokenDecimals, quoteTokenDecimals] =
        await multicall(erc20, calls)

      // Ratio in % a LP tokens that are in staking, vs the total number in circulation
      const lpTotalSupplyNum = new BigNumber(lpTotalSupply)
      const lpQuoteTokenNum = new BigNumber(quoteTokenBalanceLP)
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(lpTotalSupplyNum)

      // Total value in staking in quote token value
      const lpTotalInQuoteToken = lpQuoteTokenNum
        .div(DEFAULT_TOKEN_DECIMAL)
        .times(new BigNumber(2))
        .times(lpTokenRatio)

      // Amount of token in the LP that are considered staking (i.e amount of token * lp ratio)
      const tokenAmount = new BigNumber(tokenBalanceLP).div(BIG_TEN.pow(tokenDecimals)).times(lpTokenRatio)
      const quoteTokenAmount = lpQuoteTokenNum
        .div(BIG_TEN.pow(quoteTokenDecimals))
        .times(lpTokenRatio)

      // Fetch total deposits
      const callDeposits = [
        // Balance of tokens in our jar contract
        {
          address: jarAddress,
          name: 'balance',
        },
      ]

      const [totalDepositsVal] = await multicall(jarAbi, callDeposits)
      const jarDeposits = new BigNumber(totalDepositsVal)
      const totalDeposits = jarDeposits.times(2).div(lpTotalSupplyNum).times(lpQuoteTokenNum).div(BIG_TEN.pow(quoteTokenDecimals))

      // new BigNumber(totalDepositsVal).times(quoteTokenAmount).div(tokenAmount).div(BIG_TEN.pow(quoteTokenDecimals)).times(2)

    /*    const calls = farmsToFetch.map((farm) => {
          const lpContractAddress = getAddress(farm.lpAddresses)
          const jarContractAddress = getAddress(farm.jarAddresses)
          return { address: lpContractAddress, name: 'allowance', params: [account, jarContractAddress] }
        })

        const rawLpAllowances = await multicall(erc20ABI, calls)
        const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
          return new BigNumber(lpBalance).toJSON()
        })
        return parsedLpAllowances
      } */

  //    const [info, totalAllocPoint] = await multicall(masterchefABI, [
  //      {
  //        address: getMasterChefAddress(),
  //        name: 'poolInfo',
  //        params: [farmConfig.pid],
  //      },
  //      {
  //        address: getMasterChefAddress(),
  //        name: 'totalAllocPoint',
  //      },
  //    ])

//      const allocPoint = new BigNumber(info.allocPoint._hex)
//      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint))

      return {
        ...farmConfig,
        tokenAmount: tokenAmount.toJSON(),
        quoteTokenAmount: quoteTokenAmount.toJSON(),
        lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: quoteTokenAmount.div(tokenAmount).toJSON(),
        jarLPDeposits: jarDeposits.toJSON(),
        totalDeposits: totalDeposits.toJSON(),
//        poolWeight: poolWeight.toJSON(),
//        multiplier: `${allocPoint.div(100).toString()}X`,
      }
    }),
  )
  return data
}

export default fetchFarms
