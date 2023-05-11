export const stableSwapPairABI = [
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
        name: 'provider',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'token_amounts',
        type: 'uint256[2]',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'fees',
        type: 'uint256[2]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'invariant',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'token_supply',
        type: 'uint256',
      },
    ],
    name: 'AddLiquidity',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'admin_fee',
        type: 'uint256',
      },
    ],
    name: 'CommitNewFee',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'DonateAdminFees',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Kill',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'admin_fee',
        type: 'uint256',
      },
    ],
    name: 'NewFee',
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
        internalType: 'uint256',
        name: 'old_A',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'new_A',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'initial_time',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'future_time',
        type: 'uint256',
      },
    ],
    name: 'RampA',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'provider',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'token_amounts',
        type: 'uint256[2]',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'fees',
        type: 'uint256[2]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'token_supply',
        type: 'uint256',
      },
    ],
    name: 'RemoveLiquidity',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'provider',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'token_amounts',
        type: 'uint256[2]',
      },
      {
        indexed: false,
        internalType: 'uint256[2]',
        name: 'fees',
        type: 'uint256[2]',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'invariant',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'token_supply',
        type: 'uint256',
      },
    ],
    name: 'RemoveLiquidityImbalance',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'provider',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'token_amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'coin_amount',
        type: 'uint256',
      },
    ],
    name: 'RemoveLiquidityOne',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'RevertParameters',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'A',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 't',
        type: 'uint256',
      },
    ],
    name: 'StopRampA',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'buyer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sold_id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokens_sold',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bought_id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'tokens_bought',
        type: 'uint256',
      },
    ],
    name: 'TokenExchange',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [],
    name: 'Unkill',
    type: 'event',
  },
  {
    inputs: [],
    name: 'A',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'ADMIN_ACTIONS_DELAY',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'FEE_DENOMINATOR',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'KILL_DEADLINE_DT',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_A',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_ADMIN_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_A_CHANGE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_DECIMAL',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MAX_FEE',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'MIN_RAMP_TIME',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'N_COINS',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'PRECISION',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
    name: 'PRECISION_MUL',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
    name: 'RATES',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'STABLESWAP_FACTORY',
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
        internalType: 'uint256[2]',
        name: 'amounts',
        type: 'uint256[2]',
      },
      {
        internalType: 'uint256',
        name: 'min_mint_amount',
        type: 'uint256',
      },
    ],
    name: 'add_liquidity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'admin_actions_deadline',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
        name: 'i',
        type: 'uint256',
      },
    ],
    name: 'admin_balances',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'admin_fee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'apply_new_fee',
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'balances',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[2]',
        name: 'amounts',
        type: 'uint256[2]',
      },
      {
        internalType: 'bool',
        name: 'deposit',
        type: 'bool',
      },
    ],
    name: 'calc_token_amount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
        name: '_token_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'i',
        type: 'uint256',
      },
    ],
    name: 'calc_withdraw_one_coin',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
    name: 'coins',
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
        name: 'new_fee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'new_admin_fee',
        type: 'uint256',
      },
    ],
    name: 'commit_new_fee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'donate_admin_fees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'i',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'j',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'dx',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'min_dy',
        type: 'uint256',
      },
    ],
    name: 'exchange',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'fee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'future_A',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'future_A_time',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'future_admin_fee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'future_fee',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
        name: 'i',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'j',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'dx',
        type: 'uint256',
      },
    ],
    name: 'get_dy',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
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
        name: 'i',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'j',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'dx',
        type: 'uint256',
      },
    ],
    name: 'get_dy_underlying',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'get_virtual_price',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initial_A',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'initial_A_time',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[2]',
        name: '_coins',
        type: 'address[2]',
      },
      {
        internalType: 'uint256',
        name: '_A',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_fee',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_admin_fee',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '_owner',
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
    name: 'isInitialized',
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
    inputs: [],
    name: 'is_killed',
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
    inputs: [],
    name: 'kill_deadline',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'kill_me',
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
    inputs: [
      {
        internalType: 'uint256',
        name: '_future_A',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: '_future_time',
        type: 'uint256',
      },
    ],
    name: 'ramp_A',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256[2]',
        name: 'min_amounts',
        type: 'uint256[2]',
      },
    ],
    name: 'remove_liquidity',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256[2]',
        name: 'amounts',
        type: 'uint256[2]',
      },
      {
        internalType: 'uint256',
        name: 'max_burn_amount',
        type: 'uint256',
      },
    ],
    name: 'remove_liquidity_imbalance',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_token_amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'i',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'min_amount',
        type: 'uint256',
      },
    ],
    name: 'remove_liquidity_one_coin',
    outputs: [],
    stateMutability: 'nonpayable',
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
    inputs: [],
    name: 'revert_new_parameters',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'stop_rampget_A',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'token',
    outputs: [
      {
        internalType: 'contract PancakeStableSwapLP',
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
    name: 'unkill_me',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw_admin_fees',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
