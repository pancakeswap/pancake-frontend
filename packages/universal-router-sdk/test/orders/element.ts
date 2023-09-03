import { ElementData, OrderSignature, ERC721SellOrder } from '../../src/entities/protocols/element-market'
import { ZERO_ADDRESS } from '../../src/utils/constants'
import { TEST_RECIPIENT_ADDRESS } from '../utils/addresses'

export const elementOrderETH: ERC721SellOrder = {
  maker: '0xABd6a19345943dD175026Cdb52902FD3392a3262',
  taker: '0x75B6568025f463a98fB01082eEb6dCe04efA3Ae4',
  expiry: '7199994275163324196',
  nonce: '3',
  erc20Token: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  erc20TokenAmount: '55000000000000000',
  fees: [],
  nft: '0x4C69dBc3a2Aa3476c3F7a1227ab70950DB1F4858',
  nftId: '998',
}

export const elementSignatureETH: OrderSignature = {
  signatureType: 0,
  v: 27,
  r: '0x59ceb2bc0e21029209e6cfa872b1224631b01da3e19d25fad9b929b8be4e6f60',
  s: '0x72cadb8ed8a5bf5938829f888ff60c9ebe163954dc15af3e5d6014e8f6801b83',
}

export const elementOrderETH_WithFees: ERC721SellOrder = {
  maker: '0xd9d9c1141239f2b7f0604cde48bf3d6e809f4aeb',
  taker: '0x0000000000000000000000000000000000000000',
  expiry: '7212658763627609514',
  nonce: '26',
  erc20Token: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  erc20TokenAmount: '36340000000000000',
  fees: [
    {
      recipient: '0x00ca62445b06a9adc1879a44485b4efdcb7b75f3',
      amount: '197500000000000',
      feeData: '0x',
    },
    {
      recipient: '0x44403685c1335a42a1d88ecf781b270a20e973ee',
      amount: '2962500000000000',
      feeData: '0x',
    },
  ],
  nft: '0x4c69dbc3a2aa3476c3f7a1227ab70950db1f4858',
  nftId: '2540',
}

export const elementOrderETH_WithFees_Signature: OrderSignature = {
  signatureType: 0,
  v: 28,
  r: '0x5b80d409a0085b624d82fa6c60a4a9ec28dd898f243ce7c058f9b109c9de927f',
  s: '0x3401627e461312e0069f4e8dab96c120e3b62f2fa1ce0e52927bca00fd70ef0c',
}

export const elementDataETH: ElementData = {
  order: elementOrderETH,
  signature: elementSignatureETH,
  recipient: elementOrderETH.taker,
}

export const elementDataETH_WithFees: ElementData = {
  order: elementOrderETH_WithFees,
  signature: elementOrderETH_WithFees_Signature,
  recipient: TEST_RECIPIENT_ADDRESS,
}
