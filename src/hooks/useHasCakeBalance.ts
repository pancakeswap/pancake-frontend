import { getCakeAddress } from 'utils/addressHelpers'
import useTokenBalance from './useTokenBalance'

const useHasCakeBalance = (minimumBalance) => {
  const cakeBalance = useTokenBalance(getCakeAddress())
  return cakeBalance.gte(minimumBalance)
}

export default useHasCakeBalance
