export const v4MixedRouteQuoterAbi = [
  {
    inputs: [
      { internalType: 'address', name: '_factoryV3', type: 'address' },
      { internalType: 'address', name: '_factoryV2', type: 'address' },
      { internalType: 'address', name: '_factoryStable', type: 'address' },
      { internalType: 'address', name: '_WETH9', type: 'address' },
      { internalType: 'contract ICLQuoter', name: '_clQuoter', type: 'address' },
      { internalType: 'contract IBinQuoter', name: '_binQuoter', type: 'address' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  { inputs: [], name: 'INVALID_ADDRESS', type: 'error' },
  { inputs: [], name: 'InputLengthMismatch', type: 'error' },
  { inputs: [], name: 'InvalidPath', type: 'error' },
  { inputs: [], name: 'InvalidPoolKeyCurrency', type: 'error' },
  { inputs: [], name: 'NoActions', type: 'error' },
  {
    inputs: [
      { internalType: 'uint8', name: 'bits', type: 'uint8' },
      { internalType: 'uint256', name: 'value', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
    type: 'error',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'value', type: 'uint256' }],
    name: 'SafeCastOverflowedUintToInt',
    type: 'error',
  },
  { inputs: [{ internalType: 'uint256', name: 'action', type: 'uint256' }], name: 'UnsupportedAction', type: 'error' },
  {
    inputs: [],
    name: 'WETH9',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'binQuoter',
    outputs: [{ internalType: 'contract IBinQuoter', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'clQuoter',
    outputs: [{ internalType: 'contract ICLQuoter', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factoryStable',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factoryV2',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'factoryV3',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'int256', name: 'amount0Delta', type: 'int256' },
      { internalType: 'int256', name: 'amount1Delta', type: 'int256' },
      { internalType: 'bytes', name: 'data', type: 'bytes' },
    ],
    name: 'pancakeV3SwapCallback',
    outputs: [],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint256', name: 'flag', type: 'uint256' },
        ],
        internalType: 'struct IMixedQuoter.QuoteExactInputSingleStableParams',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactInputSingleStable',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
        ],
        internalType: 'struct IMixedQuoter.QuoteExactInputSingleV2Params',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactInputSingleV2',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          { internalType: 'address', name: 'tokenIn', type: 'address' },
          { internalType: 'address', name: 'tokenOut', type: 'address' },
          { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
          { internalType: 'uint24', name: 'fee', type: 'uint24' },
          { internalType: 'uint160', name: 'sqrtPriceLimitX96', type: 'uint160' },
        ],
        internalType: 'struct IMixedQuoter.QuoteExactInputSingleV3Params',
        name: 'params',
        type: 'tuple',
      },
    ],
    name: 'quoteExactInputSingleV3',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint160', name: 'sqrtPriceX96After', type: 'uint160' },
      { internalType: 'uint32', name: 'initializedTicksCrossed', type: 'uint32' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'address[]', name: 'paths', type: 'address[]' },
      { internalType: 'bytes', name: 'actions', type: 'bytes' },
      { internalType: 'bytes[]', name: 'params', type: 'bytes[]' },
      { internalType: 'uint256', name: 'amountIn', type: 'uint256' },
    ],
    name: 'quoteMixedExactInput',
    outputs: [
      { internalType: 'uint256', name: 'amountOut', type: 'uint256' },
      { internalType: 'uint256', name: 'gasEstimate', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const
