import { useContext } from 'react'
import { LocalContext } from './Provider'

export default function useLocalDispatch() {
  const { localDispatch } = useContext(LocalContext)

  return localDispatch
}
