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
  achievements: Array<{
    image: string
    points: number
  }>
  hasNft: boolean
}

interface Config {
  [key: string]: Rank[]
}

// const prizes: Config = {
//   1: [
//     {
//       group: '4',
//       rank: '1',
//       tier: Tiers.GOLD,
//       tokenPrizeInUsd: 12600,
//       achievements: {
//         image: 'fan-token-champion-gold.svg',
//         points: 2500,
//       },
//       hasNft: true,
//     },
//     {
//       group: '3',
//       rank: '2 ~ 10',
//       tier: Tiers.SILVER,
//       tokenPrizeInUsd: 29400,
//       achievements: {
//         image: 'fan-token-top-10-gold.svg',
//         points: 1250,
//       },
//       hasNft: true,
//     },
//     {
//       group: '2',
//       rank: '11 ~ 100',
//       tier: Tiers.BRONZE,
//       tokenPrizeInUsd: 25200,
//       achievements: {
//         image: 'fan-token-top-100-gold.svg',
//         points: 1000,
//       },
//       hasNft: true,
//     },

//     {
//       group: '1',
//       rank: '101 ~ 500',
//       tier: Tiers.PURPLE,
//       tokenPrizeInUsd: 16800,
//       achievements: {
//         image: 'fan-token-top-500-gold.svg',
//         points: 850,
//       },
//       hasNft: true,
//     },

//     {
//       group: '0',
//       rank: '501+',
//       tier: Tiers.TEAL,
//       tokenPrizeInUsd: 0,
//       achievements: {
//         image: 'fan-token-participant-gold.svg',
//         points: 500,
//       },
//       hasNft: false,
//     },
//   ],
//   2: [
//     {
//       group: '4',
//       rank: '1',
//       tier: Tiers.GOLD,
//       tokenPrizeInUsd: 3600,
//       achievements: {
//         image: 'fan-token-champion-silver.svg',
//         points: 2250,
//       },
//       hasNft: false,
//     },
//     {
//       group: '3',
//       rank: '2 ~ 10',
//       tier: Tiers.SILVER,
//       tokenPrizeInUsd: 8400,
//       achievements: {
//         image: 'fan-token-top-10-silver.svg',
//         points: 1000,
//       },
//       hasNft: false,
//     },
//     {
//       group: '2',
//       rank: '11 ~ 100',
//       tier: Tiers.BRONZE,
//       tokenPrizeInUsd: 7200,
//       achievements: {
//         image: 'fan-token-top-100-silver.svg',
//         points: 850,
//       },
//       hasNft: false,
//     },
//     {
//       group: '1',
//       rank: '101 ~ 500',
//       tier: Tiers.PURPLE,
//       tokenPrizeInUsd: 4800,
//       achievements: {
//         image: 'fan-token-top-500-silver.svg',
//         points: 500,
//       },
//       hasNft: false,
//     },
//     {
//       group: '0',
//       rank: '501+',
//       tier: Tiers.TEAL,
//       tokenPrizeInUsd: 0,
//       achievements: {
//         image: 'fan-token-participant-silver.svg',
//         points: 250,
//       },
//       hasNft: false,
//     },
//   ],
//   3: [
//     {
//       group: '4',
//       rank: '1',
//       tier: Tiers.GOLD,
//       tokenPrizeInUsd: 1800,
//       achievements: {
//         image: 'fan-token-champion-bronze.svg',
//         points: 2100,
//       },
//       hasNft: false,
//     },
//     {
//       group: '3',
//       rank: '2 ~ 10',
//       tier: Tiers.SILVER,
//       tokenPrizeInUsd: 4200,
//       achievements: {
//         image: 'fan-token-top-10-bronze.svg',
//         points: 850,
//       },
//       hasNft: false,
//     },
//     {
//       group: '2',
//       rank: '11 ~ 100',
//       tier: Tiers.BRONZE,
//       tokenPrizeInUsd: 3600,
//       achievements: {
//         image: 'fan-token-top-100-bronze.svg',
//         points: 500,
//       },
//       hasNft: false,
//     },
//     {
//       group: '1',
//       rank: '101 ~ 500',
//       tier: Tiers.PURPLE,
//       tokenPrizeInUsd: 2400,
//       achievements: {
//         image: 'fan-token-top-500-bronze.svg',
//         points: 250,
//       },
//       hasNft: false,
//     },
//     {
//       group: '0',
//       rank: '501+',
//       tier: Tiers.TEAL,
//       tokenPrizeInUsd: 0,
//       achievements: {
//         image: 'fan-token-participant-bronze.svg',
//         points: 100,
//       },
//       hasNft: false,
//     },
//   ],
// }

