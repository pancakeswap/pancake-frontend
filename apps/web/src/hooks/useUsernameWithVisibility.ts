import { Profile } from 'state/types'
import { useUserUsernameVisibility } from 'state/user/hooks'

const useGetUsernameWithVisibility = (profile: Profile) => {
  const [userUsernameVisibility, setUserUsernameVisibility] = useUserUsernameVisibility()

  return {
    usernameWithVisibility: profile?.username && (userUsernameVisibility ? profile?.username : '🐰🐰🐰🐰🐰🐰'),
    userUsernameVisibility,
    setUserUsernameVisibility,
  }
}

export default useGetUsernameWithVisibility
