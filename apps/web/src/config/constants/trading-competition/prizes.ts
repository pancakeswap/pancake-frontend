export enum Tiers {
  GOLD = 'Gold',
  SILVER = 'Silver',
  BRONZE = 'Bronze',
  PURPLE = 'Purple',
  TEAL = 'Teal',
}

export interface Rank {
  group: string
  rank: string
  tier: Tiers
  tokenPrizeInUsd: number
  achievements: {
    image?: string
    points?: number
    champion?: number
    teamPlayer?: number
    trophy?: number
  }
  hasNft: boolean
}

export interface PrizesConfig {
  [key: string]: Rank[]
}

export const fanTokenPrizes: PrizesConfig = {
  1: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 12600,
      achievements: {
        image: 'fan-token-champion-gold.svg',
        points: 2500,
      },
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 29400,
      achievements: {
        image: 'fan-token-top-10-gold.svg',
        points: 1250,
      },
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 25200,
      achievements: {
        image: 'fan-token-top-100-gold.svg',
        points: 1000,
      },
      hasNft: true,
    },

    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 16800,
      achievements: {
        image: 'fan-token-top-500-gold.svg',
        points: 850,
      },
      hasNft: true,
    },

    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        image: 'fan-token-participant-gold.svg',
        points: 500,
      },
      hasNft: false,
    },
  ],
  2: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 3600,
      achievements: {
        image: 'fan-token-champion-silver.svg',
        points: 2250,
      },
      hasNft: false,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 8400,
      achievements: {
        image: 'fan-token-top-10-silver.svg',
        points: 1000,
      },
      hasNft: false,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 7200,
      achievements: {
        image: 'fan-token-top-100-silver.svg',
        points: 850,
      },
      hasNft: false,
    },
    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 4800,
      achievements: {
        image: 'fan-token-top-500-silver.svg',
        points: 500,
      },
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        image: 'fan-token-participant-silver.svg',
        points: 250,
      },
      hasNft: false,
    },
  ],
  3: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 1800,
      achievements: {
        image: 'fan-token-champion-bronze.svg',
        points: 2100,
      },
      hasNft: false,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 4200,
      achievements: {
        image: 'fan-token-top-10-bronze.svg',
        points: 850,
      },
      hasNft: false,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 3600,
      achievements: {
        image: 'fan-token-top-100-bronze.svg',
        points: 500,
      },
      hasNft: false,
    },
    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 2400,
      achievements: {
        image: 'fan-token-top-500-bronze.svg',
        points: 250,
      },
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        image: 'fan-token-participant-bronze.svg',
        points: 100,
      },
      hasNft: false,
    },
  ],
}

export const easterPrizes: PrizesConfig = {
  1: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 21000,
      achievements: {
        champion: 1250,
        teamPlayer: 750,
        trophy: 500,
      },
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 49000,
      achievements: {
        teamPlayer: 750,
        trophy: 500,
      },
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 42000,
      achievements: {
        teamPlayer: 750,
        trophy: 500,
      },
      hasNft: true,
    },

    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 28000,
      achievements: {
        teamPlayer: 750,
        trophy: 500,
      },
      hasNft: true,
    },

    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        trophy: 500,
      },
      hasNft: false,
    },
  ],
  2: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 6000,
      achievements: {
        champion: 1250,
        teamPlayer: 750,
        trophy: 250,
      },
      hasNft: false,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 14000,
      achievements: {
        teamPlayer: 750,
        trophy: 250,
      },
      hasNft: false,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 12000,
      achievements: {
        teamPlayer: 750,
        trophy: 250,
      },
      hasNft: false,
    },
    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 8000,
      achievements: {
        teamPlayer: 750,
        trophy: 250,
      },
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        trophy: 250,
      },
      hasNft: false,
    },
  ],
  3: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 3000,
      achievements: {
        champion: 1250,
        teamPlayer: 750,
        trophy: 100,
      },
      hasNft: false,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 7000,
      achievements: {
        teamPlayer: 750,
        trophy: 100,
      },
      hasNft: false,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 6000,
      achievements: {
        teamPlayer: 750,
        trophy: 100,
      },
      hasNft: false,
    },
    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 4000,
      achievements: {
        teamPlayer: 750,
        trophy: 100,
      },
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        trophy: 100,
      },
      hasNft: false,
    },
  ],
}

