import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useState } from 'react'

import { useTranslation } from 'contexts/Localization'
import { useBCakeFarmBoosterProxyFactoryContract } from 'hooks/useContract'

const CreateProxyButton = () => {
  const { t } = useTranslation()
  const farmBoosterProxyFactoryContract = useBCakeFarmBoosterProxyFactoryContract()
  const [isCreateProxyLoading, setIsCreateProxyLoading] = useState(false)

  return (
    <Button
      onClick={async () => {
        try {
          setIsCreateProxyLoading(true)
          await farmBoosterProxyFactoryContract.createFarmBoosterProxy()
        } catch (error) {
          console.error(error)
        } finally {
          setIsCreateProxyLoading(false)
        }
      }}
      isLoading={isCreateProxyLoading}
      width="100%"
      endIcon={isCreateProxyLoading ? <AutoRenewIcon spin color="currentColor" /> : undefined}
    >
      {isCreateProxyLoading ? t('Confirming...') : t('Enable')}
    </Button>
  )
}

export default CreateProxyButton
