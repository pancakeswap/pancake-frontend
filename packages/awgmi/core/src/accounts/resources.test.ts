import { MoveResource } from '@aptos-labs/ts-sdk'
import { describe, expect, it } from 'vitest'

import { coinStoreResourcesFilter, createAccountResourceFilter } from './resources'

const mockResources: MoveResource[] = [
  {
    type: '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>',
    data: {
      coin: {
        value: '287200334',
      },
    },
  },
  {
    type: '0x1::coin::CoinStore<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBNB>',
    data: {
      coin: {
        value: '100000000',
      },
      deposit_events: {
        counter: '1',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '4',
          },
        },
      },
      frozen: false,
      withdraw_events: {
        counter: '0',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '5',
          },
        },
      },
    },
  },
  {
    type: '0x1::coin::CoinStore<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC>',
    data: {
      coin: {
        value: '100000000',
      },
      deposit_events: {
        counter: '2',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '10',
          },
        },
      },
      frozen: false,
      withdraw_events: {
        counter: '1',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '11',
          },
        },
      },
    },
  },
  {
    type: '0x1::coin::CoinStore<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH>',
    data: {
      coin: {
        value: '100000000',
      },
      deposit_events: {
        counter: '1',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '8',
          },
        },
      },
      frozen: false,
      withdraw_events: {
        counter: '0',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '9',
          },
        },
      },
    },
  },
  {
    type: '0x1::coin::CoinStore<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC>',
    data: {
      coin: {
        value: '0',
      },
      deposit_events: {
        counter: '5',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '6',
          },
        },
      },
      frozen: false,
      withdraw_events: {
        counter: '1',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '7',
          },
        },
      },
    },
  },
  {
    type: '0x1::account::Account',
    data: {
      authentication_key: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
      coin_register_events: {
        counter: '5',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '0',
          },
        },
      },
      guid_creation_num: '15',
      key_rotation_events: {
        counter: '0',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '1',
          },
        },
      },
      rotation_capability_offer: {
        for: {
          vec: [],
        },
      },
      sequence_number: '16',
      signer_capability_offer: {
        for: {
          vec: [],
        },
      },
    },
  },
  {
    type: '0xa64d9f1646ce0ac27f0bfa65ad9a4a6abad3560d116a2ffaa99a8a7967806b4d::syrup::SyrupUser<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC>',
    data: {
      amount: '0',
      deposit_events: {
        counter: '1',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '12',
          },
        },
      },
      harvest_events: {
        counter: '1',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '14',
          },
        },
      },
      reward_debt: '0',
      user_limit: false,
      withdraw_events: {
        counter: '1',
        guid: {
          id: {
            addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
            creation_num: '13',
          },
        },
      },
    },
  },
]

describe('resources filter', () => {
  it('CoinStore filter', () => {
    expect(mockResources.filter(coinStoreResourcesFilter)).toMatchInlineSnapshot(`
      [
        {
          "data": {
            "coin": {
              "value": "287200334",
            },
          },
          "type": "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>",
        },
        {
          "data": {
            "coin": {
              "value": "100000000",
            },
            "deposit_events": {
              "counter": "1",
              "guid": {
                "id": {
                  "addr": "0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b",
                  "creation_num": "4",
                },
              },
            },
            "frozen": false,
            "withdraw_events": {
              "counter": "0",
              "guid": {
                "id": {
                  "addr": "0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b",
                  "creation_num": "5",
                },
              },
            },
          },
          "type": "0x1::coin::CoinStore<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBNB>",
        },
        {
          "data": {
            "coin": {
              "value": "100000000",
            },
            "deposit_events": {
              "counter": "2",
              "guid": {
                "id": {
                  "addr": "0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b",
                  "creation_num": "10",
                },
              },
            },
            "frozen": false,
            "withdraw_events": {
              "counter": "1",
              "guid": {
                "id": {
                  "addr": "0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b",
                  "creation_num": "11",
                },
              },
            },
          },
          "type": "0x1::coin::CoinStore<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC>",
        },
        {
          "data": {
            "coin": {
              "value": "100000000",
            },
            "deposit_events": {
              "counter": "1",
              "guid": {
                "id": {
                  "addr": "0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b",
                  "creation_num": "8",
                },
              },
            },
            "frozen": false,
            "withdraw_events": {
              "counter": "0",
              "guid": {
                "id": {
                  "addr": "0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b",
                  "creation_num": "9",
                },
              },
            },
          },
          "type": "0x1::coin::CoinStore<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetETH>",
        },
        {
          "data": {
            "coin": {
              "value": "0",
            },
            "deposit_events": {
              "counter": "5",
              "guid": {
                "id": {
                  "addr": "0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b",
                  "creation_num": "6",
                },
              },
            },
            "frozen": false,
            "withdraw_events": {
              "counter": "1",
              "guid": {
                "id": {
                  "addr": "0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b",
                  "creation_num": "7",
                },
              },
            },
          },
          "type": "0x1::coin::CoinStore<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC>",
        },
      ]
    `)
  })

  const expectResult = [
    {
      data: {
        amount: '0',
        deposit_events: {
          counter: '1',
          guid: {
            id: {
              addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
              creation_num: '12',
            },
          },
        },
        harvest_events: {
          counter: '1',
          guid: {
            id: {
              addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
              creation_num: '14',
            },
          },
        },
        reward_debt: '0',
        user_limit: false,
        withdraw_events: {
          counter: '1',
          guid: {
            id: {
              addr: '0xfb50a1e1e98df1d879c02acab6d65377aba050e8c223e8a0f9694167aa73e16b',
              creation_num: '13',
            },
          },
        },
      },
      type: '0xa64d9f1646ce0ac27f0bfa65ad9a4a6abad3560d116a2ffaa99a8a7967806b4d::syrup::SyrupUser<0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetBTC, 0x8c805723ebc0a7fc5b7d3e7b75d567918e806b3461cb9fa21941a9edc0220bf::devnet_coins::DevnetUSDC>',
    },
  ]
  it('filter with string', () => {
    expect(mockResources.filter(createAccountResourceFilter('SyrupUser'))).toStrictEqual(expectResult)
  })
  it('filter with tag', () => {
    expect(mockResources.filter(createAccountResourceFilter({ moduleName: 'syrup' }))).toStrictEqual(expectResult)
    expect(mockResources.filter(createAccountResourceFilter({ name: 'SyrupUser' }))).toStrictEqual(expectResult)
    expect(
      mockResources.filter(
        createAccountResourceFilter({ address: '0xa64d9f1646ce0ac27f0bfa65ad9a4a6abad3560d116a2ffaa99a8a7967806b4d' }),
      ),
    ).toStrictEqual(expectResult)
  })
})
