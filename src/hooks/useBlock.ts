import { useContext } from 'react'
import { Context } from '../contexts/BscProvider'

const useBlcok = () => {
  const { block } = useContext(Context)
  return block
}

export default useBlcok