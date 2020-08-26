import { useContext } from 'react'
import { Context } from '../contexts/YamProvider'

const useYam = () => {
  const { yam } = useContext(Context)
  return yam
}

export default useYam