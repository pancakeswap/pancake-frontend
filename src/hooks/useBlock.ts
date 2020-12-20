import { useContext } from 'react'
import { BlockContext } from 'contexts/BlockContext'

const useBlock = () => {
  const block: number = useContext(BlockContext)
  return block
}

export default useBlock