// const mboxPrizes: Config = {
//   1: [
//     {
//       group: '4',
//       rank: '1',
//       tier: Tiers.GOLD,
//       tokenPrizeInUsd: 4200,
//       achievements: {
//         image: 'MBOX-champion-gold.svg',
//         points: 2500,
//       },
//       hasNft: true,
//     },
//     {
//       group: '3',
//       rank: '2 ~ 10',
//       tier: Tiers.SILVER,
//       tokenPrizeInUsd: 9800,
//       achievements: {
//         image: 'MBOX-top-10-gold.svg',
//         points: 1250,
//       },
//       hasNft: true,
//     },
//     {
//       group: '2',
//       rank: '11 ~ 100',
//       tier: Tiers.BRONZE,
//       tokenPrizeInUsd: 8400,
//       achievements: {
//         image: 'MBOX-top-100-gold.svg',
//         points: 1000,
//       },
//       hasNft: true,
//     },

//     {
//       group: '1',
//       rank: '101 ~ 500',
//       tier: Tiers.PURPLE,
//       tokenPrizeInUsd: 5600,
//       achievements: {
//         image: 'MBOX-top-500-gold.svg',
//         points: 850,
//       },
//       hasNft: false,
//     },

//     {
//       group: '0',
//       rank: '501+',
//       tier: Tiers.TEAL,
//       tokenPrizeInUsd: 0,
//       achievements: {
//         image: 'MBOX-participant-gold.svg',
//         points: 500,
//       },
//       hasNft: false,
//     },
//   ],
//   2: [
//     {
//       group: '4',
//       rank: '1',
//       tier: Tiers.GOLD,
//       tokenPrizeInUsd: 1200,
//       achievements: {
//         image: 'MBOX-champion-silver.svg',
//         points: 2250,
//       },
//       hasNft: true,
//     },
//     {
//       group: '3',
//       rank: '2 ~ 10',
//       tier: Tiers.SILVER,
//       tokenPrizeInUsd: 2800,
//       achievements: {
//         image: 'MBOX-top-10-silver.svg',
//         points: 1000,
//       },
//       hasNft: true,
//     },
//     {
//       group: '2',
//       rank: '11 ~ 100',
//       tier: Tiers.BRONZE,
//       tokenPrizeInUsd: 2400,
//       achievements: {
//         image: 'MBOX-top-100-silver.svg',
//         points: 850,
//       },
//       hasNft: true,
//     },
//     {
//       group: '1',
//       rank: '101 ~ 500',
//       tier: Tiers.PURPLE,
//       tokenPrizeInUsd: 1600,
//       achievements: {
//         image: 'MBOX-top-500-silver.svg',
//         points: 500,
//       },
//       hasNft: false,
//     },
//     {
//       group: '0',
//       rank: '501+',
//       tier: Tiers.TEAL,
//       tokenPrizeInUsd: 0,
//       achievements: {
//         image: 'MBOX-participant-silver.svg',
//         points: 250,
//       },
//       hasNft: false,
//     },
//   ],
//   3: [
//     {
//       group: '4',
//       rank: '1',
//       tier: Tiers.GOLD,
//       tokenPrizeInUsd: 600,
//       achievements: {
//         image: 'MBOX-champion-bronze.svg',
//         points: 2100,
//       },
//       hasNft: true,
//     },
//     {
//       group: '3',
//       rank: '2 ~ 10',
//       tier: Tiers.SILVER,
//       tokenPrizeInUsd: 1400,
//       achievements: {
//         image: 'MBOX-top-10-bronze.svg',
//         points: 850,
//       },
//       hasNft: true,
//     },
//     {
//       group: '2',
//       rank: '11 ~ 100',
//       tier: Tiers.BRONZE,
//       tokenPrizeInUsd: 1200,
//       achievements: {
//         image: 'MBOX-top-100-bronze.svg',
//         points: 500,
//       },
//       hasNft: true,
//     },
//     {
//       group: '1',
//       rank: '101 ~ 500',
//       tier: Tiers.PURPLE,
//       tokenPrizeInUsd: 800,
//       achievements: {
//         image: 'MBOX-top-500-bronze.svg',
//         points: 250,
//       },
//       hasNft: false,
//     },
//     {
//       group: '0',
//       rank: '501+',
//       tier: Tiers.TEAL,
//       tokenPrizeInUsd: 0,
//       achievements: {
//         image: 'MBOX-participant-bronze.svg',
//         points: 100,
//       },
//       hasNft: false,
//     },
//   ],
// }

