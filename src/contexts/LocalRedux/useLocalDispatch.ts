import { useContext } from 'react'
import { LocalContext } from './Provider'

export default function useLocalDispatch() {
  const { store: localStore } = useContext(LocalContext)

  return localStore.dispatch
}
