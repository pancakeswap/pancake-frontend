import useFarms from 'hooks/useFarms'

const useFarm = (lpSymbol: string) => {
  const farms = useFarms()
  const farm = farms.find((f) => f.lpSymbol === lpSymbol)
  return farm
}

export default useFarm
