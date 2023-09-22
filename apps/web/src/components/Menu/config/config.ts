import {
  MenuItemsType,
  DropdownMenuItemType,
  SwapIcon,
  SwapFillIcon,
  EarnFillIcon,
  PancakeProtectorIcon,
  EarnIcon,
  TrophyIcon,
  TrophyFillIcon,
  MoreIcon,
  BirthdayIcon,
  DropdownMenuItems,
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { SUPPORTED_CHAIN_IDS as POOL_SUPPORTED_CHAINS } from '@pancakeswap/pools'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { getPerpetualUrl } from 'utils/getPerpetualUrl'
import {
  SUPPORT_BUY_CRYPTO,
  SUPPORT_FARMS,
  SUPPORT_ONLY_BSC,
  LIQUID_STAKING_SUPPORTED_CHAINS,
} from 'config/constants/supportChains'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Trade'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showItemsOnMobile: false,
      items: [
        {
          label: t('Swap'),
          href: '/swap',
        },
        {
          label: t('Liquidity'),
          href: '/liquidity',
        },
        {
          label: t('Perpetual'),
          href: getPerpetualUrl({
            chainId,
            languageCode,
            isDark,
          }),
          confirmModalId: 'usCitizenConfirmModal',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: t('Bridge'),
          href: 'https://bridge.pancakeswap.finance/',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: `${t('Limit')} (V2)`,
          href: '/limit-orders',
          supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/decorations/3d-coin.png',
        },
        {
          label: t('Buy Crypto'),
          href: '/buy-crypto',
          supportChainIds: SUPPORT_BUY_CRYPTO,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Earn'),
      href: '/farms',
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      image: '/images/decorations/pe2.png',
      supportChainIds: SUPPORT_FARMS,
      items: [
        {
          label: t('Farms'),
          href: '/farms',
          supportChainIds: SUPPORT_FARMS,
        },
        {
          label: t('Pools'),
          href: '/pools',
          supportChainIds: POOL_SUPPORTED_CHAINS,
        },
        {
          label: t('Liquid Staking'),
          href: '/liquid-staking',
          supportChainIds: LIQUID_STAKING_SUPPORTED_CHAINS,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Win'),
      href: '/prediction',
      icon: TrophyIcon,
      fillIcon: TrophyFillIcon,
      supportChainIds: SUPPORT_ONLY_BSC,
      items: [
        {
          label: t('Trading Reward'),
          href: '/trading-reward',
          hideSubNav: true,
        },
        {
          label: t('Trading Competition'),
          href: '/competition',
          image: '/images/decorations/tc.png',
          hideSubNav: true,
        },
        {
          label: t('Prediction (BETA)'),
          href: '/prediction',
          image: '/images/decorations/prediction.png',
        },
        {
          label: t('Lottery'),
          href: '/lottery',
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Pottery (BETA)'),
          href: '/pottery',
          image: '/images/decorations/lottery.png',
        },
      ],
    },
    {
      label: t('Game'),
      icon: PancakeProtectorIcon,
      hideSubNav: true,
      href: 'https://protectors.pancakeswap.finance',
      items: [
        {
          label: t('Pancake Protectors'),
          href: 'https://protectors.pancakeswap.finance',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
      ],
    },
    {
      label: t('Birthday'),
      icon: BirthdayIcon,
      hideSubNav: true,
      items: [
        {
          label: t('Uranus Communities'),
          href: 'https://blog.pancakeswap.finance/articles/pancake-swap-s-de-fi-galaxy-tour-planet-1-uranus-communities-unite-with-your-local-de-fi-heroes',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: t('Mercury Mysteries'),
          href: 'https://blog.pancakeswap.finance/articles/pancake-swap-s-de-fi-galaxy-tour-planet-2-mercury-mysteries-the-enigma-of-multichain-swaps',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: t('Venus Protectors'),
          href: 'https://blog.pancakeswap.finance/articles/pancake-swap-s-de-fi-galaxy-tour-planet-3-venus-protector-pancake-protectors-birthday-nft',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: t('Uranus Unity Rain'),
          href: 'https://blog.pancakeswap.finance/articles/pancake-swap-s-de-fi-galaxy-tour-planet-1-uranus-unity-rain-showering-cake-rewards-on-telegram',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: t('Mars Lottery Paradise'),
          href: 'https://blog.pancakeswap.finance/articles/pancake-swap-s-de-fi-galaxy-tour-planet-4-mars-mystique-lottery-paradise',
          status: { text: t('New'), color: 'success' },
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
      ],
    },
    {
      label: '',
      href: '/info',
      icon: MoreIcon,
      hideSubNav: true,
      items: [
        {
          label: t('Info'),
          href: '/info/v3',
        },
        {
          label: t('IFO'),
          href: '/ifo',
          supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/ifos/ifo-bunny.png',
        },
        {
          label: t('NFT'),
          href: `${nftsBaseUrl}`,
          supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/decorations/nft.png',
        },
        {
          label: t('Affiliate Program'),
          href: '/affiliates-program',
        },
        {
          label: t('Voting'),
          href: '/voting',
          supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/voting/voting-bunny.png',
        },
        {
          type: DropdownMenuItemType.DIVIDER,
        },
        {
          label: t('Leaderboard'),
          href: '/teams',
          supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/decorations/leaderboard.png',
        },
        {
          type: DropdownMenuItemType.DIVIDER,
        },
        {
          label: t('Blog'),
          href: 'https://blog.pancakeswap.finance',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: t('Docs'),
          href: 'https://docs.pancakeswap.finance',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
