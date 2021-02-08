import React from 'react'
import { Button, Flex, Heading, useModal, Won } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import ClaimNftAndCakeModal, { useCanClaim } from './ClaimGiftModal'
import HeaderWrapper from './HeaderWrapper'

const ProfileHeader = () => {
  const TranslateString = useI18n()
  const { canClaim, checkClaimStatus } = useCanClaim()
  const [onPresentClaimGiftModal] = useModal(<ClaimNftAndCakeModal onSuccess={checkClaimStatus} />)

  return (
    <HeaderWrapper>
      <Flex
        flexDirection={['column', null, 'row']}
        alignItems={['start', null, 'center']}
        justifyContent="space-between"
      >
        <div>
          <Heading as="h1" size="xxl" mb="8px" color="secondary">
            {TranslateString(999, 'Your Profile')}
          </Heading>
          <Heading as="h2" size="lg" mb="16px">
            {TranslateString(999, 'Check your stats and collect achievements')}
          </Heading>
        </div>
        {canClaim && (
          <Button variant="tertiary" onClick={onPresentClaimGiftModal} startIcon={<Won />}>
            {TranslateString(999, "You've got a gift to claim!")}
          </Button>
        )}
      </Flex>
    </HeaderWrapper>
  )
}

export default ProfileHeader
