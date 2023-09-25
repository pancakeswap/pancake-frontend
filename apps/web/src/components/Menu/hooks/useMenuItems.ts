import { useTheme } from '@pancakeswap/hooks'
import { useMatchBreakpoints, DropdownMenuItems } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useUserNotUsCitizenAcknowledgement, IdType } from 'hooks/useUserIsUsCitizenAcknowledgement'
import { useMemo } from 'react'
import { multiChainPaths } from 'state/info/constant'
import config, { ConfigMenuItemsType } from '../config/config'
import { useMenuItemsStatus } from './useMenuItemsStatus'

export const useMenuItems = (onUsCitizenModalPresent?: () => void): ConfigMenuItemsType[] => {
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
  const [userNotUsCitizenAcknowledgement] = useUserNotUsCitizenAcknowledgement(IdType.PERPETUALS)

  return useMemo(() => {
    if (menuItemsStatus && Object.keys(menuItemsStatus).length) {
      return menuItems.map((item) => {
        const innerItems = item?.items?.map((innerItem) => {
          const itemStatus = menuItemsStatus[innerItem.href]
          const modalId = innerItem.confirmModalId
          const isInfo = innerItem.href === '/info/v3'
          if (itemStatus) {
            let itemMenuStatus = null
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
          if (modalId) {
            let onClickEvent = null
            if (modalId === 'usCitizenConfirmModal') {
              onClickEvent = (e: React.MouseEvent<HTMLElement>) => {
                if (!userNotUsCitizenAcknowledgement && onUsCitizenModalPresent) {
                  e.stopPropagation()
                  e.preventDefault()
                  onUsCitizenModalPresent()
                }
              }
            }
            return { ...innerItem, onClick: onClickEvent }
          }
          if (isInfo) {
            const href = `${innerItem.href}${multiChainPaths[chainId] ?? ''}`
            return { ...innerItem, href }
          }

          return innerItem
        })
        return { ...item, items: innerItems }
      })
    }
    return menuItems
  }, [t, menuItems, menuItemsStatus, userNotUsCitizenAcknowledgement, onUsCitizenModalPresent, chainId])
}
