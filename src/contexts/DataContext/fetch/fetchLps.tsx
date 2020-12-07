import BigNumber from 'bignumber.js'
import addresses from 'sushi/lib/constants/contracts'
import erc20 from 'sushi/lib/abi/erc20.json'
import masterchefABI from 'sushi/lib/abi/masterchef.json'
import multicall from 'utils/multicall'
import farmsConfig from 'sushi/lib/constants/farms'

const CHAIN_ID = process.env.REACT_APP_CHAIN_ID

const fetchLps = async () => {
  const data = await Promise.all(
    farmsConfig.map(async (farmConfig) => {
      const calls = [
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'decimals',
        },
        {
          address: farmConfig.tokenAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [farmConfig.lpAddresses[CHAIN_ID]],
        },
        {
          address: farmConfig.lpAddresses[CHAIN_ID],
          name: 'balanceOf',
          params: [addresses.masterChef[56]],
        },
        {
          address: farmConfig.lpAddresses[CHAIN_ID],
          name: 'totalSupply',
        },
        {
          address: farmConfig.quoteTokenAdresses[CHAIN_ID],
          name: 'balanceOf',
          params: [farmConfig.lpAddresses[CHAIN_ID]],
        },
      ]

      const res = await multicall(erc20, calls)

      const [tokenDecimals, tokenAmountWholeLP, balance, totalSupply, lpContractValue] = res

      // Return p1 * w1 * 2
      const lpContractValueBN = new BigNumber(lpContractValue)
      const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
      const totalLpValue = portionLp.times(lpContractValueBN).times(new BigNumber(2))
      // Calculate
      const tokenAmount = new BigNumber(tokenAmountWholeLP).times(portionLp).div(new BigNumber(10).pow(tokenDecimals))
      const wbnbAmount = lpContractValueBN.times(portionLp).div(new BigNumber(10).pow(18))

      const [info, totalAllocPoint] = await multicall(masterchefABI, [
        {
          address: addresses.masterChef[56],
          name: 'poolInfo',
          params: [farmConfig.pid],
        },
        {
          address: addresses.masterChef[56],
          name: 'totalAllocPoint',
        },
      ])

      // eslint-disable-next-line no-underscore-dangle
      const poolWeight = new BigNumber(info.allocPoint._hex).div(new BigNumber(totalAllocPoint))

      return {
        ...farmConfig,
        tokenDecimals,
        tokenAmount,
        wbnbAmount,
        totalWbnbValue: totalLpValue.div(new BigNumber(10).pow(18)),
        tokenPrice: wbnbAmount.div(tokenAmount),
        poolWeight,
      }
    }),
  )
  return data
}

export default fetchLps
