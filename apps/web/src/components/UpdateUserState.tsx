import { useUserState } from 'state/user/reducer'
import { useEffect, useState } from 'react'
import { updateVersion } from 'state/global/actions'

// change it to true if we have events to check claim status
const UpdateUserState: React.FC<React.PropsWithChildren> = (props) => {
  const [, dispatch] = useUserState()

  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      dispatch(updateVersion())
    }
  }, [dispatch, isClient])

  return <div {...props} />
}

export default UpdateUserState
