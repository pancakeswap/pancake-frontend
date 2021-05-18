import React from 'react'
import { Button, Flex, Heading, useModal, Won } from '@pancakeswap/uikit'
import { useProfile } from 'state/hooks'
import { useTranslation } from 'contexts/Localization'
import ClaimNftAndCakeModal, { useCanClaim } from './ClaimGiftModal'
import HeaderWrapper from './HeaderWrapper'
import EditProfileModal from './EditProfileModal'

const ProfileHeader = () => {
  const { t } = useTranslation()
  const { canClaim, checkClaimStatus } = useCanClaim()
  const [onPresentClaimGiftModal] = useModal(<ClaimNftAndCakeModal onSuccess={checkClaimStatus} />)
  const [onEditProfileModal] = useModal(<EditProfileModal />, false)
  const { hasProfile } = useProfile()

  return (
    <HeaderWrapper>
      <Flex
        flexDirection={['column', null, 'row']}
        alignItems={['start', null, 'center']}
        justifyContent="space-between"
      >
        <div>
          <Heading as="h1" scale="xxl" mb="8px" color="secondary">
            {t('Your Profile')}
          </Heading>
          <Heading as="h2" scale="lg" mb="16px">
            {t('Check your stats and collect achievements')}
          </Heading>
          {hasProfile && <Button onClick={onEditProfileModal}>{t('Edit Profile')}</Button>}
        </div>
        {canClaim && (
          <Button variant="tertiary" onClick={onPresentClaimGiftModal} startIcon={<Won />}>
            {t('You’ve got a gift to claim!')}
          </Button>
        )}
      </Flex>
    </HeaderWrapper>
  )
}

export default ProfileHeader
