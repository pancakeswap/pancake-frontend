import { useContext } from 'react'
import { ProfileCreationContext } from './ProfileCreationProvider'

const useProfileCreation = () => {
  const ctx = useContext(ProfileCreationContext)

  if (!ctx) {
    throw new Error('useProfileCreation must be used within a ProfileCreationProvider')
  }

  return ctx
}

export default useProfileCreation
