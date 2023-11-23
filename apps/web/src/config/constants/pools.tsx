import { bscTokens } from '@pancakeswap/tokens'
import Trans from 'components/Trans'
import { VaultKey } from 'state/types'

export const vaultPoolConfig = {
  [VaultKey.CakeVaultV1]: {
    name: <Trans>Auto CAKE</Trans>,
    description: <Trans>Automatic restaking</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 380000n,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTokens.cake.address}.png`,
      secondarySrc: '/images/autorenew.svg',
    },
  },
  [VaultKey.CakeVault]: {
    name: <Trans>Stake CAKE</Trans>,
    description: <Trans>This product has been upgraded</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 1100000n,
    tokenImage: {
      primarySrc: `/images/cakeGrey.png`,
      secondarySrc: '/images/autorenew-disabled.png',
    },
  },
  [VaultKey.CakeFlexibleSideVault]: {
    name: <Trans>Flexible CAKE</Trans>,
    description: <Trans>Reward paused for this position</Trans>,
    autoCompoundFrequency: 5000,
    gasLimit: 500000n,
    tokenImage: {
      primarySrc: `/images/cakeGrey.png`,
      secondarySrc: '/images/autorenew-disabled.png',
    },
  },
  [VaultKey.IfoPool]: {
    name: 'IFO CAKE',
    description: <Trans>Stake CAKE to participate in IFOs</Trans>,
    autoCompoundFrequency: 1,
    gasLimit: 500000n,
    tokenImage: {
      primarySrc: `/images/tokens/${bscTokens.cake.address}.png`,
      secondarySrc: `/images/ifo-pool-icon.svg`,
    },
  },
} as const
