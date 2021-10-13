import React from 'react'

import './Profile.Styles.css'
import { Flex, Heading } from '@rug-zombie-libs/uikit'
import ProfilePage from './ProfilePage'
import { account } from '../../redux/get'
import PageHeader from '../../components/PageHeader'

const Profile: React.FC = () => {
  return (
    <>
      <PageHeader background='#101820'>
        <Flex justifyContent='space-between' flexDirection={['column', null, 'row']}>
          <Flex flexDirection='column' mr={['8px', 0]}>
            <Heading as='h1' size='xxl' color='secondary' mb='24px'>
              Your Profile
            </Heading>
            <Heading size='md' color='text'>
              View your Zombie stats and collection.
            </Heading>
          </Flex>
        </Flex>
      </PageHeader>
      {account() && account() !== "" ? <ProfilePage/> :  <Flex style={{ paddingTop: "10px", width: "100%", justifyContent: "center"}}>
        <div className="total-earned text-shadow">Connect Wallet to view your profile</div>
      </Flex>}

    </>
  )
}

export default Profile