const modPrizes: Config = {
  1: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 4200,
      achievements: [
        {
          image: 'MBOX-champion-gold.svg',
          points: 9000,
        },
        {
          image: 'MBOX-champion-gold.svg',
          points: 1800,
        },
      ],
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 9800,
      achievements: [
        {
          image: 'MBOX-top-10-gold.svg',
          points: 21000,
        },
        {
          image: 'MBOX-top-10-gold.svg',
          points: 4200,
        },
      ],
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 8400,
      achievements: [
        {
          image: 'MBOX-top-100-gold.svg',
          points: 18000,
        },
        {
          image: 'MBOX-top-100-gold.svg',
          points: 3600,
        },
      ],
      hasNft: true,
    },

    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 5600,
      achievements: [
        {
          image: 'MBOX-top-500-gold.svg',
          points: 12000,
        },
        {
          image: 'MBOX-top-500-gold.svg',
          points: 2400,
        },
      ],
      hasNft: false,
    },

    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: [
        {
          image: 'MBOX-participant-gold.svg',
          points: 0,
        },
        {
          image: 'MBOX-participant-gold.svg',
          points: 0,
        },
      ],
      hasNft: false,
    },
  ],
  2: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 1200,
      achievements: [
        {
          image: 'MBOX-champion-silver.svg',
          points: 4500,
        },
        {
          image: 'MBOX-champion-silver.svg',
          points: 900,
        },
      ],
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 2800,
      achievements: [
        {
          image: 'MBOX-top-10-silver.svg',
          points: 10500,
        },
        {
          image: 'MBOX-top-10-silver.svg',
          points: 2100,
        },
      ],
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 2400,
      achievements: [
        {
          image: 'MBOX-top-100-silver.svg',
          points: 9000,
        },
        {
          image: 'MBOX-top-100-silver.svg',
          points: 1800,
        },
      ],
      hasNft: true,
    },
    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 1600,
      achievements: [
        {
          image: 'MBOX-top-500-silver.svg',
          points: 6000,
        },
        {
          image: 'MBOX-top-500-silver.svg',
          points: 1200,
        },
      ],
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: [
        {
          image: 'MBOX-participant-silver.svg',
          points: 0,
        },
        {
          image: 'MBOX-participant-silver.svg',
          points: 0,
        },
      ],
      hasNft: false,
    },
  ],
  3: [
    {
      group: '4',
      rank: '1',
      tier: Tiers.GOLD,
      tokenPrizeInUsd: 600,
      achievements: [
        {
          image: 'MBOX-champion-bronze.svg',
          points: 1500,
        },
        {
          image: 'MBOX-champion-bronze.svg',
          points: 300,
        },
      ],
      hasNft: true,
    },
    {
      group: '3',
      rank: '2 ~ 10',
      tier: Tiers.SILVER,
      tokenPrizeInUsd: 1400,
      achievements: [
        {
          image: 'MBOX-top-10-bronze.svg',
          points: 3500,
        },
        {
          image: 'MBOX-top-10-bronze.svg',
          points: 700,
        },
      ],
      hasNft: true,
    },
    {
      group: '2',
      rank: '11 ~ 100',
      tier: Tiers.BRONZE,
      tokenPrizeInUsd: 1200,
      achievements: [
        {
          image: 'MBOX-top-100-bronze.svg',
          points: 3000,
        },
        {
          image: 'MBOX-top-100-bronze.svg',
          points: 600,
        },
      ],
      hasNft: true,
    },
    {
      group: '1',
      rank: '101 ~ 500',
      tier: Tiers.PURPLE,
      tokenPrizeInUsd: 800,
      achievements: [
        {
          image: 'MBOX-top-500-bronze.svg',
          points: 2000,
        },
        {
          image: 'MBOX-top-500-bronze.svg',
          points: 400,
        },
      ],
      hasNft: false,
    },
    {
      group: '0',
      rank: '501+',
      tier: Tiers.TEAL,
      tokenPrizeInUsd: 0,
      achievements: [
        {
          image: 'MBOX-participant-bronze.svg',
          points: 0,
        },
        {
          image: 'MBOX-participant-bronze.svg',
          points: 0,
        },
      ],
      hasNft: false,
    },
  ],
}

export default modPrizes
