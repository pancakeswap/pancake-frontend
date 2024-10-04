import { ChainId } from '@pancakeswap/chains'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { DropdownMenuItems } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import React, { useMemo } from 'react'
import { multiChainPaths } from 'state/info/constant'
import { logMenuClick } from 'utils/customGTMEventTracking'

import config, { ConfigMenuDropDownItemsType, ConfigMenuItemsType } from '../config/config'
import { useMenuItemsStatus } from './useMenuItemsStatus'

export type UseMenuItemsParams = {
  onClick?: (e: React.MouseEvent<HTMLElement>, item: ConfigMenuDropDownItemsType) => void
}

export const useMenuItems = ({ onClick }: UseMenuItemsParams = {}): ConfigMenuItemsType[] => {
  const {
    t,
    currentLanguage: { code: languageCode },
  } = useTranslation()
  const { chainId } = useActiveChainId()
  const { isDark } = useTheme()
  const menuItemsStatus = useMenuItemsStatus()

  const menuItems = useMemo(() => config(t, isDark, languageCode, chainId), [t, isDark, languageCode, chainId])

  return useMemo(() => {
    const traverseItems = <T extends ConfigMenuItemsType | ConfigMenuDropDownItemsType>(
      item: T,
      menuStatus: Record<string, string>,
      translationFn: (key: string) => string,
      onClickFn?: (e: React.MouseEvent<HTMLButtonElement>, item: ConfigMenuDropDownItemsType) => void,
      chainIdNumber?: number,
    ): T => {
      if (item?.items && item.items.length > 0) {
        const innerItems = item.items.map((currentItem) =>
          traverseItems(currentItem, menuStatus, translationFn, onClickFn, chainIdNumber),
        )
        return { ...item, items: innerItems }
      }

      const onClickEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (item.href) {
          logMenuClick(item.href)
        }
        item.onClick?.(e)
        onClick?.(e, item)
      }

      const itemStatus = item.href ? menuItemsStatus[item.href] : undefined

      if (itemStatus) {
        let itemMenuStatus: DropdownMenuItems['status'] | undefined
        switch (itemStatus) {
          case 'soon':
            itemMenuStatus = { text: t('Soon'), color: 'warning' }
            break
          case 'live':
            itemMenuStatus = { text: t('Live'), color: 'failure' }
            break
          case 'vote_now':
            itemMenuStatus = { text: t('Vote Now'), color: 'success' }
            break
          case 'pot_open':
            itemMenuStatus = { text: t('Pot Open'), color: 'success' }
            break
          case 'lock_end':
            itemMenuStatus = { text: t('Lock End'), color: 'failure' }
            break
          default:
            itemMenuStatus = { text: t('New'), color: 'success' }
        }
        return { ...item, onClick: onClickEvent, status: itemMenuStatus }
      }

      if (item.href === '/info/v3') {
        const href = `${item.href}${multiChainPaths[chainId || ChainId.BSC] ?? ''}`
        return { ...item, href, onClick: onClickEvent }
      }

      return { ...item, onClick: onClickEvent }
    }

    if (menuItemsStatus && Object.keys(menuItemsStatus).length) {
      return menuItems.map((item) => traverseItems(item, menuItemsStatus, t, onClick, chainId))
    }
    return menuItems
  }, [t, menuItems, menuItemsStatus, onClick, chainId])
}
