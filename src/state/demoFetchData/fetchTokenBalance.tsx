
import { useEffect, useReducer, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import BigNumber from 'bignumber.js'
import multicall from 'utils/multicall'
import { ERC20_ABI } from 'config/abi/erc20'
import { getAddress } from 'utils/addressHelpers'
import { bscTokens, ethwTokens, bscTestnetTokens } from '@pancakeswap/tokens'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { ChainId } from '@pancakeswap/sdk'

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

export const FetchBalanceToken = () => {
    const { chainId } = useActiveWeb3React()
    const [ dataUser, setDataUser ] = useState({
      balance:"0",
    })
    const tokenAddress = renderTokenByChain(chainId)
    const account = "0xA6912ed0CB1700c0fa7200Dfe26e90dd2aE2364a"
    useEffect(() => {
      const fetchBalance = async () => {
        try {
             const calls = [
                {
                  address: tokenAddress,
                  name: 'balanceOf',
                  params: [account]
                },
             ]
            const [resultBalance] = await multicall(ERC20_ABI, calls, chainId)
            setDataUser({
              balance:(new BigNumber(resultBalance).dividedBy(1E18)).toString(),
            })
        } catch (e) {
          console.log(e)
        }
      }
  
      if (account && tokenAddress) {
        fetchBalance()
      }
    }, [chainId, account])
  
    return { dataUser }
  }