/* eslint-disable camelcase */
export interface Data {
  amount: string
  claimed: boolean
}

export interface RootObject {
  type: string
  data: Data
}
