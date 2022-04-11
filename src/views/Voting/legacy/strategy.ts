import tokens from 'config/constants/tokens'
import { getCakeVaultAddress, getIfoPoolAddress, getMasterChefAddress } from 'utils/addressHelpers'

const cakeLpAddress = '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'

const CakeBalanceStrategy = {
  name: 'erc20-balance-of',
  params: {
    address: tokens.cake.address,
    decimals: 0,
    symbol: tokens.cake.symbol,
  },
}

const CakeVaultSharesStrategy = {
  name: 'contract-call',
  params: {
    address: getCakeVaultAddress(),
    decimals: 0,
    output: 'shares',
    methodABI: {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'userInfo',
      outputs: [
        {
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'lastDepositedTime',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'cakeAtLastUserAction',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'lastUserActionTime',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  },
}

const CakeVaultPricePerFullShareStrategy = {
  name: 'contract-call',
  params: {
    address: getCakeVaultAddress(),
    decimals: 0,
    args: [],
    methodABI: {
      inputs: [],
      name: 'getPricePerFullShare',
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
  },
}

const IFOPoolSharesStrategy = {
  name: 'contract-call',
  params: {
    address: getIfoPoolAddress(),
    decimals: 0,
    output: 'shares',
    methodABI: {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'userInfo',
      outputs: [
        {
          internalType: 'uint256',
          name: 'shares',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'lastDepositedTime',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'cakeAtLastUserAction',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'lastUserActionTime',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  },
}

const IFOPoolPricePerFullShareStrategy = {
  name: 'contract-call',
  params: {
    address: getIfoPoolAddress(),
    decimals: 0,
    args: [],
    methodABI: {
      inputs: [],
      name: 'getPricePerFullShare',
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
  },
}

const UserStakeInCakePoolStrategy = {
  name: 'contract-call',
  params: {
    address: getMasterChefAddress(),
    decimals: 0,
    args: [0, '%{address}'],
    output: 'amount',
    methodABI: {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256',
        },
        {
          internalType: 'address',
          name: '',
          type: 'address',
        },
      ],
      name: 'userInfo',
      outputs: [
        {
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: 'rewardDebt',
          type: 'uint256',
        },
      ],
      stateMutability: 'view',
      type: 'function',
    },
  },
}

const CakeBnbMasterChefStrategy = {
  name: 'masterchef-pool-balance',
  params: {
    chefAddress: getMasterChefAddress(),
    uniPairAddress: cakeLpAddress,
    pid: '251',
    symbol: 'CAKE-BNB LP',
    tokenIndex: 0,
  },
}

function createPoolStrategy(poolAddress) {
  return {
    name: 'contract-call',
    params: {
      address: poolAddress,
      decimals: 0,
      output: 'amount',
      methodABI: {
        inputs: [
          {
            internalType: 'address',
            name: '',
            type: 'address',
          },
        ],
        name: 'userInfo',
        outputs: [
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rewardDebt',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    },
  }
}

export { createPoolStrategy }

export const snapshotStrategies = {
  CakeBalanceStrategy,
  CakeVaultSharesStrategy,
  CakeVaultPricePerFullShareStrategy,
  IFOPoolSharesStrategy,
  IFOPoolPricePerFullShareStrategy,
  UserStakeInCakePoolStrategy,
  CakeBnbMasterChefStrategy,
}
