/* eslint-disable camelcase */
export interface IfoPools {
  handle: string
}

export interface Data {
  ifo_pools: IfoPools
}

export interface RootObject {
  type: string
  data: Data
}
