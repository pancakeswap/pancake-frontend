import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { Button } from '@pancakeswap/uikit'
import { NextButton } from 'components/CrossChainVeCakeModal/components/NextButton'
import { SyncButton } from 'components/CrossChainVeCakeModal/components/SyncButton'
import { useStatusViewVeCakeWellSync } from 'components/CrossChainVeCakeModal/hooks/useMultichainVeCakeWellSynced'
import NextLink from 'next/link'
import { useAccount } from 'wagmi'

export const StatusViewButtons: React.FC<{ updateButton: React.ReactElement | null; locked: boolean }> = ({
  updateButton,
  locked,
}) => {
  const { chainId } = useAccount()
  const { t } = useTranslation()
  const { isVeCakeWillSync } = useStatusViewVeCakeWellSync(chainId)
  return (
    <>
      {!locked &&
        (chainId !== ChainId.BSC ? (
          <NextButton />
        ) : (
          <NextLink href="/cake-staking" passHref>
            <Button width="100%" style={{ whiteSpace: 'nowrap' }}>
              {t('Go to Lock')}
            </Button>
          </NextLink>
        ))}
      {!isVeCakeWillSync ? <SyncButton /> : updateButton}
    </>
  )
}
