export enum Tiers {
  GOLD = 'Gold',
  SILVER = 'Silver',
  BRONZE = 'Bronze',
  PURPLE = 'Purple',
  TEAL = 'Teal',
}

export interface Achievement {
  champion?: number
  teamPlayer?: number
  trophy: number
}

export interface Rank {
  rank: string
  tier: Tiers
  cakePrizeInUsd: number
  achievements: Achievement
  hasNft: boolean
}

interface Config {
  [key: string]: Rank[]
}

const easterPrizes: Config = {
  1: [
    {
      rank: '1',
      tier: Tiers.GOLD,
      cakePrizeInUsd: 21000,
      achievements: {
        champion: 1250,
        teamPlayer: 750,
        trophy: 500,
      },
      hasNft: true,
    },
    {
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      cakePrizeInUsd: 49000,
      achievements: {
        teamPlayer: 750,
        trophy: 500,
      },
      hasNft: true,
    },
    {
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      cakePrizeInUsd: 42000,
      achievements: {
        teamPlayer: 750,
        trophy: 500,
      },
      hasNft: true,
    },
    {
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      cakePrizeInUsd: 28000,
      achievements: {
        teamPlayer: 750,
        trophy: 500,
      },
      hasNft: true,
    },
    {
      rank: '501+',
      tier: Tiers.TEAL,
      cakePrizeInUsd: 0,
      achievements: {
        trophy: 500,
      },
      hasNft: false,
    },
  ],
  2: [
    {
      rank: '1',
      tier: Tiers.GOLD,
      cakePrizeInUsd: 6000,
      achievements: {
        champion: 1250,
        teamPlayer: 750,
        trophy: 250,
      },
      hasNft: false,
    },
    {
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      cakePrizeInUsd: 14000,
      achievements: {
        teamPlayer: 750,
        trophy: 250,
      },
      hasNft: false,
    },
    {
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      cakePrizeInUsd: 12000,
      achievements: {
        teamPlayer: 750,
        trophy: 250,
      },
      hasNft: false,
    },
    {
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      cakePrizeInUsd: 8000,
      achievements: {
        teamPlayer: 750,
        trophy: 250,
      },
      hasNft: false,
    },
    {
      rank: '501+',
      tier: Tiers.TEAL,
      cakePrizeInUsd: 0,
      achievements: {
        trophy: 250,
      },
      hasNft: false,
    },
  ],
  3: [
    {
      rank: '1',
      tier: Tiers.GOLD,
      cakePrizeInUsd: 3000,
      achievements: {
        champion: 1250,
        teamPlayer: 750,
        trophy: 100,
      },
      hasNft: false,
    },
    {
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      cakePrizeInUsd: 7000,
      achievements: {
        teamPlayer: 750,
        trophy: 100,
      },
      hasNft: false,
    },
    {
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      cakePrizeInUsd: 6000,
      achievements: {
        teamPlayer: 750,
        trophy: 100,
      },
      hasNft: false,
    },
    {
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      cakePrizeInUsd: 4000,
      achievements: {
        teamPlayer: 750,
        trophy: 100,
      },
      hasNft: false,
    },
    {
      rank: '501+',
      tier: Tiers.TEAL,
      cakePrizeInUsd: 0,
      achievements: {
        trophy: 100,
      },
      hasNft: false,
    },
  ],
}

export default easterPrizes
