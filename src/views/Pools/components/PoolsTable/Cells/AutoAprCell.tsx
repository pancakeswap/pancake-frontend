import { Skeleton, Text } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { FlexGap } from 'components/Layout/Flex'
import { useTranslation } from 'contexts/Localization'
import { useVaultApy } from 'hooks/useVaultApy'
import { useVaultMaxDuration } from 'hooks/useVaultMaxDuration'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import BaseCell, { CellContent } from './BaseCell'

interface AprCellProps {
  pool: DeserializedPool
}

const AutoAprCell: React.FC<AprCellProps> = ({ pool }) => {
  const { t } = useTranslation()

  const {
    userData: { userShares },
  } = useVaultPoolByKey(pool.vaultKey)

  const maxLockDuration = useVaultMaxDuration()
  const { flexibleApy, lockedApy } = useVaultApy({ duration: maxLockDuration?.toNumber() })

  if (!userShares.gt(0)) {
    return (
      <>
        <BaseCell role="cell" flex={['1 0 50px', '4.5', '1 0 120px', null, '2 0 100px']}>
          <CellContent>
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Flexible APY')}
            </Text>
            {flexibleApy ? (
              <Balance fontSize="16px" value={parseFloat(flexibleApy)} decimals={2} unit="%" fontWeight={[600, 400]} />
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </CellContent>
        </BaseCell>
        <BaseCell role="cell" flex={['1 0 50px', '1 0 50px', '2 0 100px', null, '1 0 120px']}>
          <CellContent>
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Locked APY')}
            </Text>
            {lockedApy ? (
              <FlexGap gap="4px" flexWrap="wrap">
                <Text style={{ whiteSpace: 'nowrap' }} fontWeight={[500, 400]}>
                  {t('Up to')}
                </Text>
                <Balance fontSize="16px" value={parseFloat(lockedApy)} decimals={2} unit="%" fontWeight={[600, 400]} />
              </FlexGap>
            ) : (
              <Skeleton width="80px" height="16px" />
            )}
          </CellContent>
        </BaseCell>
      </>
    )
  }

  return (
    <BaseCell role="cell" flex={['1 0 50px', '1 0 50px', '2 0 100px', '2 0 100px', '1 0 120px']}>
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('APY')}
        </Text>
        {flexibleApy ? (
          <Balance fontSize="16px" value={parseFloat(flexibleApy)} decimals={2} unit="%" />
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellContent>
    </BaseCell>
  )
}

export default AutoAprCell
