import { createContext } from 'react'
import { Provider } from 'react-redux'

export const LocalContext = createContext<any | undefined>(undefined)

export default ({ children, store }) => {
  return (
    <Provider store={store} context={LocalContext}>
      {children}
    </Provider>
  )
}
