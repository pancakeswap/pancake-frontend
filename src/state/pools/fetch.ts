import poolsConfig from 'sushi/lib/constants/pools'

const fetchPools = async () => {
  const data = await Promise.all(
    poolsConfig.map(async (poolConfig) => {
      // TODO
      return {
        ...poolConfig,
      }
    }),
  )
  return data
}

export default fetchPools
