import { FARMS_NAME_TAG, FARMS_USER_INFO } from 'state/farms/constants'

const cakePoolRelatedQueries = (account) => (query) => {
  const queryObject = query.queryKey?.[0]

  const isMasterchefQuery = queryObject?.entity === 'accountResource' && queryObject?.resourceType === FARMS_NAME_TAG

  const isPoolUserInfoHandleQuery =
    queryObject?.entity === 'tableItem' && queryObject?.data?.valueType === FARMS_USER_INFO

  const isBalances = queryObject?.entity === 'accountResources' && queryObject?.address === account

  return isMasterchefQuery || isPoolUserInfoHandleQuery || isBalances
}

export default cakePoolRelatedQueries
