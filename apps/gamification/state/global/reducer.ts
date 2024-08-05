/* eslint-disable no-param-reassign */
import { createReducer } from '@reduxjs/toolkit'

export interface GlobalState {}

export const initialState: GlobalState = {}

export default createReducer(initialState, (builder) => builder)
