import { ChainId } from '@pancakeswap/chains'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { DropdownMenuItems, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import React, { useMemo } from 'react'
import { multiChainPaths } from 'state/info/constant'
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
  const { isMobile } = useMatchBreakpoints()

  const menuItems = useMemo(() => {
    const mobileConfig = [...config(t, isDark, languageCode, chainId)]
    mobileConfig.push(mobileConfig.splice(3, 1)[0])
    return isMobile ? mobileConfig : config(t, isDark, languageCode, chainId)
  }, [t, isDark, languageCode, chainId, isMobile])

  return useMemo(() => {
    if (menuItemsStatus && Object.keys(menuItemsStatus).length) {
      return menuItems.map((item) => {
        const innerItems = item?.items?.map((currentItem) => {
          const onClickEvent = (e: React.MouseEvent<HTMLButtonElement>) => {
            currentItem.onClick?.(e)
            onClick?.(e, currentItem)
          }
          const innerItem = {
            ...currentItem,
            onClick: onClickEvent,
          }

          const itemStatus = innerItem.href ? menuItemsStatus[innerItem.href] : undefined
          const isInfo = innerItem.href === '/info/v3'

          if (itemStatus) {
            let itemMenuStatus: DropdownMenuItems['status'] | null = null
            if (itemStatus === 'soon') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Soon'), color: 'warning' }
            } else if (itemStatus === 'live') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Live'), color: 'failure' }
            } else if (itemStatus === 'vote_now') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Vote Now'), color: 'success' }
            } else if (itemStatus === 'pot_open') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Pot Open'), color: 'success' }
            } else if (itemStatus === 'lock_end') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Lock End'), color: 'failure' }
            } else {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('New'), color: 'success' }
            }
            return { ...innerItem, status: itemMenuStatus }
          }

          if (isInfo) {
            const href = `${innerItem.href}${multiChainPaths[chainId || ChainId.BSC] ?? ''}`
            return { ...innerItem, href }
          }

          return innerItem
        })
        return { ...item, items: innerItems }
      })
    }
    return menuItems
  }, [t, menuItems, menuItemsStatus, onClick, chainId])
}
