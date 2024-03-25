import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { DropdownMenuItems } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import config, { ConfigMenuItemsType } from '../config/config'
import { useMenuItemsStatus } from './useMenuItemsStatus'

export const useMenuItems = (): ConfigMenuItemsType[] => {
  const {
    t,
    currentLanguage: { code: languageCode },
  } = useTranslation()
  const { chainId } = useActiveChainId()
  const { isDark } = useTheme()
  const menuItemsStatus = useMenuItemsStatus()

  const menuItems = useMemo(() => {
    return config(t, isDark, languageCode, chainId)
  }, [t, isDark, languageCode, chainId])

  return useMemo(() => {
    if (menuItemsStatus && Object.keys(menuItemsStatus).length) {
      return menuItems.map((item) => {
        const innerItems = item?.items?.map((innerItem) => {
          const itemStatus = innerItem.href ? menuItemsStatus[innerItem.href] : undefined

          if (itemStatus) {
            let itemMenuStatus: DropdownMenuItems['status'] | null = null
            if (itemStatus === 'soon') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Soon'), color: 'warning' }
            } else if (itemStatus === 'live') {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('Live'), color: 'failure' }
            } else {
              itemMenuStatus = <DropdownMenuItems['status']>{ text: t('New'), color: 'success' }
            }
            return { ...innerItem, status: itemMenuStatus }
          }

          return innerItem
        })
        return { ...item, items: innerItems }
      })
    }
    return menuItems
  }, [t, menuItems, menuItemsStatus])
}
