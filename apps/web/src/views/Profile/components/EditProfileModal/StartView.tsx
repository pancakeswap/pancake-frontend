import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, InjectedModalProps, Message, MessageText } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import ProfileAvatarWithTeam from 'components/ProfileAvatarWithTeam'
import { FetchStatus } from 'config/constants/types'
import { useCakeEnable } from 'hooks/useCakeEnable'
import { useCake } from 'hooks/useContract'
import { useBSCCakeBalance } from 'hooks/useTokenBalance'
import { useEffect, useState } from 'react'
import { useProfile } from 'state/profile/hooks'
import { styled } from 'styled-components'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { requiresApproval } from 'utils/requiresApproval'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { useAccount } from 'wagmi'
import { UseEditProfileResponse } from './reducer'

interface StartPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
  goToRemove: UseEditProfileResponse['goToRemove']
  goToApprove: UseEditProfileResponse['goToApprove']
}

const DangerOutline = styled(Button).attrs({ variant: 'secondary' })`
  border-color: ${({ theme }) => theme.colors.failure};
  color: ${({ theme }) => theme.colors.failure};
  margin-bottom: 24px;

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    border-color: ${({ theme }) => theme.colors.failure};
    opacity: 0.8;
  }
`

const AvatarWrapper = styled.div`
  height: 64px;
  width: 64px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 128px;
    width: 128px;
  }
`

const StartPage: React.FC<React.PropsWithChildren<StartPageProps>> = ({ goToApprove, goToChange, goToRemove }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const cakeContract = useCake()
  const { profile } = useProfile()
  const { balance: cakeBalance, fetchStatus } = useBSCCakeBalance()
  const {
    costs: { numberCakeToUpdate, numberCakeToReactivate },
    isLoading: isProfileCostsLoading,
  } = useGetProfileCosts()
  const [needsApproval, setNeedsApproval] = useState<boolean | null>(null)
  const minimumCakeRequired = profile?.isActive ? numberCakeToUpdate : numberCakeToReactivate
  const hasMinimumCakeRequired = fetchStatus === FetchStatus.Fetched && cakeBalance >= minimumCakeRequired
  const { handleEnable, pendingEnableTx } = useCakeEnable(new BigNumber(minimumCakeRequired.toString()))
  const [showCakeRequireFlow, setShowCakeRequireFlow] = useState(false)

  useEffect(() => {
    if (!isProfileCostsLoading && !hasMinimumCakeRequired && !showCakeRequireFlow) {
      setShowCakeRequireFlow(true)
    }
  }, [isProfileCostsLoading, hasMinimumCakeRequired, showCakeRequireFlow])

  /**
   * Check if the wallet has the required CAKE allowance to change their profile pic or reactivate
   * If they don't, we send them to the approval screen first
   */
  useEffect(() => {
    const checkApprovalStatus = async () => {
      const approvalNeeded = await requiresApproval(
        cakeContract,
        account!,
        getPancakeProfileAddress(),
        minimumCakeRequired,
      )
      setNeedsApproval(approvalNeeded)
    }

    if (account && !isProfileCostsLoading) {
      checkApprovalStatus()
    }
  }, [account, minimumCakeRequired, setNeedsApproval, cakeContract, isProfileCostsLoading])

  if (!profile) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <AvatarWrapper>
        <ProfileAvatarWithTeam profile={profile} />
      </AvatarWrapper>
      {profile.isActive ? (
        <>
          <Message variant="warning" my="16px">
            <MessageText>
              {t(
                "Before editing your profile, please make sure you've claimed all the unspent CAKE from previous IFOs!",
              )}
            </MessageText>
          </Message>
          {showCakeRequireFlow ? (
            <Flex mb="16px" pb="16px">
              <ApproveConfirmButtons
                isApproveDisabled={isProfileCostsLoading || hasMinimumCakeRequired}
                isApproving={pendingEnableTx}
                isConfirmDisabled={isProfileCostsLoading || !hasMinimumCakeRequired || needsApproval === null}
                isConfirming={false}
                onApprove={handleEnable}
                onConfirm={needsApproval === true ? goToApprove : goToChange}
                confirmLabel={t('Change Profile Pic')}
              />
            </Flex>
          ) : (
            <Button
              width="100%"
              mb="8px"
              onClick={needsApproval === true ? goToApprove : goToChange}
              disabled={isProfileCostsLoading || !hasMinimumCakeRequired || needsApproval === null}
            >
              {t('Change Profile Pic')}
            </Button>
          )}
          <DangerOutline width="100%" onClick={goToRemove}>
            {t('Remove Profile Pic')}
          </DangerOutline>
        </>
      ) : showCakeRequireFlow ? (
        <Flex mb="8px" mt="8px">
          <ApproveConfirmButtons
            isApproveDisabled={isProfileCostsLoading || hasMinimumCakeRequired}
            isApproving={pendingEnableTx}
            isConfirmDisabled={isProfileCostsLoading || !hasMinimumCakeRequired || needsApproval === null}
            isConfirming={false}
            onApprove={handleEnable}
            onConfirm={needsApproval === true ? goToApprove : goToChange}
            confirmLabel={t('Reactivate Profile')}
          />
        </Flex>
      ) : (
        <Button
          width="100%"
          mt="8px"
          mb="8px"
          onClick={needsApproval === true ? goToApprove : goToChange}
          disabled={isProfileCostsLoading || !hasMinimumCakeRequired || needsApproval === null}
        >
          {t('Reactivate Profile')}
        </Button>
      )}
    </Flex>
  )
}

export default StartPage
