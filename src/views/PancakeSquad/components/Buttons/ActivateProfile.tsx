import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import { UserStatusEnum } from 'views/PancakeSquad/types'

type ActivateProfileButtonProps = {
  t: ContextApi['t']
  userStatus: UserStatusEnum
}

const ActivateProfileButton: React.FC<ActivateProfileButtonProps> = ({ t, userStatus }) => (
  <>
    {(userStatus === UserStatusEnum.NO_PROFILE || userStatus === UserStatusEnum.UNCONNECTED) && (
      <Button as={Link} to="/create-profile" mr="4px">
        {t('Activate Profile')}
      </Button>
    )}
  </>
)

export default ActivateProfileButton
