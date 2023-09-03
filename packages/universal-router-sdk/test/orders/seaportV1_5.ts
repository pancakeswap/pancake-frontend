import { ConsiderationItem, SeaportData } from '../../src/entities/protocols/seaport'
import { BigNumber } from 'ethers'
import { TEST_RECIPIENT_ADDRESS } from '../utils/addresses'

export const seaportV1_5DataETH: SeaportData = {
  items: [
    {
      parameters: {
        offerer: '0x7bca4682999b71d813d541a9cbf73e35216f1417',
        offer: [
          {
            endAmount: '1',
            identifierOrCriteria: '564868729088757849349201848336735231016960',
            itemType: 3,
            startAmount: '1',
            token: '0xc36cf0cfcb5d905b8b513860db0cfe63f6cf9f5c',
          },
        ],
        consideration: [
          {
            endAmount: '57312500000000000',
            identifierOrCriteria: '0',
            itemType: 0,
            recipient: '0x7bca4682999b71d813d541a9cbf73e35216f1417',
            startAmount: '57312500000000000',
            token: '0x0000000000000000000000000000000000000000',
          },
          {
            endAmount: '1637500000000000',
            identifierOrCriteria: '0',
            itemType: 0,
            recipient: '0x0000a26b00c1f0df003000390027140000faa719',
            startAmount: '1637500000000000',
            token: '0x0000000000000000000000000000000000000000',
          },
          {
            endAmount: '6550000000000000',
            identifierOrCriteria: '0',
            itemType: 0,
            recipient: '0x9cfb24366131c42d041139c8abbea45f6527a9b2',
            startAmount: '6550000000000000',
            token: '0x0000000000000000000000000000000000000000',
          },
        ],
        orderType: 1,
        startTime: '1683084765',
        endTime: '1683171165',
        zone: '0x004c00500000ad104d7dbd00e3ae0a5c00560c00',
        zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: '24446860302761739304752683030156737591518664810215442929802117345480319970273',
        conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
        totalOriginalConsiderationItems: '3',
      },
      signature:
        '0xa0cfc9291bb705f32a7d4bea77e9ef4dece18d4424864abad4ea26c81a9e9d144a9dbb7fd18f6819be34a7ed4d6714ddf402255cc5d59e5789c8afef80b7380a',
    },
    {
      parameters: {
        offerer: '0xbadb011bea1305f52f85664a755ed5921bf818ea',
        offer: [
          {
            itemType: 3,
            token: '0xc36cf0cfcb5d905b8b513860db0cfe63f6cf9f5c',
            identifierOrCriteria: '580862000334041957131980454886028336955392',
            startAmount: '1',
            endAmount: '1',
          },
        ],
        consideration: [
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '95375000000000000',
            endAmount: '95375000000000000',
            recipient: '0xbadb011bea1305f52f85664a755ed5921bf818ea',
          },
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '2725000000000000',
            endAmount: '2725000000000000',
            recipient: '0x0000a26b00c1f0df003000390027140000faa719',
          },
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '10900000000000000',
            endAmount: '10900000000000000',
            recipient: '0x9cfb24366131c42d041139c8abbea45f6527a9b2',
          },
        ],
        orderType: 1,
        startTime: '1683052606',
        endTime: '1685731006',
        zone: '0x004c00500000ad104d7dbd00e3ae0a5c00560c00',
        zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: '24446860302761739304752683030156737591518664810215442929811933767042559172667',
        conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
        totalOriginalConsiderationItems: '3',
      },
      signature:
        '0x8a73c1158a78eee531d4a8dd4be4b33edbf64a1cfa65020c9108102c17bc9a7c159ddaca7223478b0aaf3cfe113c3a3448dcd86996efe72d574b1c02c5ed83cf',
    },
  ],
  recipient: TEST_RECIPIENT_ADDRESS,
  protocolAddress: '0x00000000000000ADc04C56Bf30aC9d3c0aAF14dC',
}

export function calculateSeaportValue(considerations: ConsiderationItem[], token: string): BigNumber {
  return considerations.reduce(
    (amt: BigNumber, consideration: ConsiderationItem) =>
      consideration.token == token ? amt.add(consideration.startAmount) : amt,
    BigNumber.from(0)
  )
}
