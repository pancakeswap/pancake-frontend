import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Flex, PreTitle } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { memo } from 'react'
import GasSettings from '../GasSettings'
import { PrimaryOutlineButton } from '../styles'
import TransactionSettings from '../TransactionSettings'
import { TabContent } from './TabContent'

interface SettingsTabProps {
  onCustomizeRoutingClick?: () => void
}

export const SettingsTab = memo(({ onCustomizeRoutingClick }: SettingsTabProps) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()

  return (
    <TabContent>
      <Flex flexDirection="column">
        <PreTitle>{t('Swaps & Liquidity')}</PreTitle>
        <Flex justifyContent="space-between" alignItems="center" mt="12px" mb="24px">
          {chainId === ChainId.BSC && <GasSettings />}
        </Flex>
        <TransactionSettings />
      </Flex>
      <PrimaryOutlineButton
        variant="text"
        mt="auto"
        $height="48px"
        width="100%"
        onClick={() => onCustomizeRoutingClick?.()}
      >
        {t('Customize Routing')}
      </PrimaryOutlineButton>
    </TabContent>
  )
})
