import { createAction, createAsyncThunk } from '@reduxjs/toolkit'

export const fetchBalance = createAction<{balance:string}>('demoRedux/fetchBalance')