import { Box, Button, Flex, Skeleton, Text, CalculateIcon, useModal } from '@pancakeswap/uikit'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool, DeserializedLockedVaultUser } from 'state/types'
import { useVaultApy } from 'hooks/useVaultApy'
import { useVaultMaxDuration } from 'hooks/useVaultMaxDuration'
import { VaultPosition } from 'utils/cakePool'
import { VaultRoiCalculatorModal } from '../../Vault/VaultRoiCalculatorModal'

interface CakeVaultAprProps {
  pool: DeserializedPool
  userData: DeserializedLockedVaultUser
  vaultPosition: VaultPosition
}

const CakeVaultApr: React.FC<CakeVaultAprProps> = ({ pool, userData, vaultPosition }) => {
  const { t } = useTranslation()
  const maxLockDuration = useVaultMaxDuration()

  const { flexibleApy, lockedApy } = useVaultApy({
    duration:
      vaultPosition > VaultPosition.Flexible
        ? +userData.lockEndTime - +userData.lockStartTime
        : maxLockDuration?.toNumber(),
  })

  const [onPresentFlexibleApyModal] = useModal(<VaultRoiCalculatorModal pool={pool} />)
  const [onPresentLockedApyModal] = useModal(<VaultRoiCalculatorModal pool={pool} initialView={1} />)

  return (
    <>
      <Box mb="10px">
        <Flex justifyContent="space-between">
          <Text fontSize="16px" color="textSubtle" textAlign="left">
            {t('Flexible APY')}
          </Text>
          {flexibleApy ? (
            <Flex alignItems="center" justifyContent="flex-start">
              <Balance fontSize="16px" value={parseFloat(flexibleApy)} decimals={2} unit="%" fontWeight="600" />
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  onPresentFlexibleApyModal()
                }}
                variant="text"
                width="20px"
                height="20px"
                padding="0px"
                marginLeft="4px"
              >
                <CalculateIcon color="textSubtle" width="20px" />
              </Button>
            </Flex>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </Box>
      <Box mb="10px">
        <Flex justifyContent="space-between">
          <Text fontSize="16px" color="textSubtle" textAlign="left">
            {t('Locked APY')}
          </Text>
          {lockedApy && maxLockDuration ? (
            <Flex alignItems="center" justifyContent="flex-start">
              <Text fontSize="16px" style={{ whiteSpace: 'nowrap' }} fontWeight="600">
                {maxLockDuration.gt(0) ? t('Up to') : '-'}
              </Text>
              {maxLockDuration.gt(0) && (
                <>
                  <Balance
                    ml="7px"
                    fontSize="16px"
                    value={parseFloat(lockedApy)}
                    decimals={2}
                    unit="%"
                    fontWeight="600"
                  />
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      onPresentLockedApyModal()
                    }}
                    variant="text"
                    width="20px"
                    height="20px"
                    padding="0px"
                    marginLeft="4px"
                  >
                    <CalculateIcon color="textSubtle" width="20px" />
                  </Button>
                </>
              )}
            </Flex>
          ) : (
            <Skeleton width="80px" height="16px" />
          )}
        </Flex>
      </Box>
    </>
  )
}

export default CakeVaultApr
