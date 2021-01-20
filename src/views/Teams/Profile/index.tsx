import React from 'react'
import ProfileCreation from '../ProfileCreation'

const hasProfile = false

const Profile = () => {
  if (!hasProfile) {
    return <ProfileCreation />
  }

  return <div>Profile</div>
}

export default Profile
