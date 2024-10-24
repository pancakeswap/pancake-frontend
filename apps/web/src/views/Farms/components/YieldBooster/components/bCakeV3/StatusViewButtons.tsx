import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Button } from '@pancakeswap/uikit'
import { NextButton } from 'components/CrossChainVeCakeModal/components/NextButton'
import { SyncButton } from 'components/CrossChainVeCakeModal/components/SyncButton'
import { useStatusViewVeCakeWellSync } from 'components/CrossChainVeCakeModal/hooks/useMultichainVeCakeWellSynced'
import NextLink from 'next/link'
import useAccountActiveChain from 'hooks/useAccountActiveChain'

export const StatusViewButtons: React.FC<{
  updateButton: React.ReactElement | null
  locked: boolean
  isTableView?: boolean
}> = ({ updateButton, locked, isTableView = false }) => {
  const { account, chainId } = useAccountActiveChain()
  const { t } = useTranslation()
  const { isVeCakeWillSync } = useStatusViewVeCakeWellSync(chainId)
  const isBnbChain = chainId === ChainId.BSC
  return (
    <>
      {!locked &&
        (!isBnbChain ? (
          <NextButton width={isTableView ? 'auto' : undefined} />
        ) : (
          <NextLink href="/cake-staking" passHref>
            <Button width="100%" style={{ whiteSpace: 'nowrap' }}>
              {t('Go to Lock')}
            </Button>
          </NextLink>
        ))}
      {account && !isVeCakeWillSync && !isBnbChain ? (
        <SyncButton width={isTableView ? 'auto' : undefined} />
      ) : (
        updateButton
      )}
    </>
  )
}
