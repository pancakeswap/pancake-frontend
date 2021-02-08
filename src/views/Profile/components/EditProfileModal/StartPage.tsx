import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button, Flex, Text, InjectedModalProps } from '@pancakeswap-libs/uikit'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { useCake } from 'hooks/useContract'
import useI18n from 'hooks/useI18n'
import { useProfile } from 'state/hooks'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import useHasCakeBalance from 'hooks/useHasCakeBalance'
import { UseEditProfileResponse } from './reducer'

interface StartPageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
  goToRemove: UseEditProfileResponse['goToRemove']
  goToApprove: UseEditProfileResponse['goToApprove']
}

const Avatar = styled.img`
  border-radius: 50%;
  height: 128px;
  margin-bottom: 24px;
  width: 128px;
`

const DangerOutline = styled(Button).attrs({ variant: 'secondary', fullWidth: true })`
  border-color: ${({ theme }) => theme.colors.failure};
  color: ${({ theme }) => theme.colors.failure};
  margin-bottom: 24px;

  &:hover:not(:disabled):not(.button--disabled):not(:active) {
    border-color: ${({ theme }) => theme.colors.failure};
    opacity: 0.8;
  }
`

const StartPage: React.FC<StartPageProps> = ({ goToApprove, goToChange, goToRemove, onDismiss }) => {
  const [needsApproval, setNeedsApproval] = useState(null)
  const { numberCakeToUpdate } = useGetProfileCosts()
  const hasMinimumCakeRequired = useHasCakeBalance(numberCakeToUpdate)
  const { profile } = useProfile()
  const TranslateString = useI18n()
  const { account } = useWallet()
  const cakeContract = useCake()

  /**
   * Check if the wallet has the required CAKE allowance to change their profile pic
   * If they don't, we send them to the approval screen first when clicking "Change Profile Pic"
   */
  useEffect(() => {
    const checkApprovalStatus = async () => {
      const response = await cakeContract.methods.allowance(account, getPancakeProfileAddress()).call()
      const currentAllowance = new BigNumber(response)
      setNeedsApproval(currentAllowance.lt(numberCakeToUpdate))
    }

    if (account) {
      checkApprovalStatus()
    }
  }, [account, numberCakeToUpdate, setNeedsApproval, cakeContract])

  if (!profile) {
    return null
  }

  return (
    <Flex alignItems="center" justifyContent="center" flexDirection="column">
      <Avatar src={`/images/nfts/${profile.nft.images.md}`} />
      {!hasMinimumCakeRequired && (
        <Text as="p" mb="16px" color="failure">
          {TranslateString(999, `A minimum of ${getFullDisplayBalance(numberCakeToUpdate)} CAKE is required`)}
        </Text>
      )}
      <Button
        fullWidth
        mb="8px"
        onClick={needsApproval === true ? goToApprove : goToChange}
        disabled={!hasMinimumCakeRequired || needsApproval === null}
      >
        {TranslateString(999, 'Change Profile Pic')}
      </Button>
      <DangerOutline onClick={goToRemove}>{TranslateString(999, 'Remove Profile Pic')}</DangerOutline>
      <Button variant="text" fullWidth onClick={onDismiss}>
        {TranslateString(999, 'Close Window')}
      </Button>
    </Flex>
  )
}

export default StartPage
