import { createSelectorHook } from 'react-redux'
import { LocalContext } from './Provider'

const useSelector = createSelectorHook(LocalContext)

export default useSelector
