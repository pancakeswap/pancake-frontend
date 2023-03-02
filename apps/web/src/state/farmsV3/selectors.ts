import { createSelector } from '@reduxjs/toolkit'
import { State } from 'state/types'

export const farmSelector = (chainId: number) =>
  createSelector(
    (state: State) => state.farmsV3,
    (farms) => {
      const deserializedFarmsData = farms.data.filter((farm) => farm.token.chainId === chainId)
      const { poolLength } = farms

      return {
        data: deserializedFarmsData,
        poolLength,
      }
    },
  )
