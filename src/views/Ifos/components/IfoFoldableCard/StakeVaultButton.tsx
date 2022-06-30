import { useCallback } from 'react'
import { useRouter } from 'next/router'
import { Button } from '@pancakeswap/uikit'
import { useConfig } from 'views/Ifos/contexts/IfoContext'

import { useTranslation } from 'contexts/Localization'

const StakeVaultButton = (props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const { isExpanded, setIsExpanded } = useConfig()
  const isFinishedPage = router.pathname.includes('history')

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [])

  const handleClickButton = () => {
    // Always expand for mobile
    if (!isExpanded) {
      setIsExpanded(true)
    }

    if (isFinishedPage) {
      router.push('/ifo')
    } else {
      scrollToTop()
    }
  }

  return (
    <Button {...props} onClick={handleClickButton}>
      {t('Go to CAKE pool')}
    </Button>
  )
}

export default StakeVaultButton
