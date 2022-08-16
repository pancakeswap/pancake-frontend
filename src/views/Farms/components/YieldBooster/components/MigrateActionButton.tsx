import { Button, useModal } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useTranslation } from '@pancakeswap/localization'
import { useERC20 } from 'hooks/useContract'
import useToast from 'hooks/useToast'
import useCatchTxError from 'hooks/useCatchTxError'
import { useAppDispatch } from 'state'

import { fetchFarmUserDataAsync } from 'state/farms'
import { useFarmFromPid, useFarmUser } from 'state/farms/hooks'
import { getAddress } from 'utils/addressHelpers'
import useUnstakeFarms from '../../../hooks/useUnstakeFarms'
import { BCakeMigrateModal } from '../../BCakeMigrateModal'

interface MigrateActionButtonPropsType {
  pid: number
}

const MigrateActionButton: React.FunctionComponent<MigrateActionButtonPropsType> = ({ pid }) => {
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()
  const { account } = useWeb3React()
  const { onUnstake } = useUnstakeFarms(pid)
  const { stakedBalance } = useFarmUser(pid)
  const { lpAddresses } = useFarmFromPid(pid)

  const lpAddress = getAddress(lpAddresses)
  const lpContract = useERC20(lpAddress)
  const dispatch = useAppDispatch()

  const handleUnstakeWithCallback = async (amount: string, callback: () => void) => {
    const receipt = await fetchWithCatchTxError(() => {
      return onUnstake(amount)
    })
    if (receipt?.status) {
      toastSuccess(
        `${t('Unstaked')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your earnings have also been harvested to your wallet')}
        </ToastDescriptionWithTx>,
      )
      callback()
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid] }))
    }
  }

  const [onPresentMigrate] = useModal(
    <BCakeMigrateModal
      pid={pid}
      stakedBalance={stakedBalance}
      lpContract={lpContract}
      onUnStack={handleUnstakeWithCallback}
    />,
  )

  return <Button onClick={onPresentMigrate}>{t('Migrate')}</Button>
}

export default MigrateActionButton
