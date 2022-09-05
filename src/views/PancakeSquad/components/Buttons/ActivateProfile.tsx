import { NextLinkFromReactRouter } from 'components/NextLink'
import { Button } from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { UserStatusEnum } from 'views/PancakeSquad/types'

type ActivateProfileButtonProps = {
  t: ContextApi['t']
  userStatus: UserStatusEnum
}

const ActivateProfileButton: React.FC<React.PropsWithChildren<ActivateProfileButtonProps>> = ({ t, userStatus }) => (
  <>
    {(userStatus === UserStatusEnum.NO_PROFILE || userStatus === UserStatusEnum.UNCONNECTED) && (
      <Button mr="4px">
        <NextLinkFromReactRouter to="/create-profile">{t('Activate Profile')}</NextLinkFromReactRouter>
      </Button>
    )}
  </>
)

export default ActivateProfileButton
