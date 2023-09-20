export const fixedStakingABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolIndex',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'amount',
        type: 'uint128',
      },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolIndex',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'amount',
        type: 'uint128',
      },
    ],
    name: 'Harvest',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Paused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'accumAmount',
        type: 'uint128',
      },
    ],
    name: 'PendingWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'lockPeriod',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolIndex',
        type: 'uint256',
      },
    ],
    name: 'PoolAdded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolIndex',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'state',
        type: 'bool',
      },
    ],
    name: 'PoolChangeState',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolIndex',
        type: 'uint256',
      },
    ],
    name: 'PoolChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
    ],
    name: 'TokenWithdraw',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'Unpaused',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'poolIndex',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint128',
        name: 'amount',
        type: 'uint128',
      },
    ],
    name: 'Withdraw',
    type: 'event',
  },
  {
    inputs: [],
    name: 'PERCENT_BASE',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'contract IERC20Upgradeable',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'endDay',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'lockDayPercent',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'boostDayPercent',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'unlockDayPercent',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'lockPeriod',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'withdrawalCut1',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'withdrawalCut2',
            type: 'uint32',
          },
          {
            internalType: 'bool',
            name: 'depositEnabled',
            type: 'bool',
          },
          {
            internalType: 'uint128',
            name: 'maxDeposit',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'minDeposit',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'totalDeposited',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'maxPoolAmount',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'minBoostAmount',
            type: 'uint128',
          },
        ],
        internalType: 'struct PancakeFixedStaking.Pool',
        name: '_pool',
        type: 'tuple',
      },
    ],
    name: 'addPool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cakePool',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'contract IERC20Upgradeable',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint32',
            name: 'endDay',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'lockDayPercent',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'boostDayPercent',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'unlockDayPercent',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'lockPeriod',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'withdrawalCut1',
            type: 'uint32',
          },
          {
            internalType: 'uint32',
            name: 'withdrawalCut2',
            type: 'uint32',
          },
          {
            internalType: 'bool',
            name: 'depositEnabled',
            type: 'bool',
          },
          {
            internalType: 'uint128',
            name: 'maxDeposit',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'minDeposit',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'totalDeposited',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'maxPoolAmount',
            type: 'uint128',
          },
          {
            internalType: 'uint128',
            name: 'minBoostAmount',
            type: 'uint128',
          },
        ],
        internalType: 'struct PancakeFixedStaking.Pool',
        name: '_pool',
        type: 'tuple',
      },
    ],
    name: 'changePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'dailyDeposit',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'dailyWithdraw',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint128',
        name: '_amount',
        type: 'uint128',
      },
    ],
    name: 'deposit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'earn',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getCurrentDay',
    outputs: [
      {
        internalType: 'uint32',
        name: 'currentDay',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'poolId',
        type: 'uint256',
      },
      {
        internalType: 'uint32',
        name: 'firstDay',
        type: 'uint32',
      },
      {
        internalType: 'uint256',
        name: 'count',
        type: 'uint256',
      },
    ],
    name: 'getDailyBalances',
    outputs: [
      {
        internalType: 'uint128[]',
        name: '_deposit',
        type: 'uint128[]',
      },
      {
        internalType: 'uint128[]',
        name: '_withdraw',
        type: 'uint128[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_user',
        type: 'address',
      },
    ],
    name: 'getUserInfo',
    outputs: [
      {
        components: [
          {
            components: [
              {
                internalType: 'contract IERC20Upgradeable',
                name: 'token',
                type: 'address',
              },
              {
                internalType: 'uint32',
                name: 'endDay',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'lockDayPercent',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'boostDayPercent',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'unlockDayPercent',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'lockPeriod',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'withdrawalCut1',
                type: 'uint32',
              },
              {
                internalType: 'uint32',
                name: 'withdrawalCut2',
                type: 'uint32',
              },
              {
                internalType: 'bool',
                name: 'depositEnabled',
                type: 'bool',
              },
              {
                internalType: 'uint128',
                name: 'maxDeposit',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'minDeposit',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'totalDeposited',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'maxPoolAmount',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'minBoostAmount',
                type: 'uint128',
              },
            ],
            internalType: 'struct PancakeFixedStaking.Pool',
            name: 'pool',
            type: 'tuple',
          },
          {
            components: [
              {
                internalType: 'uint128',
                name: 'userDeposit',
                type: 'uint128',
              },
              {
                internalType: 'uint128',
                name: 'accrueInterest',
                type: 'uint128',
              },
              {
                internalType: 'uint32',
                name: 'lastDayAction',
                type: 'uint32',
              },
              {
                internalType: 'bool',
                name: 'boost',
                type: 'bool',
              },
            ],
            internalType: 'struct PancakeFixedStaking.UserInfo',
            name: 'userInfo',
            type: 'tuple',
          },
          {
            internalType: 'uint32',
            name: 'endLockTime',
            type: 'uint32',
          },
        ],
        internalType: 'struct PancakeFixedStaking.InfoFront',
        name: 'info',
        type: 'tuple',
      },
      {
        internalType: 'uint32',
        name: 'currentDay',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
      },
    ],
    name: 'harvest',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_cakePool',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_earn',
        type: 'address',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'pause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'pendingWithdraw',
    outputs: [
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolLength',
    outputs: [
      {
        internalType: 'uint256',
        name: 'length',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'pools',
    outputs: [
      {
        internalType: 'contract IERC20Upgradeable',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: 'endDay',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'lockDayPercent',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'boostDayPercent',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'unlockDayPercent',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'lockPeriod',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'withdrawalCut1',
        type: 'uint32',
      },
      {
        internalType: 'uint32',
        name: 'withdrawalCut2',
        type: 'uint32',
      },
      {
        internalType: 'bool',
        name: 'depositEnabled',
        type: 'bool',
      },
      {
        internalType: 'uint128',
        name: 'maxDeposit',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'minDeposit',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'totalDeposited',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'maxPoolAmount',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'minBoostAmount',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newCakePool',
        type: 'address',
      },
    ],
    name: 'setCakePool',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_newEarn',
        type: 'address',
      },
    ],
    name: 'setEarn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
      },
      {
        internalType: 'uint32',
        name: '_endDay',
        type: 'uint32',
      },
    ],
    name: 'setPoolEndDay',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: '_state',
        type: 'bool',
      },
    ],
    name: 'setPoolState',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unpause',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userInfo',
    outputs: [
      {
        internalType: 'uint128',
        name: 'userDeposit',
        type: 'uint128',
      },
      {
        internalType: 'uint128',
        name: 'accrueInterest',
        type: 'uint128',
      },
      {
        internalType: 'uint32',
        name: 'lastDayAction',
        type: 'uint32',
      },
      {
        internalType: 'bool',
        name: 'boost',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'userPendingWithdraw',
    outputs: [
      {
        internalType: 'uint32',
        name: '',
        type: 'uint32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_poolIndex',
        type: 'uint256',
      },
    ],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'contract IERC20Upgradeable',
        name: '_token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_to',
        type: 'address',
      },
    ],
    name: 'withdrawToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
