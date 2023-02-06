import { ChainId } from '@pancakeswap/sdk'

export const MM_SWAP_CONTRACT_ADDRESS = {
  [ChainId.ETHEREUM]: '0x9Ca2A439810524250E543BA8fB6E88578aF242BC',
  [ChainId.GOERLI]: '0x7bb894Ca487568dD55054193c3238d7B1f46BB92',
}

const GOERLI_WHITE_LIST = ['0x65afadd39029741b3b8f0756952c74678c9cec93', '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6']
export const MM_TOKENS_WHITE_LIST = {
  [ChainId.ETHEREUM]: [],
  [ChainId.GOERLI]: GOERLI_WHITE_LIST,
}

export const MM_SIGNER = {
  [ChainId.ETHEREUM]: '0x13414B047539298D5aeD429722211681eAAb43B7', // TODO: may need to update if MM use different wallet on mainnet
  [ChainId.GOERLI]: '0x13414B047539298D5aeD429722211681eAAb43B7',
}
