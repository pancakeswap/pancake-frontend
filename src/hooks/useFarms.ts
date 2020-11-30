import useSushi from 'hooks/useSushi'
import { getFarms } from 'sushi/utils'
import { Farm } from 'types/farms'

const useFarms = (): Farm[] => {
  const sushi = useSushi()
  return getFarms(sushi)
}

export default useFarms
