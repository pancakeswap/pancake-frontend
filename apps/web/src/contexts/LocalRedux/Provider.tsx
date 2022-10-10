import { createContext } from 'react'
import { Provider } from 'react-redux'

export const LocalContext = createContext(null)

export default ({ children, store }) => {
  return (
    <Provider store={store} context={LocalContext}>
      {children}
    </Provider>
  )
}
