/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { CollectiblesState } from 'state/types'
import { nftSources } from 'config/constants/nfts'
import { NftType } from 'config/constants/types'
import { getAddress } from 'utils/addressHelpers'
import { getErc721Contract } from 'utils/contractHelpers'
import { getNftByTokenId } from 'utils/collectibles'

const initialState: CollectiblesState = {
  isInitialized: false,
  isLoading: true,
  data: {},
}

type NftSourceItem = [number, string]

// Thunks
export const fetchWalletNfts = createAsyncThunk<NftSourceItem[], string>(
  'collectibles/fetchWalletNfts',
  async (account) => {
    // For each nft source get nft data
    const nftSourcePromises = Object.keys(nftSources).map(async (nftSourceType) => {
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

      const balanceOfResponse = await contract.methods.balanceOf(account).call()
      const balanceOf = Number(balanceOfResponse)

      if (balanceOf === 0) {
        return []
      }

      const nftDataFetchPromises = []

      // For each index get the tokenId and data associated with it
      for (let i = 0; i < balanceOf; i++) {
        nftDataFetchPromises.push(getTokenIdAndData(i))
      }

      const nftData = await Promise.all(nftDataFetchPromises)
      return nftData
    })

    const nftSourceData = await Promise.all(nftSourcePromises)

    return nftSourceData.flat()
  },
)

export const collectiblesSlice = createSlice({
  name: 'collectibles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchWalletNfts.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(fetchWalletNfts.fulfilled, (state, action) => {
      state.isLoading = false
      state.isInitialized = true
      state.data = action.payload.reduce((accum, association) => {
        if (!association) {
          return accum
        }

        const [tokenId, identifier] = association as NftSourceItem

        return {
          ...accum,
          [identifier]: accum[identifier] ? [...accum[identifier], tokenId] : [tokenId],
        }
      }, {})
    })
  },
})

export default collectiblesSlice.reducer
