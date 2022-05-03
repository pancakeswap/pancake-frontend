import { createSelectorHook } from 'react-redux'
import { createSelector } from 'reselect'
import { LocalContext } from './Provider'

export const useOriginSelector = createSelectorHook(LocalContext)

const useSelector = (selector) => {
  const predictionsSelector = createSelector((state) => ({ predictions: state }), selector)

  return useOriginSelector(predictionsSelector)
}

export default useSelector
