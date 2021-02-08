import { useReducer } from 'react'

export enum Pages {
  START = 'start',
  CHANGE = 'change',
  REMOVE = 'remove',
  APPROVE = 'approve',
}

export type Actions =
  | {
      type: 'set_page'
      page: Pages
    }
  | {
      type: 'go_previous'
    }

export interface State {
  currentPage: Pages
  previousPage: Pages | null
}

const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case 'set_page':
      return {
        ...state,
        currentPage: action.page,
        previousPage: state.currentPage,
      }
    case 'go_previous':
      return {
        ...state,
        currentPage: state.previousPage,
        previousPage: state.currentPage,
      }
    default:
      return state
  }
}

export interface UseEditProfileResponse extends State {
  goToStart: () => void
  goToChange: () => void
  goToApprove: () => void
  goToRemove: () => void
  goPrevious: () => void
}

const useEditProfile = (): UseEditProfileResponse => {
  const [state, dispatch] = useReducer(reducer, { currentPage: Pages.START, previousPage: null })

  const goToStart = () => dispatch({ type: 'set_page', page: Pages.START })
  const goToChange = () => dispatch({ type: 'set_page', page: Pages.CHANGE })
  const goToRemove = () => dispatch({ type: 'set_page', page: Pages.REMOVE })
  const goToApprove = () => dispatch({ type: 'set_page', page: Pages.APPROVE })
  const goPrevious = () => dispatch({ type: 'go_previous' })

  return { ...state, goToStart, goToChange, goToRemove, goToApprove, goPrevious }
}

export default useEditProfile
