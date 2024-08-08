import { useAtom } from 'jotai'
import atomWithStorageWithErrorCatch from 'utils/atomWithStorageWithErrorCatch'

const USER_NAME_SHOW = 'pcs:user-name-show'

const userShowUserNameAtom = atomWithStorageWithErrorCatch<boolean>(USER_NAME_SHOW, false)

export function useUserUsernameVisibility() {
  return useAtom(userShowUserNameAtom)
}

const useGetUsernameWithVisibility = (username?: string) => {
  const [userUsernameVisibility, setUserUsernameVisibility] = useUserUsernameVisibility()

  return {
    usernameWithVisibility: username && (userUsernameVisibility ? username : '🐰🐰🐰🐰🐰🐰'),
    userUsernameVisibility,
    setUserUsernameVisibility,
  }
}

export default useGetUsernameWithVisibility
