export const questRewardAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_owner',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_op',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'acceptOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'claimReward',
    inputs: [
      {
        name: '_id',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '_amount',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: '_proof',
        type: 'bytes32[]',
        internalType: 'bytes32[]',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createQuest',
    inputs: [
      {
        name: '_id',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '_claimTime',
        type: 'uint32',
        internalType: 'uint32',
      },
      {
        name: '_totalWinners',
        type: 'uint16',
        internalType: 'uint16',
      },
      {
        name: '_rewardToken',
        type: 'address',
        internalType: 'address',
      },
      {
        name: '_totalReward',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'getClaimedReward',
    inputs: [
      {
        name: '_id',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '_account',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'pendingOwner',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'quests',
    inputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: 'root',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'claimTime',
        type: 'uint32',
        internalType: 'uint32',
      },
      {
        name: 'totalWinners',
        type: 'uint16',
        internalType: 'uint16',
      },
      {
        name: 'totalClaimedWinners',
        type: 'uint16',
        internalType: 'uint16',
      },
      {
        name: 'organizer',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'rewardToken',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'totalReward',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'totalClaimedReward',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setOp',
    inputs: [
      {
        name: '_op',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateRoot',
    inputs: [
      {
        name: '_id',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '_root',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'withdrawQuest',
    inputs: [
      {
        name: '_id',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: '_recipient',
        type: 'address',
        internalType: 'address payable',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'ClaimReward',
    inputs: [
      {
        name: 'id',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'account',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'amount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CreateQuest',
    inputs: [
      {
        name: 'id',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'organizer',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'claimTime',
        type: 'uint32',
        indexed: false,
        internalType: 'uint32',
      },
      {
        name: 'rewardToken',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'totalReward',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
      {
        name: 'totalWinners',
        type: 'uint16',
        indexed: false,
        internalType: 'uint16',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferStarted',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UpdateRoot',
    inputs: [
      {
        name: 'id',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'root',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AlreadyClaimed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'ExceedWinnerLimit',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidClaimTime',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidInputLength',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidProof',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidQuestTime',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidRewardAmount',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidRewardToken',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidRoot',
    inputs: [],
  },
  {
    type: 'error',
    name: 'InvalidTransferAmount',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NativeTransferFailed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'NotEnoughReward',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OpOnly',
    inputs: [],
  },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [
      {
        name: 'owner',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'QuestAlreadyExist',
    inputs: [],
  },
  {
    type: 'error',
    name: 'QuestNotFound',
    inputs: [],
  },
  {
    type: 'error',
    name: 'RootAlreadySet',
    inputs: [],
  },
] as const
