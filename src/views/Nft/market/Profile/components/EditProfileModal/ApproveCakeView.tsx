import { AutoRenewIcon, Button, Flex, InjectedModalProps, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useCake } from 'hooks/useContract'
import useCatchTxError from 'hooks/useCatchTxError'
import { useProfile } from 'state/profile/hooks'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import { formatBigNumber } from 'utils/formatBalance'
import useGetProfileCosts from 'views/Nft/market/Profile/hooks/useGetProfileCosts'
import { UseEditProfileResponse } from './reducer'

interface ApproveCakePageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
}

const ApproveCakePage: React.FC<ApproveCakePageProps> = ({ goToChange, onDismiss }) => {
  const { profile } = useProfile()
  const { t } = useTranslation()
  const { fetchWithCatchTxError, loading: isApproving } = useCatchTxError()
  const {
    costs: { numberCakeToUpdate, numberCakeToReactivate },
  } = useGetProfileCosts()
  const cakeContract = useCake()
  const cost = profile.isActive ? numberCakeToUpdate : numberCakeToReactivate

  const handleApprove = async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return cakeContract.approve(getPancakeProfileAddress(), cost.mul(2).toString())
    })
    if (receipt?.status) {
      goToChange()
    }
  }

  if (!profile) {
    return null
  }

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text>{profile.isActive ? t('Cost to update:') : t('Cost to reactivate:')}</Text>
        <Text>{formatBigNumber(cost)} CAKE</Text>
      </Flex>
      <Button
        disabled={isApproving}
        isLoading={isApproving}
        endIcon={isApproving ? <AutoRenewIcon spin color="currentColor" /> : null}
        width="100%"
        mb="8px"
        onClick={handleApprove}
      >
        {t('Enable')}
      </Button>
      <Button variant="text" width="100%" onClick={onDismiss} disabled={isApproving}>
        {t('Close Window')}
      </Button>
    </Flex>
  )
}

export default ApproveCakePage
