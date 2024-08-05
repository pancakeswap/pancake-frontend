import { useTranslation } from '@pancakeswap/localization'
import { AutoRenewIcon, Button, Flex, InjectedModalProps, Text } from '@pancakeswap/uikit'
import { formatBigInt } from '@pancakeswap/utils/formatBalance'
import { useWeb3React } from '@pancakeswap/wagmi'
import useCatchTxError from 'hooks/useCatchTxError'
import { useCake } from 'hooks/useContract'
import { useProfile } from 'hooks/useProfile'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import useGetProfileCosts from 'views/Profile/hooks/useGetProfileCosts'
import { UseEditProfileResponse } from './reducer'

interface ApproveCakePageProps extends InjectedModalProps {
  goToChange: UseEditProfileResponse['goToChange']
}

const ApproveCakePage: React.FC<React.PropsWithChildren<ApproveCakePageProps>> = ({ goToChange, onDismiss }) => {
  const { profile } = useProfile()
  const { t } = useTranslation()
  const { account, chain } = useWeb3React()
  const { fetchWithCatchTxError, loading: isApproving } = useCatchTxError()
  const {
    costs: { numberCakeToUpdate, numberCakeToReactivate },
  } = useGetProfileCosts()
  const cakeContract = useCake()

  if (!profile) {
    return null
  }

  const cost = profile.isActive ? numberCakeToUpdate : numberCakeToReactivate

  const handleApprove = async () => {
    if (!account || !cakeContract) return

    const receipt = await fetchWithCatchTxError(() => {
      return cakeContract.write.approve([getPancakeProfileAddress(), cost * 2n], {
        account,
        chain,
      })
    })
    if (receipt?.status) {
      goToChange()
    }
  }

  return (
    <Flex flexDirection="column">
      <Flex alignItems="center" justifyContent="space-between" mb="24px">
        <Text>{profile.isActive ? t('Cost to update:') : t('Cost to reactivate:')}</Text>
        <Text>{formatBigInt(cost)} CAKE</Text>
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
