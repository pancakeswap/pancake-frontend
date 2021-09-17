import { Button } from '@pancakeswap/uikit'
import { ContextApi } from 'contexts/Localization/types'
import React from 'react'
import { Link } from 'react-router-dom'

type ActivateProfileButtonProps = {
  t: ContextApi['t']
  isUserUnactiveProfile: boolean
}

const ActivateProfileButton: React.FC<ActivateProfileButtonProps> = ({ t, isUserUnactiveProfile }) => (
  <>
    {isUserUnactiveProfile && (
      <Button as={Link} to="/profile" scale="sm">
        {t('Activate Profile')}
      </Button>
    )}
  </>
)

export default ActivateProfileButton
