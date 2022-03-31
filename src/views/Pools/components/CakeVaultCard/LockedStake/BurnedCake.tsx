import { useVaultPoolContract } from 'hooks/useContract'
import { useSWRContract } from 'hooks/useSWRContract'

const BurnedCake = ({ account = '' }) => {
  const vaultPoolContract = useVaultPoolContract()

  const { data } = useSWRContract([vaultPoolContract, 'calculateOverdueFee', [account]])

  return <>{`${data !== null || data !== undefined ? data : '-'} BURNED`}</>
}
export default BurnedCake
