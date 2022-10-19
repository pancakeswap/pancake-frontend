
import { useEffect, useReducer, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import { ERC20_ABI } from 'config/abi/erc20'
import { getAddress } from 'utils/addressHelpers'
import { bscTokens, ethwTokens, bscTestnetTokens } from '@pancakeswap/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@pancakeswap/sdk'
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