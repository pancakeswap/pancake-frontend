import { createSlice } from '@reduxjs/toolkit'
import { State } from './types'

const initialState: State = {
  collections: [],
  users: [],
}

export const NftMarket = createSlice({
  name: 'NftMarket',
  initialState,
  reducers: {},
})

export default NftMarket.reducer
