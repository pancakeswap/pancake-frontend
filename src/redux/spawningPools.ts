// eslint-disable-next-line import/prefer-default-export
import tokens from '../config/constants/tokens'
import artists from '../config/constants/artists'
import { BIG_ZERO } from '../utils/bigNumber'
import { SpawningPool } from './types'

const spawningPools: SpawningPool[] = [
  {
    id: 2,
    name: 'Main Street Legendary',
    subtitle: "Block Party",
    path: "https://storage.googleapis.com/rug-zombie/Main%20Street.png",
    type: 'image',
    address: {
      56: '0x0af40D42F805112ECc40b0148c1221eDc8Ce001B',
      97: '',
    },
    endBlock: 12790000,
    project: {
      name: 'Main Street',
      description: 'Main Street is a deflationary token that provides its holders with a space to find new high use case tokens in their Neighborhood and Alley, as well as entertainment and games in their Shops.',
      additionalDetails: [
        {
          name: 'Project website',
          url: tokens.mainst.projectLink
        },
        {
          name: 'Telegram',
          url: 'https://t.me/buymainstreet'
        },
      ],

    },
    withdrawalCooldown: '3 days',
    nftRevivalTime: '45 days',
    rewardToken: tokens.mainst,
    rewardTokenId: 'euler-tools',
    artist: artists.ZomBaes,
    stakingToken: '',
    pcsVersion: 'v2',
    liquidityDetails: '',
    isNew: false,
    userInfo: {
      paidUnlockFee: false,
      tokenWithdrawalDate: 0,
      nftRevivalDate: 0,
      amount: BIG_ZERO,
      pendingReward: BIG_ZERO,
      zombieAllowance: BIG_ZERO,
    },
    poolInfo: {
      unlockFee: BIG_ZERO,
      rewardPerBlock: BIG_ZERO,
      minimumStake: BIG_ZERO,
      totalZombieStaked: BIG_ZERO,
      withdrawCooldown: 0,
      nftRevivalTime: 0,
    },
  },
  {
    id: 1,
    name: 'Euler Tools Legendary',
    subtitle: "Leonhard Euler's Day Off",
    path: "images/rugZombie/Leonhard Euler's Day Off.gif",
    type: 'image',
    address: {
      56: '0x637810116bfdEcA4bB38c61D9FeBC5911440B0eF',
      97: '',
    },
    endBlock: 12350000,
    project: {
      name: 'Euler Tools',
      description: 'Euler Tools is a platform to explore and discover blockchain content. With a clean, usable and responsive interface.',
      additionalDetails: [
        {
          name: 'Project website',
          url: tokens.euler.projectLink
        },
        {
          name: 'Twitter',
          url: 'https://twitter.com/EulerTools',
        },
        {
          name: 'Telegram',
          url: 'https://t.me/eulertools'
        },
        {
          name: 'Medium Post',
          url: 'https://rugzombie.medium.com/new-spawning-pool-euler-tools-a07b095a9846'
        }
      ],

    },
    withdrawalCooldown: '3 days',
    nftRevivalTime: '45 days',
    rewardToken: tokens.euler,
    rewardTokenId: 'euler-tools',
    artist: artists.ZomBaes,
    stakingToken: '',
    pcsVersion: 'v2',
    liquidityDetails: '',
    isNew: false,
    userInfo: {
      paidUnlockFee: false,
      tokenWithdrawalDate: 0,
      nftRevivalDate: 0,
      amount: BIG_ZERO,
      pendingReward: BIG_ZERO,
      zombieAllowance: BIG_ZERO,
    },
    poolInfo: {
      unlockFee: BIG_ZERO,
      rewardPerBlock: BIG_ZERO,
      minimumStake: BIG_ZERO,
      totalZombieStaked: BIG_ZERO,
      withdrawCooldown: 0,
      nftRevivalTime: 0,
    },
  },
  {
    id: 0,
    name: 'Gorilla-Fi Legendary',
    subtitle: 'Silverback',
    path: 'images/rugZombie/Silverback.mp4',
    type: 'video',
    address: {
      56: '0x83818859688eF175F6AEAFb80Be881Db24A4E50a',
      97: '0x09804035E6D09fe1d4992F64fE9F69A183572DD3',
    },
    endBlock: 12209400,
    project: {
      name: 'Gorilla-Fi',
      description: 'Gorilla-Fi is a comprehensive De-Fi earnings ecosystem that allows anyone with a smartphone to earn passive income.',
      additionalDetails: [
        {
          name: 'Project website',
          url: 'https://www.gorillafi.com/'
        },
        {
          name: 'Podcast with project founder',
          url: 'https://www.youtube.com/watch?v=xdwiHSCPSNw',
        },
        {
          name: 'Telegram',
          url: 'https://t.me/GorillaFi'
        },
        {
          name: 'Medium post',
          url: 'https://rugzombie.medium.com/first-spawn-gorilla-fi-g-fi-f16a234047f7'
        }
      ],

    },
    withdrawalCooldown: '3 days',
    nftRevivalTime: '45 days',
    rewardToken: tokens.gfi,
    rewardTokenId: 'gorilla-fi',
    artist: artists.deadtunnelrat,
    stakingToken: '',
    pcsVersion: 'v1',
    liquidityDetails: '',
    isNew: false,
    userInfo: {
      paidUnlockFee: false,
      tokenWithdrawalDate: 0,
      nftRevivalDate: 0,
      amount: BIG_ZERO,
      pendingReward: BIG_ZERO,
      zombieAllowance: BIG_ZERO,
    },
    poolInfo: {
      unlockFee: BIG_ZERO,
      rewardPerBlock: BIG_ZERO,
      minimumStake: BIG_ZERO,
      totalZombieStaked: BIG_ZERO,
      withdrawCooldown: 0,
      nftRevivalTime: 0,
    },
  }
]

export default spawningPools
