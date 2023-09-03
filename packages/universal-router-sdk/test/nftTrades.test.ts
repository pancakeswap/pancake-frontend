import { expect } from 'chai'
import { BigNumber, utils, Wallet } from 'ethers'
import { hexToDecimalString } from './utils/hexToDecimalString'
import { expandTo18DecimalsBN } from '../src/utils/numbers'
import { SwapRouter } from '../src/swapRouter'
import { TokenType } from '../src/entities/NFTTrade'
import { FoundationTrade, FoundationData } from '../src/entities/protocols/foundation'
import { SeaportTrade } from '../src/entities/protocols/seaport'
import { seaportV1_5DataETH } from './orders/seaportV1_5'
import { NFTXTrade, NFTXData } from '../src/entities/protocols/nftx'
import { NFT20Trade, NFT20Data } from '../src/entities/protocols/nft20'
import { x2y2Orders } from './orders/x2y2'
import { SudoswapTrade, SudoswapData } from '../src/entities/protocols/sudoswap'
import { CryptopunkTrade, CryptopunkData } from '../src/entities/protocols/cryptopunk'
import { X2Y2Data, X2Y2Trade } from '../src/entities/protocols/x2y2'
import { registerFixture } from './forge/writeInterop'
import { seaportV1_4DataETH, seaportV1_4DataETHRecent, seaportV1_4DataERC20 } from './orders/seaportV1_4'
import { FORGE_PERMIT2_ADDRESS, FORGE_ROUTER_ADDRESS, TEST_RECIPIENT_ADDRESS } from './utils/addresses'
import { ETH_ADDRESS } from '../src/utils/constants'
import { generatePermitSignature, makePermit } from './utils/permit2'
import { ElementTrade } from '../src/entities/protocols/element-market'
import { elementDataETH, elementDataETH_WithFees } from './orders/element'
import { LooksRareV2Data, LooksRareV2Trade } from '../src/entities/protocols/looksRareV2'
import { looksRareV2Orders } from './orders/looksRareV2'

