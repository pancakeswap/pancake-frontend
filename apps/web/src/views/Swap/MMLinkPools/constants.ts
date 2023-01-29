import { ChainId } from '@pancakeswap/sdk'

export const MM_SWAP_CONTRACT_ADDRESS = {
  [ChainId.ETHEREUM]: '',
  [ChainId.GOERLI]: '0xf61F708e3f094fBD5db66CFc3E4367b3023D6Da2',
}

const GOERLI_WHITE_LIST = ['0x65afadd39029741b3b8f0756952c74678c9cec93', '0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6']
export const MM_TOKENS_WHITE_LIST = {
  [ChainId.ETHEREUM]: [],
  [ChainId.GOERLI]: GOERLI_WHITE_LIST,
}

export const MM_SIGNER = {
  [ChainId.ETHEREUM]: '',
  [ChainId.GOERLI]: '0x13414B047539298D5aeD429722211681eAAb43B7',
}
