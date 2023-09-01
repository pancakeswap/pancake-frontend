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
  DocIcon,
  PresaleIcon,
  NftFillIcon,
  MoreIcon,
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
      label: t('TRADE'),
      icon: SwapIcon,
      fillIcon: SwapIcon,
      href: '/',
      showItemsOnMobile: false,
      items: [
        // {
        //   label: t('Swap'),
        //   href: '/swap',
        // },
        // {
        //   label: t('Liquidity'),
        //   href: '/liquidity',
        // },
        // {
        //   label: t('Perpetual'),
        //   href: getPerpetualUrl({
        //     chainId,
        //     languageCode,
        //     isDark,
        //   }),
        //   confirmModalId: 'usCitizenConfirmModal',
        //   type: DropdownMenuItemType.EXTERNAL_LINK,
        // },
        // {
        //   label: t('Bridge'),
        //   href: 'https://bridge.pancakeswap.finance/',
        //   type: DropdownMenuItemType.EXTERNAL_LINK,
        // },
        // {
        //   label: `${t('Limit')} (V2)`,
        //   href: '/limit-orders',
        //   supportChainIds: SUPPORT_ONLY_BSC,
        //   image: '/images/decorations/3d-coin.png',
        // },
        // {
        //   label: t('Buy Crypto'),
        //   href: '/buy-crypto',
        //   supportChainIds: SUPPORT_BUY_CRYPTO,
        // },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('FARMS'),
      href: '/farms',
      icon: EarnIcon,
      fillIcon: EarnIcon,
      image: '/images/decorations/pe2.png',
      supportChainIds: SUPPORT_FARMS,
      items: [
        // {
        //   label: t('Farms'),
        //   href: '/farms',
        //   supportChainIds: SUPPORT_FARMS,
        // },
        // {
        //   label: t('Pools'),
        //   href: '/pools',
        //   supportChainIds: POOL_SUPPORTED_CHAINS,
        // },
        // {
        //   label: t('Liquid Staking'),
        //   href: '/liquid-staking',
        //   supportChainIds: LIQUID_STAKING_SUPPORTED_CHAINS,
        // },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('POOLS'),
      href: '/pools',
      icon: TrophyIcon,
      fillIcon: TrophyIcon,
      supportChainIds: POOL_SUPPORTED_CHAINS,
      items: [],
    },
    {
      label: t('PRESALE'),
      href: '/presale',
      icon: PresaleIcon,
      fillIcon: PresaleIcon,
      supportChainIds: POOL_SUPPORTED_CHAINS,
      image: '/images/decorations/nft.png',
      items: [],
    },
    {
      label: t('DOCS'),
      href: 'https://docs.com',
      icon: DocIcon,
      hideSubNav: true,
      items: [],
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