export const mboxPrizes: PrizesConfig = {
  1: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 4200,
      achievements: {
        image: 'MBOX-champion-gold.svg',
        points: 2500,
      },
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 9800,
      achievements: {
        image: 'MBOX-top-10-gold.svg',
        points: 1250,
      },
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 8400,
      achievements: {
        image: 'MBOX-top-100-gold.svg',
        points: 1000,
      },
      hasNft: true,
    },

    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 5600,
      achievements: {
        image: 'MBOX-top-500-gold.svg',
        points: 850,
      },
      hasNft: false,
    },

    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        image: 'MBOX-participant-gold.svg',
        points: 500,
      },
      hasNft: false,
    },
  ],
  2: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 1200,
      achievements: {
        image: 'MBOX-champion-silver.svg',
        points: 2250,
      },
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 2800,
      achievements: {
        image: 'MBOX-top-10-silver.svg',
        points: 1000,
      },
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 2400,
      achievements: {
        image: 'MBOX-top-100-silver.svg',
        points: 850,
      },
      hasNft: true,
    },
    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 1600,
      achievements: {
        image: 'MBOX-top-500-silver.svg',
        points: 500,
      },
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        image: 'MBOX-participant-silver.svg',
        points: 250,
      },
      hasNft: false,
    },
  ],
  3: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 600,
      achievements: {
        image: 'MBOX-champion-bronze.svg',
        points: 2100,
      },
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 1400,
      achievements: {
        image: 'MBOX-top-10-bronze.svg',
        points: 850,
      },
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 1200,
      achievements: {
        image: 'MBOX-top-100-bronze.svg',
        points: 500,
      },
      hasNft: true,
    },
    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 800,
      achievements: {
        image: 'MBOX-top-500-bronze.svg',
        points: 250,
      },
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        image: 'MBOX-participant-bronze.svg',
        points: 100,
      },
      hasNft: false,
    },
  ],
}

export const modPrizes: PrizesConfig = {
  1: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 10800,
      achievements: {
        image: 'MoD-champion-gold.svg',
        points: 2500,
      },
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 25200,
      achievements: {
        image: 'MoD-top-10-gold.svg',
        points: 1250,
      },
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 21600,
      achievements: {
        image: 'MoD-top-100-gold.svg',
        points: 1000,
      },
      hasNft: true,
    },

    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 14400,
      achievements: {
        image: 'MoD-top-500-gold.svg',
        points: 850,
      },
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        image: 'MoD-participant-gold.svg',
        points: 500,
      },
      hasNft: false,
    },
  ],
  2: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 5400,
      achievements: {
        image: 'MoD-champion-silver.svg',
        points: 2250,
      },
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 12600,
      achievements: {
        image: 'MoD-top-10-silver.svg',
        points: 1000,
      },
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 10800,
      achievements: {
        image: 'MoD-top-100-silver.svg',
        points: 850,
      },
      hasNft: true,
    },
    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 7200,
      achievements: {
        image: 'MoD-top-500-silver.svg',
        points: 500,
      },
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        image: 'MoD-participant-silver.svg',
        points: 250,
      },
      hasNft: false,
    },
  ],
  3: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 1800,
      achievements: {
        image: 'MoD-champion-bronze.svg',
        points: 2100,
      },
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 4200,
      achievements: {
        image: 'MoD-top-10-bronze.svg',
        points: 850,
      },
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 3600,
      achievements: {
        image: 'MoD-top-100-bronze.svg',
        points: 500,
      },
      hasNft: true,
    },
    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 2400,
      achievements: {
        image: 'MoD-top-500-bronze.svg',
        points: 250,
      },
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: {
        image: 'MoD-participant-bronze.svg',
        points: 100,
      },
      hasNft: false,
    },
  ],
}
