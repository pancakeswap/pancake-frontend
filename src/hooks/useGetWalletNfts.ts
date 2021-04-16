import { useWeb3React } from '@web3-react/core'
import Nfts, { nftSources } from 'config/constants/nfts'
import { Nft, NftType } from 'config/constants/types'
import { merge } from 'lodash'
import { useEffect, useReducer } from 'react'
import { getAddress } from 'utils/addressHelpers'
import { getNftByTokenId } from 'utils/collectibles'
import { getErc721Contract } from 'utils/contractHelpers'

export type NftDataMap = {
  [key: string]: number[]
}

type Action = { type: 'set_nfts'; data: NftDataMap } | { type: 'reset' } | { type: 'refresh'; timestamp: number }

type State = {
  isLoading: boolean
  tokenIds: NftDataMap
  lastUpdated: number
}

const initialState: State = {
  isLoading: true,
  tokenIds: {},
  lastUpdated: Date.now(),
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'set_nfts':
      return {
        ...state,
        isLoading: false,
        tokenIds: merge({}, state.tokenIds, action.data),
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
  const { account } = useWeb3React()
  const { lastUpdated } = state

  /**
   * Helper function to get tokenIds by identifier
   */
  const getTokenIdsByIdentifier = (identifier: Nft['identifier']) => {
    return state.tokenIds[identifier] || []
  }

  /**
   * Helper function to return all nfts in the config that are in the tokenIds
   */
  const getNftsInWallet = () => {
    const identifiers = Object.keys(state.tokenIds)
    return Nfts.filter((nft) => identifiers.includes(nft.identifier))
  }

  useEffect(() => {
    const fetchCollectibles = async () => {
      // For each nft source get nft data
      Object.keys(nftSources).forEach(async (nftSourceType) => {
        const { address: addressObj } = nftSources[nftSourceType as NftType]
        const address = getAddress(addressObj)
        const contract = getErc721Contract(address)

        const getTokenIdAndData = async (index: number) => {
          try {
            const tokenId = await contract.methods.tokenOfOwnerByIndex(account, index).call()
            const walletNft = await getNftByTokenId(address, tokenId)
            return [Number(tokenId), walletNft.identifier]
          } catch (error) {
            console.error('getTokenIdAndData', error)
            return null
          }
        }

        try {
          const balanceOfResponse = await contract.methods.balanceOf(account).call()
          const balanceOf = Number(balanceOfResponse)

          if (balanceOf > 0) {
            const nftDataFetchPromises = []

            // For each index get the tokenId and data associated with it
            for (let i = 0; i < balanceOf; i++) {
              nftDataFetchPromises.push(getTokenIdAndData(i))
            }

            const walletNftData = await Promise.all(nftDataFetchPromises)

            // Format final values and add them to state
            const nftTokenIdsByIdentifier: NftDataMap = walletNftData.reduce((accum, association) => {
              if (!association) {
                return accum
              }

              const [tokenId, identifier] = association as [number, Nft['identifier']]

              return {
                ...accum,
                [identifier]: accum[identifier] ? [...accum[identifier], tokenId] : [tokenId],
              }
            }, {})

            dispatch({ type: 'set_nfts', data: nftTokenIdsByIdentifier })
          }
        } catch {
          dispatch({ type: 'reset' })
        }
      })
    }

    if (account) {
      fetchCollectibles()
    }
  }, [account, lastUpdated, dispatch])

  const refresh = () => dispatch({ type: 'refresh', timestamp: Date.now() })

  return { ...state, refresh, getTokenIdsByIdentifier, getNftsInWallet }
}

export default useGetWalletNfts
