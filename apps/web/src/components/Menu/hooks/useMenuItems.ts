import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { LinkStatus } from '@pancakeswap/uikit/src/widgets/Menu/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useUserNotUsCitizenAcknowledgement } from 'hooks/useUserIsUsCitizenAcknowledgement'
import { useMemo } from 'react'
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

  const menuItems = useMemo(() => {
    return config(t, isDark, languageCode, chainId)
  }, [t, isDark, languageCode, chainId])
  const [userNotUsCitizenAcknowledgement] = useUserNotUsCitizenAcknowledgement()

  return useMemo(() => {
    if (menuItemsStatus && Object.keys(menuItemsStatus).length) {
      return menuItems.map((item) => {
        const innerItems = item.items.map((innerItem) => {
          const itemStatus = menuItemsStatus[innerItem.href]
          const modalId = innerItem.confirmModalId
          if (itemStatus) {
            let itemMenuStatus
            if (itemStatus === 'soon') {
              itemMenuStatus = <LinkStatus>{ text: t('Soon'), color: 'warning' }
            } else if (itemStatus === 'live') {
              itemMenuStatus = <LinkStatus>{ text: t('Live'), color: 'failure' }
            } else if (itemStatus === 'vote_now') {
              itemMenuStatus = <LinkStatus>{ text: t('Vote Now'), color: 'success' }
            } else if (itemStatus === 'pot_open') {
              itemMenuStatus = <LinkStatus>{ text: t('Pot Open'), color: 'success' }
            } else if (itemStatus === 'lock_end') {
              itemMenuStatus = <LinkStatus>{ text: t('Lock End'), color: 'failure' }
            } else {
              itemMenuStatus = <LinkStatus>{ text: t('New'), color: 'success' }
            }
            return { ...innerItem, status: itemMenuStatus }
          }
          if (modalId) {
            let onClickEvent
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

          return innerItem
        })
        return { ...item, items: innerItems }
      })
    }
    return menuItems
  }, [t, menuItems, menuItemsStatus, userNotUsCitizenAcknowledgement, onUsCitizenModalPresent])
}
