import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Flex, Skeleton, UserMenuItem } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

interface ProfileUserMenuItemProps {
  isLoading: boolean
  hasProfile: boolean
}

const Dot = styled.div`
  background-color: ${({ theme }) => theme.colors.failure};
  border-radius: 50%;
  height: 8px;
  width: 8px;
`

const ProfileUserMenuItem: React.FC<ProfileUserMenuItemProps> = ({ isLoading, hasProfile }) => {
  const { t } = useTranslation()

  if (isLoading) {
    return (
      <UserMenuItem>
        <Skeleton height="24px" width="35%" />
      </UserMenuItem>
    )
  }

  if (!hasProfile) {
    return (
      <UserMenuItem as={Link} to="/profile">
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          {t('Make a Profile')}
          <Dot />
        </Flex>
      </UserMenuItem>
    )
  }

  return (
    <UserMenuItem as={Link} to="/profile">
      {t('Your Profile')}
    </UserMenuItem>
  )
}

export default ProfileUserMenuItem
