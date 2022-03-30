import { Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useVaultPoolContract } from 'hooks/useContract'
import { useSWRContract } from 'hooks/useSWRContract'

const BurnedCake = ({ account }) => {
  const { t } = useTranslation()
  const vaultPoolContract = useVaultPoolContract()

  const { data } = useSWRContract([vaultPoolContract, 'calculateOverdueFee', [account]])

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
        {t('After burning')}
      </Text>
      {data !== null || data !== undefined ? (
        <Text color="textSubtle" bold>
          {data} BURNED
        </Text>
      ) : (
        <Skeleton />
      )}
    </Flex>
  )
}
export default BurnedCake
