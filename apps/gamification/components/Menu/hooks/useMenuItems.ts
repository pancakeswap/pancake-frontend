import { useTranslation } from '@pancakeswap/localization'
import { DropdownMenuItems } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useMemo } from 'react'
import { useIsValidDashboardUser } from 'views/Dashboard/hooks/useIsValidDashboardUser'
import config, { ConfigMenuItemsType } from '../config/config'
import { useMenuItemsStatus } from './useMenuItemsStatus'

export const useMenuItems = (): ConfigMenuItemsType[] => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const menuItemsStatus = useMenuItemsStatus()
  const { isValidLoginToDashboard } = useIsValidDashboardUser()

  const menuItems = useMemo(() => {
    const forkConfig = [...config(t, chainId)]
    const removeDashboardNav = forkConfig.slice(1, forkConfig.length)
    return isValidLoginToDashboard ? config(t, chainId) : removeDashboardNav
  }, [t, chainId, isValidLoginToDashboard])

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
