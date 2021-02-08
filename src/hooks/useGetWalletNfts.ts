import { useWeb3React } from '@web3-react/core'
import { useEffect, useReducer } from 'react'
import { getPancakeRabbitContract } from 'utils/contractHelpers'
import multicall from 'utils/multicall'
import pancakeRabbitsAbi from 'config/abi/pancakeRabbits.json'
import { getPancakeRabbitsAddress } from 'utils/addressHelpers'

const pancakeRabbitsContract = getPancakeRabbitContract()

export type NftMap = {
  [key: number]: {
    tokenUri: string
    tokenIds: number[]
  }
}

type Action = { type: 'set_nfts'; data: NftMap } | { type: 'reset' } | { type: 'refresh'; timestamp: number }

type State = {
  isLoading: boolean
  nfts: NftMap
  lastUpdated: number
}

const initialState: State = {
  isLoading: true,
  nfts: {},
  lastUpdated: Date.now(),
}

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case 'set_nfts':
      return {
        ...initialState,
        isLoading: false,
        nfts: action.data,
      }
    case 'refresh':
      return {
        ...initialState,
        lastUpdated: action.timestamp,
      }
    case 'reset':
      return {
        ...initialState,
        isLoading: false,
      }
    default:
      return state
  }
}

const useGetWalletNfts = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { lastUpdated } = state
  const { account } = useWeb3React()

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const balanceOf = await pancakeRabbitsContract.balanceOf(account)

        if (balanceOf > 0) {
          let nfts: NftMap = {}

          const getTokenIdAndBunnyId = async (index: number) => {
            try {
              const { tokenOfOwnerByIndex } = pancakeRabbitsContract
              const tokenId = await tokenOfOwnerByIndex(account, index)
              const calls = [{
                address: getPancakeRabbitsAddress(),
                name: 'getBunnyId',
                params: [tokenId.toString()],
              }, {
                address: getPancakeRabbitsAddress(),
                name: 'tokenURI',
                params: [tokenId.toString()],
              }]
              const res = await multicall(pancakeRabbitsAbi, calls)
              return [Number(res[0]), Number(tokenId.toString()), res[1]]
            } catch (error) {
              return null
            }
          }

          const tokenIdPromises = []

          for (let i = 0; i < balanceOf; i++) {
            tokenIdPromises.push(getTokenIdAndBunnyId(i))
          }

          const tokenIdsOwnedByWallet = await Promise.all(tokenIdPromises)

          nfts = tokenIdsOwnedByWallet.reduce((accum, association) => {
            if (!association) {
              return accum
            }

            const [bunnyId, tokenId, tokenUri] = association

            return {
              ...accum,
              [bunnyId]: {
                tokenUri,
                tokenIds: accum[bunnyId] ? [...accum[bunnyId].tokenIds, tokenId] : [tokenId],
              },
            }
          }, {})

          dispatch({ type: 'set_nfts', data: nfts })
        } else {
          // Reset it in case of wallet change
          dispatch({ type: 'reset' })
        }
      } catch (error) {
        dispatch({ type: 'reset' })
      }
    }

    if (account) {
      fetchNfts()
    }
  }, [account, lastUpdated, dispatch])

  const refresh = () => dispatch({ type: 'refresh', timestamp: Date.now() })

  return { ...state, refresh }
}

export default useGetWalletNfts
