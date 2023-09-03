import { SeaportData, ConsiderationItem } from '../../src/entities/protocols/seaport'
import { BigNumber } from 'ethers'
import { TEST_RECIPIENT_ADDRESS } from '../utils/addresses'

export const seaportV1_4DataETH: SeaportData = {
  items: [
    {
      parameters: {
        offerer: '0xab0d2ad721399c2e8ec6f340d1e09cbbed7c5f2b',
        offer: [
          {
            itemType: 3,
            token: '0x4f3adef2f4096740774a955e912b5f03f2c7ba2b',
            identifierOrCriteria: '1',
            startAmount: '3',
            endAmount: '3',
          },
        ],
        consideration: [
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '80550000000000000',
            endAmount: '80550000000000000',
            recipient: '0xab0d2ad721399c2e8ec6f340d1e09cbbed7c5f2b',
          },
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '450000000000000',
            endAmount: '450000000000000',
            recipient: '0x0000a26b00c1f0df003000390027140000faa719',
          },
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '9000000000000000',
            endAmount: '9000000000000000',
            recipient: '0x4401a1667dafb63cff06218a69ce11537de9a101',
          },
        ],
        startTime: '1678725221',
        endTime: '1678811621',
        orderType: 1,
        zone: '0x004c00500000ad104d7dbd00e3ae0a5c00560c00',
        zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: '24446860302761739304752683030156737591518664810215442929816957436415552570299',
        conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
        totalOriginalConsiderationItems: 3,
      },
      signature:
        '0x898c4e840db735a6ffb9f4a42920aa36a182940d85c44af97bd0c0bc672573d6b08a70a06c55a125d9ec3c484950b6e86981b4ac937037375f56d4df237bbf9f',
    },
  ],
  recipient: TEST_RECIPIENT_ADDRESS,
  protocolAddress: '0x00000000000001ad428e4906aE43D8F9852d0dD6',
}

export const seaportV1_4DataETHRecent: SeaportData = {
  items: [
    {
      parameters: {
        offerer: '0xdc84079993e56499eed18b938071f551750d0e89',
        zone: '0x004c00500000ad104d7dbd00e3ae0a5c00560c00',
        offer: [
          {
            itemType: 2,
            token: '0xcee3c4f9f52ce89e310f19b363a9d4f796b56a68',
            identifierOrCriteria: '277',
            startAmount: '1',
            endAmount: '1',
          },
        ],
        consideration: [
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '17542000000000000',
            endAmount: '17542000000000000',
            recipient: '0xdc84079993e56499eed18b938071f551750d0e89',
          },
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '489999999999999',
            endAmount: '489999999999999',
            recipient: '0x0000a26b00c1f0df003000390027140000faa719',
          },
          {
            itemType: 0,
            token: '0x0000000000000000000000000000000000000000',
            identifierOrCriteria: '0',
            startAmount: '1567999999999999',
            endAmount: '1567999999999999',
            recipient: '0x1c12aea4bc03469ce2d10227f6e6e63099f42424',
          },
        ],
        orderType: 0,
        startTime: '1681289091',
        endTime: '1689065091',
        zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: '24446860302761739304752683030156737591518664810215442929818314405008806322811',
        conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
        totalOriginalConsiderationItems: '3',
      },
      signature:
        '0x3ad4ad346a8a807051b3601ec311af516f6cc15db1654e082c33e5721de4c1ac9b9254087fc55aeebc142703782998b2b06859a450eb616fd144ae519030bb45',
    },
  ],
  recipient: TEST_RECIPIENT_ADDRESS,
  protocolAddress: '0x00000000000001ad428e4906aE43D8F9852d0dD6',
}

export const seaportV1_4DataERC20: SeaportData = {
  items: [
    {
      parameters: {
        offerer: '0x5e755d47c1874da844b31e08ba70f11d047f96d6',
        offer: [
          {
            itemType: 3,
            token: '0xc36cf0cfcb5d905b8b513860db0cfe63f6cf9f5c',
            identifierOrCriteria: '425352958651173079329218259289710264320000',
            startAmount: '2',
            endAmount: '2',
          },
        ],
        consideration: [
          {
            itemType: 1,
            token: '0x15d4c048f83bd7e37d49ea4c83a07267ec4203da',
            identifierOrCriteria: '0',
            startAmount: '223020000000',
            endAmount: '223020000000',
            recipient: '0x5e755d47c1874da844b31e08ba70f11d047f96d6',
          },
          {
            itemType: 1,
            token: '0x15d4c048f83bd7e37d49ea4c83a07267ec4203da',
            identifierOrCriteria: '0',
            startAmount: '24780000000',
            endAmount: '24780000000',
            recipient: '0xa92abb0d0dd1e8e73006fc3b6229b7bd9e0d5c61',
          },
        ],
        startTime: '1678218282',
        endTime: '1680893082',
        orderType: 1,
        zone: '0x004c00500000ad104d7dbd00e3ae0a5c00560c00',
        zoneHash: '0x0000000000000000000000000000000000000000000000000000000000000000',
        salt: '24446860302761739304752683030156737591518664810215442929813247523325878245709',
        conduitKey: '0x0000007b02230091a7ed01230072f7006a004d60a8d4e71d599b8104250f0000',
        totalOriginalConsiderationItems: '2',
      },
      signature:
        '0x6fd0032bb132c3724b730d55deb59924b8674405ae5e523a95a56b5a258af1d9cc9de9a90aef35ba9311afaf37eb8b0904f2f32e799abf63f073470c595aeefb',
    },
  ],
  recipient: TEST_RECIPIENT_ADDRESS,
  protocolAddress: '0x00000000000001ad428e4906aE43D8F9852d0dD6',
}