describe('SwapRouter', () => {
  const recipient = TEST_RECIPIENT_ADDRESS
  const looksRareV2Data: LooksRareV2Data = {
    apiOrder: looksRareV2Orders[0],
    taker: recipient,
  }

  describe('#swapNFTCallParameters', () => {
    it('returns hex number value in Method Parameters', async () => {
      const foundationData: FoundationData = {
        referrer: '0x459e213D8B5E79d706aB22b945e3aF983d51BC4C',
        tokenAddress: '0xEf96021Af16BD04918b0d87cE045d7984ad6c38c',
        tokenId: 32,
        price: expandTo18DecimalsBN(0.01),
        recipient,
      }

      const foundationTrade = new FoundationTrade([foundationData])
      const methodParameters = SwapRouter.swapNFTCallParameters([foundationTrade])
      expect(methodParameters.value).to.eq('0x2386f26fc10000')
    })
  })

  describe('Foundation', () => {
    // buyItem from block 15725945
    const foundationData: FoundationData = {
      referrer: '0x459e213D8B5E79d706aB22b945e3aF983d51BC4C',
      tokenAddress: '0xEf96021Af16BD04918b0d87cE045d7984ad6c38c',
      tokenId: 32,
      price: expandTo18DecimalsBN(0.01),
      recipient,
    }

    it('encodes a single foundation trade', async () => {
      const foundationTrade = new FoundationTrade([foundationData])
      const methodParameters = SwapRouter.swapNFTCallParameters([foundationTrade])
      const methodParametersV2 = SwapRouter.swapCallParameters(foundationTrade)
      registerFixture('_FOUNDATION_BUY_ITEM', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(foundationData.price.toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('NFTX', () => {
    // buyItems from block 17029002
    const price: BigNumber = BigNumber.from('2016360357822219079')
    const nftxPurchase: NFTXData = {
      recipient,
      vaultId: 392, // milady vault ID
      tokenAddress: '0x5Af0D9827E0c53E4799BB226655A1de152A425a5',
      tokenIds: [7132],
      value: price,
      swapCalldata:
        '0xd9627aa400000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000001bfb8d0ff32c43470000000000000000000000000000000000000000000000000e27c49886e6000000000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000227c7df69d3ed1ae7574a1a7685fded90292eb48869584cd00000000000000000000000010000000000000000000000000000000000000110000000000000000000000000000000000000000000000465b3a7f1b643618cb',
    }

    it('encodes buying an NFT from a single NFTX vault', async () => {
      const nftxTrade = new NFTXTrade([nftxPurchase])
      const methodParameters = SwapRouter.swapNFTCallParameters([nftxTrade])
      const methodParametersV2 = SwapRouter.swapCallParameters(nftxTrade)
      registerFixture('_NFTX_BUY_ITEMS', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(price.toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('LooksRareV2', () => {
    it('encodes buying one ERC721 from LooksRare', async () => {
      // buy items from block 17030830
      const looksRareV2Data: LooksRareV2Data = {
        apiOrder: looksRareV2Orders[0],
        taker: recipient,
      }
      const looksRareV2Trade = new LooksRareV2Trade([looksRareV2Data])
      const methodParameters = SwapRouter.swapNFTCallParameters([looksRareV2Trade])
      const methodParametersV2 = SwapRouter.swapCallParameters(looksRareV2Trade)
      registerFixture('_LOOKSRARE_V2_BUY_ITEM_721', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(looksRareV2Data.apiOrder.price)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes batch buying 2 ERC721s from LooksRare', async () => {
      // buy items from block 17037140
      const looksRareV2Data1: LooksRareV2Data = {
        apiOrder: looksRareV2Orders[1],
        taker: recipient,
      }
      const looksRareV2Data2: LooksRareV2Data = {
        apiOrder: looksRareV2Orders[2],
        taker: recipient,
      }
      const totalPrice = BigNumber.from(looksRareV2Data1.apiOrder.price).add(looksRareV2Data2.apiOrder.price)
      const looksRareV2Trade = new LooksRareV2Trade([looksRareV2Data1, looksRareV2Data2])
      const methodParameters = SwapRouter.swapNFTCallParameters([looksRareV2Trade])
      const methodParametersV2 = SwapRouter.swapCallParameters(looksRareV2Trade)
      registerFixture('_LOOKSRARE_V2_BATCH_BUY_ITEM_721', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(totalPrice.toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('Element Market', () => {
    // buy an ERC721 from block 16627214
    it('encodes buying one ERC721 from Element', async () => {
      const elementTrade = new ElementTrade([elementDataETH])
      const methodParameters = SwapRouter.swapNFTCallParameters([elementTrade])
      const methodParametersV2 = SwapRouter.swapCallParameters(elementTrade)
      registerFixture('_ELEMENT_BUY_ITEM_721', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(elementDataETH.order.erc20TokenAmount)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes buying one ERC721 with fees from Element', async () => {
      const elementTrade = new ElementTrade([elementDataETH_WithFees])
      const methodParameters = SwapRouter.swapNFTCallParameters([elementTrade])
      const methodParametersV2 = SwapRouter.swapCallParameters(elementTrade)
      const value = elementTrade.getOrderPriceIncludingFees(elementDataETH_WithFees.order)
      registerFixture('_ELEMENT_BUY_ITEM_721_WITH_FEES', methodParametersV2)
      /// value should be equal to erc20amount plus fees
      expect(hexToDecimalString(methodParameters.value)).to.eq(value.toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
      expect(methodParameters.value).to.not.eq(elementDataETH_WithFees.order.erc20TokenAmount)
    })
  })

  describe('X2Y2', () => {
    const x2y2SignedOrder721 = x2y2Orders[0]
    const x2y2SignedOrder1155 = x2y2Orders[1]
    const ENS_NFT_ADDR = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85'
    const CAMEO_ADDRESS = '0x93317E87a3a47821803CAADC54Ae418Af80603DA'

    const x2y2_721_Data: X2Y2Data = {
      signedInput: x2y2SignedOrder721.input,
      recipient,
      price: x2y2SignedOrder721.price,
      tokenId: x2y2SignedOrder721.token_id,
      tokenAddress: ENS_NFT_ADDR,
      tokenType: TokenType.ERC721,
    }

    const x2y2_1155_Data: X2Y2Data = {
      signedInput: x2y2SignedOrder1155.input,
      recipient,
      price: x2y2SignedOrder1155.price,
      tokenId: x2y2SignedOrder1155.token_id,
      tokenAddress: CAMEO_ADDRESS,
      tokenType: TokenType.ERC1155,
      tokenAmount: 1,
    }

    it('encodes buying one ERC-721 from X2Y2', async () => {
      const x2y2Trade = new X2Y2Trade([x2y2_721_Data])
      const methodParameters = SwapRouter.swapNFTCallParameters([x2y2Trade])
      const methodParametersV2 = SwapRouter.swapCallParameters(x2y2Trade)
      registerFixture('_X2Y2_721_BUY_ITEM', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(x2y2SignedOrder721.price)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
    it('encodes buying one ERC-1155 from X2Y2', async () => {
      const x2y2Trade = new X2Y2Trade([x2y2_1155_Data])
      const methodParameters = SwapRouter.swapNFTCallParameters([x2y2Trade])
      const methodParametersV2 = SwapRouter.swapCallParameters(x2y2Trade)
      registerFixture('_X2Y2_1155_BUY_ITEM', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(x2y2SignedOrder1155.price)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('SeaportV1_5', () => {
    it('encodes buying two NFTs from Seaport v1.5 with ETH', async () => {
      const seaportTrade = new SeaportTrade([seaportV1_5DataETH])
      const value = seaportTrade.getTotalPrice(ETH_ADDRESS)
      const methodParameters = SwapRouter.swapNFTCallParameters([seaportTrade])
      const methodParametersV2 = SwapRouter.swapCallParameters(seaportTrade)
      registerFixture('_SEAPORT_V1_5_BUY_ITEMS_ETH', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(value.toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('SeaportV1_4', () => {
    const wallet = new Wallet(utils.zeroPad('0x1234', 32))

    it('encodes buying two NFTs from Seaport v1.4 with ETH', async () => {
      const seaportV1_4Trade = new SeaportTrade([seaportV1_4DataETH])
      const value = seaportV1_4Trade.getTotalPrice(ETH_ADDRESS)
      const methodParameters = SwapRouter.swapNFTCallParameters([seaportV1_4Trade])
      const methodParametersV2 = SwapRouter.swapCallParameters(seaportV1_4Trade)
      registerFixture('_SEAPORT_V1_4_BUY_ITEMS_ETH', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(value.toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes buying 1 NFT from Seaport with ERC20, with Permit and Approve', async () => {
      // get the basic seaport data for ERC20 trade
      let seaportData = seaportV1_4DataERC20

      // make permit
      const GALA_ADDRESS = '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA'
      const permit2Data = makePermit(GALA_ADDRESS, undefined, undefined, FORGE_ROUTER_ADDRESS)
      const signature = await generatePermitSignature(permit2Data, wallet, 1, FORGE_PERMIT2_ADDRESS)
      seaportData.inputTokenProcessing = [
        {
          token: GALA_ADDRESS,
          protocolApproval: true,
          permit2TransferFrom: true,
          permit2Permit: {
            ...permit2Data,
            signature,
          },
        },
      ]

      const seaportTrade = new SeaportTrade([seaportData])
      const methodParameters = SwapRouter.swapCallParameters(seaportTrade)
      registerFixture('_SEAPORT_V1_4_BUY_ITEMS_ERC20_PERMIT_AND_APPROVE', methodParameters)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
    })

    it('encodes buying 1 NFT from Seaport with ERC20, with Permit', async () => {
      // get the basic seaport data for ERC20 trade
      let seaportData = seaportV1_4DataERC20

      // add permit and transfer
      const GALA_ADDRESS = '0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA'
      const permit2Data = makePermit(GALA_ADDRESS, undefined, undefined, FORGE_ROUTER_ADDRESS)
      const signature = await generatePermitSignature(permit2Data, wallet, 1, FORGE_PERMIT2_ADDRESS)
      seaportData.inputTokenProcessing = [
        {
          token: GALA_ADDRESS,
          protocolApproval: false, // no approval
          permit2TransferFrom: true,
          permit2Permit: {
            ...permit2Data,
            signature,
          },
        },
      ]

      const seaportTrade = new SeaportTrade([seaportData])
      const methodParameters = SwapRouter.swapCallParameters(seaportTrade)
      registerFixture('_SEAPORT_V1_4_BUY_ITEMS_ERC20_PERMIT_NO_APPROVE', methodParameters)
      expect(hexToDecimalString(methodParameters.value)).to.eq('0')
    })
  })

  describe('Cryptopunk', () => {
    // buyItem from block 15725945
    const cryptopunk: CryptopunkData = {
      tokenId: 2976,
      recipient,
      value: BigNumber.from('76950000000000000000'),
    }

    it('encodes a single cryptopunk trade', async () => {
      const cryptopunkTrade = new CryptopunkTrade([cryptopunk])
      const methodParameters = SwapRouter.swapNFTCallParameters([cryptopunkTrade])
      const methodParametersV2 = SwapRouter.swapCallParameters(cryptopunkTrade)
      registerFixture('_CRYPTOPUNK_BUY_ITEM', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(cryptopunk.value.toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('nft20', () => {
    // buyItem from block 15770228
    const nft20Data: NFT20Data = {
      tokenIds: [129, 193, 278],
      tokenAddress: '0x6d05064fe99e40f1c3464e7310a23ffaded56e20',
      tokenAmounts: [1, 1, 1],
      recipient,
      fee: 0,
      isV3: false,
      value: BigNumber.from('20583701229648230'),
    }

    it('encodes an NFT20 trade with three items', async () => {
      const nft20Trade = new NFT20Trade([nft20Data])
      const methodParameters = SwapRouter.swapNFTCallParameters([nft20Trade])
      const methodParametersV2 = SwapRouter.swapCallParameters(nft20Trade)
      registerFixture('_NFT20_BUY_ITEM', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(nft20Data.value.toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('sudoswap', () => {
    // buyItem from block 15770228
    const sudoswapData: SudoswapData = {
      swaps: [
        {
          swapInfo: {
            pair: '0x339e7004372e04b1d59443f0ddc075efd9d80360',
            nftIds: [80, 35, 93],
          },
          tokenAddress: '0xfa9937555dc20a020a161232de4d2b109c62aa9c',
          maxCost: '73337152777777783',
        },
      ],
      nftRecipient: recipient,
      ethRecipient: recipient,
      deadline: '2000000000',
    }

    it('encodes an Sudoswap trade with three items', async () => {
      const sudoswapTrade = new SudoswapTrade([sudoswapData])
      const methodParameters = SwapRouter.swapNFTCallParameters([sudoswapTrade])
      const methodParametersV2 = SwapRouter.swapCallParameters(sudoswapTrade)
      registerFixture('_SUDOSWAP_BUY_ITEM', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(sudoswapData.swaps[0].maxCost.toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })

  describe('Partial Fill', () => {
    const invalidLooksRareV2Data: LooksRareV2Data = {
      ...looksRareV2Data,
      apiOrder: { ...looksRareV2Data.apiOrder, itemIds: ['1'] },
    }

    it('encodes partial fill for multiple trades between protocols', async () => {
      const invalidLooksRareV2Trade = new LooksRareV2Trade([invalidLooksRareV2Data])
      const looksRareV2Value = invalidLooksRareV2Trade.getTotalPrice()
      const seaportTrade = new SeaportTrade([seaportV1_4DataETHRecent])
      const seaportValue = seaportTrade.getTotalPrice(ETH_ADDRESS)
      const totalValue = looksRareV2Value.add(seaportValue).toString()

      const methodParameters = SwapRouter.swapNFTCallParameters([invalidLooksRareV2Trade, seaportTrade])
      const methodParametersV2 = SwapRouter.swapCallParameters([invalidLooksRareV2Trade, seaportTrade])
      registerFixture('_PARTIAL_FILL', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(totalValue)
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })

    it('encodes partial fill for multiple swaps within the same protocol', async () => {
      // buyItem from block 15725945
      const foundationData1: FoundationData = {
        referrer: '0x459e213D8B5E79d706aB22b945e3aF983d51BC4C',
        tokenAddress: '0xEf96021Af16BD04918b0d87cE045d7984ad6c38c',
        tokenId: 32,
        price: expandTo18DecimalsBN(0.01),
        recipient,
      }

      // buyItem from block 15725945
      const foundationData2: FoundationData = {
        referrer: '0x459e213D8B5E79d706aB22b945e3aF983d51BC4C',
        tokenAddress: '0xEf96021Af16BD04918b0d87cE045d7984ad6c38c',
        tokenId: 100, // invalid not for sale
        price: expandTo18DecimalsBN(0.01),
        recipient,
      }

      const value = BigNumber.from(foundationData1.price).add(foundationData2.price)

      const foundationTrade = new FoundationTrade([foundationData1, foundationData2])
      const methodParameters = SwapRouter.swapNFTCallParameters([foundationTrade])
      const methodParametersV2 = SwapRouter.swapCallParameters(foundationTrade)
      registerFixture('_PARTIAL_FILL_WITHIN_PROTOCOL', methodParametersV2)
      expect(hexToDecimalString(methodParameters.value)).to.eq(value.toString())
      expect(methodParameters.calldata).to.eq(methodParametersV2.calldata)
      expect(methodParameters.value).to.eq(methodParametersV2.value)
    })
  })
})
