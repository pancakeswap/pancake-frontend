import { useUserUsernameVisibility } from 'state/user/hooks'

const useGetUsernameWithVisibility = (username: string) => {
  const [userUsernameVisibility, setUserUsernameVisibility] = useUserUsernameVisibility()

  return {
    usernameWithVisibility: username && (userUsernameVisibility ? username : '🐰🐰🐰🐰🐰🐰'),
    userUsernameVisibility,
    setUserUsernameVisibility,
  }
}

export default useGetUsernameWithVisibility
