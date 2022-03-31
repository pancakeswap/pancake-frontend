import { memo } from 'react'
import { useVaultPoolContract } from 'hooks/useContract'
import { useSWRContract } from 'hooks/useSWRContract'
import { useTranslation } from 'contexts/Localization'
import isUndefinedOrNull from 'utils/isUndefinedOrNull'

interface PropsType {
  account: string
}

const BurnedCake: React.FC<PropsType> = ({ account = '' }) => {
  const vaultPoolContract = useVaultPoolContract()
  const { t } = useTranslation()

  const { data } = useSWRContract([vaultPoolContract, 'calculateOverdueFee', [account]])

  let amount

  if (isUndefinedOrNull(data)) {
    amount = '-'
  } else {
    amount = data
  }

  return <>{t('%amount% burned', { amount })}</>
}
export default memo(BurnedCake)
