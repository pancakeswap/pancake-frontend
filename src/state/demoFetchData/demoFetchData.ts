
import { ChainId } from '@pancakeswap/sdk'
import { bscTestnetTokens, bscTokens, ethwTokens } from '@pancakeswap/tokens'
import BigNumber from 'bignumber.js'
import { ERC20_ABI } from 'config/abi/erc20'
import multicall from 'utils/multicall'
import { tokenBalance } from "./types"

function renderTokenByChain(chainId){
    if( chainId === ChainId.BSC ) {
        return bscTokens.runtogether.address
    } if (chainId === ChainId.ETHW_MAINNET) {
        return ethwTokens.runtogether.address
    } if (chainId === ChainId.BSC_TESTNET) {
        return bscTestnetTokens.runtogether.address
    }
    return ""
}

export const fetchTokenBlance = async (tokenAddress:string, account: string, chainId:number): Promise<tokenBalance> => {
    try {
        const calls = [
           {
             address: tokenAddress,
             name: 'balanceOf',
             params: [account]
           },
        ]
       const [resultBalance] = await multicall(ERC20_ABI, calls, chainId)
      return {
        balance:(new BigNumber(resultBalance).dividedBy(1E18)).toString(),
      }
   } catch (e) {
     console.log(e)
     return {
        balance:"0"
      }
   }
}