import { SMARTCHEF_ADDRESS } from 'contracts/smartchef/constants'

const poolRelatedQueries = (account) => (query) => {
  const queryObject = query.queryKey?.[0]

  const isBalances = queryObject?.entity === 'accountResources' && queryObject?.address === account

  const isSmartChef = queryObject?.entity === 'accountResources' && queryObject?.address === SMARTCHEF_ADDRESS

  return isBalances || isSmartChef
}

export default poolRelatedQueries
