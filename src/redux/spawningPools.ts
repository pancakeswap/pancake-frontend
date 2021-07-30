// eslint-disable-next-line import/prefer-default-export
import tokens from '../config/constants/tokens'
import artists from '../config/constants/artists'
import { BIG_ZERO } from '../utils/bigNumber'
import { SpawningPool } from './types'

const spawningPools: SpawningPool[] = [
  {
    id: 0,
    name: 'Gorilla-Fi Legendary',
    subtitle: 'Silverback',
    path: 'images/rugZombie/Silverback.mp4',
    type: 'video',
    address: {
      56: '0xAe7b2AB7F3C4f0674988C7De2AdFe01D90608654',
      97: '0x09804035E6D09fe1d4992F64fE9F69A183572DD3',
    },
    project: {
      name: 'Gorilla-Fi',
      description: 'Gorilla-Fi is a comprehensive De-Fi earnings ecosystem that allows anyone with a smartphone to earn passive income.',
      additionalDetails: [
        {
          name: 'Podcast with project founder',
          url: 'https://www.youtube.com/watch?v=xdwiHSCPSNw',
        },
        {
          name: 'Project website',
          url: 'https://www.gorillafi.com/'
        }
      ],

    },
    withdrawalCooldown: '3 days',
    nftRevivalTime: '30 days',
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
  },
]

export default spawningPools
