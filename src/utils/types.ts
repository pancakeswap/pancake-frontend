import ethers, { Contract, ContractFunction } from 'ethers'

export type MultiCallResponse<T> = T | null



// Chainlink Oracle
export type ChainLinkOracleLatestAnswerResponse = ethers.BigNumber

export interface ChainLinkOracleContract extends Contract {
  latestAnswer: ContractFunction<ChainLinkOracleLatestAnswerResponse>
}



