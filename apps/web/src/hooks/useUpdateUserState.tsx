import { useEffect, useState } from 'react'
import { useAppDispatch } from 'state'
import { updateVersion } from 'state/global/actions'

const useUpdateUserState = () => {
  const dispatch = useAppDispatch()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      dispatch(updateVersion())
    }
  }, [dispatch, isClient])
}

export default useUpdateUserState
