export const clQuoterAbi = [
  {
    inputs: [{ internalType: 'address', name: '_poolManager', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [{ internalType: 'PoolId', name: 'poolId', type: 'bytes32' }], name: 'NotEnoughLiquidity', type: 'error' },
  { inputs: [], name: 'NotSelf', type: 'error' },
  { inputs: [], name: 'NotVault', type: 'error' },
  { inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }], name: 'QuoteSwap', type: 'error' },
  { inputs: [], name: 'UnexpectedCallSuccess', type: 'error' },
  {
    inputs: [{ internalType: 'bytes', name: 'revertData', type: 'bytes' }],
    name: 'UnexpectedRevertBytes',
    type: 'error',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'Currency', name: 'exactCurrency', type: 'address' },
          {
            components: [
              { internalType: 'Currency', name: 'intermediateCurrency', type: 'address' },
              { internalType: 'uint24', name: 'fee', type: 'uint24' },
              { internalType: 'contract IHooks', name: 'hooks', type: 'address' },
              { internalType: 'contract IPoolManager', name: 'poolManager', type: 'address' },
              { internalType: 'bytes', name: 'hookData', type: 'bytes' },
              { internalType: 'bytes32', name: 'parameters', type: 'bytes32' },
            ],
            internalType: 'struct PathKey[]',
            name: 'path',
            type: 'tuple[]',
          },
          { internalType: 'uint128', name: 'exactAmount', type: 'uint128' },
        ],
        internalType: 'struct IQuoter.QuoteExactParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: '_quoteExactInput',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: 'Currency', name: 'currency0', type: 'address' },
              { internalType: 'Currency', name: 'currency1', type: 'address' },
              { internalType: 'contract IHooks', name: 'hooks', type: 'address' },
              { internalType: 'contract IPoolManager', name: 'poolManager', type: 'address' },
              { internalType: 'uint24', name: 'fee', type: 'uint24' },
              { internalType: 'bytes32', name: 'parameters', type: 'bytes32' },
            ],
            internalType: 'struct PoolKey',
            name: 'poolKey',
            type: 'tuple',
          },
          { internalType: 'bool', name: 'zeroForOne', type: 'bool' },
          { internalType: 'uint128', name: 'exactAmount', type: 'uint128' },
          { internalType: 'bytes', name: 'hookData', type: 'bytes' },
        ],
        internalType: 'struct IQuoter.QuoteExactSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: '_quoteExactInputSingle',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'Currency', name: 'exactCurrency', type: 'address' },
          {
            components: [
              { internalType: 'Currency', name: 'intermediateCurrency', type: 'address' },
              { internalType: 'uint24', name: 'fee', type: 'uint24' },
              { internalType: 'contract IHooks', name: 'hooks', type: 'address' },
              { internalType: 'contract IPoolManager', name: 'poolManager', type: 'address' },
              { internalType: 'bytes', name: 'hookData', type: 'bytes' },
              { internalType: 'bytes32', name: 'parameters', type: 'bytes32' },
            ],
            internalType: 'struct PathKey[]',
            name: 'path',
            type: 'tuple[]',
          },
          { internalType: 'uint128', name: 'exactAmount', type: 'uint128' },
        ],
        internalType: 'struct IQuoter.QuoteExactParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: '_quoteExactOutput',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: 'Currency', name: 'currency0', type: 'address' },
              { internalType: 'Currency', name: 'currency1', type: 'address' },
              { internalType: 'contract IHooks', name: 'hooks', type: 'address' },
              { internalType: 'contract IPoolManager', name: 'poolManager', type: 'address' },
              { internalType: 'uint24', name: 'fee', type: 'uint24' },
              { internalType: 'bytes32', name: 'parameters', type: 'bytes32' },
            ],
            internalType: 'struct PoolKey',
            name: 'poolKey',
            type: 'tuple',
          },
          { internalType: 'bool', name: 'zeroForOne', type: 'bool' },
          { internalType: 'uint128', name: 'exactAmount', type: 'uint128' },
          { internalType: 'bytes', name: 'hookData', type: 'bytes' },
        ],
        internalType: 'struct IQuoter.QuoteExactSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: '_quoteExactOutputSingle',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes', name: 'data', type: 'bytes' }],
    name: 'lockAcquired',
    outputs: [{ internalType: 'bytes', name: '', type: 'bytes' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'poolManager',
    outputs: [{ internalType: 'contract ICLPoolManager', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'Currency', name: 'exactCurrency', type: 'address' },
          {
            components: [
              { internalType: 'Currency', name: 'intermediateCurrency', type: 'address' },
              { internalType: 'uint24', name: 'fee', type: 'uint24' },
              { internalType: 'contract IHooks', name: 'hooks', type: 'address' },
              { internalType: 'contract IPoolManager', name: 'poolManager', type: 'address' },
              { internalType: 'bytes', name: 'hookData', type: 'bytes' },
              { internalType: 'bytes32', name: 'parameters', type: 'bytes32' },
            ],
            internalType: 'struct PathKey[]',
            name: 'path',
            type: 'tuple[]',
          },
          { internalType: 'uint128', name: 'exactAmount', type: 'uint128' },
        ],
        internalType: 'struct IQuoter.QuoteExactParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactInput',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: 'Currency', name: 'currency0', type: 'address' },
              { internalType: 'Currency', name: 'currency1', type: 'address' },
              { internalType: 'contract IHooks', name: 'hooks', type: 'address' },
              { internalType: 'contract IPoolManager', name: 'poolManager', type: 'address' },
              { internalType: 'uint24', name: 'fee', type: 'uint24' },
              { internalType: 'bytes32', name: 'parameters', type: 'bytes32' },
            ],
            internalType: 'struct PoolKey',
            name: 'poolKey',
            type: 'tuple',
          },
          { internalType: 'bool', name: 'zeroForOne', type: 'bool' },
          { internalType: 'uint128', name: 'exactAmount', type: 'uint128' },
          { internalType: 'bytes', name: 'hookData', type: 'bytes' },
        ],
        internalType: 'struct IQuoter.QuoteExactSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactInputSingle',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'Currency', name: 'exactCurrency', type: 'address' },
          {
            components: [
              { internalType: 'Currency', name: 'intermediateCurrency', type: 'address' },
              { internalType: 'uint24', name: 'fee', type: 'uint24' },
              { internalType: 'contract IHooks', name: 'hooks', type: 'address' },
              { internalType: 'contract IPoolManager', name: 'poolManager', type: 'address' },
              { internalType: 'bytes', name: 'hookData', type: 'bytes' },
              { internalType: 'bytes32', name: 'parameters', type: 'bytes32' },
            ],
            internalType: 'struct PathKey[]',
            name: 'path',
            type: 'tuple[]',
          },
          { internalType: 'uint128', name: 'exactAmount', type: 'uint128' },
        ],
        internalType: 'struct IQuoter.QuoteExactParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactOutput',
    outputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: 'Currency', name: 'currency0', type: 'address' },
              { internalType: 'Currency', name: 'currency1', type: 'address' },
              { internalType: 'contract IHooks', name: 'hooks', type: 'address' },
              { internalType: 'contract IPoolManager', name: 'poolManager', type: 'address' },
              { internalType: 'uint24', name: 'fee', type: 'uint24' },
              { internalType: 'bytes32', name: 'parameters', type: 'bytes32' },
            ],
            internalType: 'struct PoolKey',
            name: 'poolKey',
            type: 'tuple',
          },
          { internalType: 'bool', name: 'zeroForOne', type: 'bool' },
          { internalType: 'uint128', name: 'exactAmount', type: 'uint128' },
          { internalType: 'bytes', name: 'hookData', type: 'bytes' },
        ],
        internalType: 'struct IQuoter.QuoteExactSingleParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactOutputSingle',
    outputs: [
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'vault',
    outputs: [{ internalType: 'contract IVault', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const
