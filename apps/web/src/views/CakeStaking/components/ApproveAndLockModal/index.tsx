import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, BscScanIcon, Modal, ModalProps, ModalV2, ScanLink, UseModalV2Props } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApproveAndLockStatus } from 'state/vecake/atoms'
import { getBlockExploreLink } from 'utils'
import { TxErrorModalContent } from 'views/CakeStaking/components/ApproveAndLockModal/TxErrorModalContent'
import { LockInfo } from './LockInfo'
import { PendingModalContent } from './PendingModalContent'
import { StepsIndicator } from './StepsIndicator'
import { TxSubmittedModalContent } from './TxSubmittedModalContent'

const SeamlessModal: React.FC<React.PropsWithChildren<Omit<ModalProps, 'title'> & { title?: string }>> = ({
  children,
  title = '',
  ...props
}) => {
  return (
    <Modal
      title={title}
      minHeight="415px"
      width={['100%', '100%', '100%', '367px']}
      headerPadding="12px 24px"
      bodyPadding="0 24px 24px"
      headerBackground="transparent"
      headerBorderColor="transparent"
      {...props}
    >
      {children}
    </Modal>
  )
}
type ApproveAndLockModalProps = UseModalV2Props & {
  status: ApproveAndLockStatus
  cakeLockAmount: string
  cakeLockWeeks: string
  cakeLockTxHash?: string
  cakeLockApproved?: boolean
}

export const ApproveAndLockModal: React.FC<ApproveAndLockModalProps> = ({
  status,
  cakeLockAmount,
  cakeLockWeeks,
  cakeLockTxHash,
  cakeLockApproved,
  // modal props
  isOpen,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const lockInfo = <LockInfo status={status} amount={cakeLockAmount} week={cakeLockWeeks} />
  const scanLink = cakeLockTxHash ? (
    <ScanLink small icon={<BscScanIcon />} href={getBlockExploreLink(cakeLockTxHash, 'transaction', chainId)}>
      {t('View on %site%', {
        site: t('Explorer'),
      })}
      {` ${cakeLockTxHash.slice(0, 8)}...`}
    </ScanLink>
  ) : null
  return (
    <ModalV2 isOpen={isOpen} onDismiss={onDismiss}>
      <SeamlessModal>
        {status < ApproveAndLockStatus.LOCK_CAKE_PENDING ? (
          <>
            <PendingModalContent
              title={status === ApproveAndLockStatus.APPROVING_TOKEN ? t('Approve CAKE spending') : t('Confirm Lock')}
              subTitle={status === ApproveAndLockStatus.APPROVING_TOKEN ? null : lockInfo}
            />
            {!cakeLockApproved ? <StepsIndicator currentStep={status} /> : null}
          </>
        ) : null}
        {[
          ApproveAndLockStatus.LOCK_CAKE_PENDING,
          ApproveAndLockStatus.INCREASE_WEEKS_PENDING,
          ApproveAndLockStatus.INCREASE_AMOUNT_PENDING,
        ].includes(status) ? (
          <TxSubmittedModalContent title={t('Transaction Submitted')} subTitle={lockInfo} />
        ) : null}
        {[ApproveAndLockStatus.INCREASE_AMOUNT, ApproveAndLockStatus.INCREASE_WEEKS].includes(status) ? (
          <PendingModalContent title={t('Confirm Lock')} subTitle={lockInfo} />
        ) : null}
        {status === ApproveAndLockStatus.UNLOCK_CAKE ? <PendingModalContent title={t('Confirm unlock')} /> : null}
        {status === ApproveAndLockStatus.MIGRATE ? <PendingModalContent title={t('Confirm migrate')} /> : null}
        {[ApproveAndLockStatus.UNLOCK_CAKE_PENDING, ApproveAndLockStatus.MIGRATE_PENDING].includes(status) ? (
          <TxSubmittedModalContent title={t('Transaction Submitted')} />
        ) : null}
        {status === ApproveAndLockStatus.ERROR ? (
          <TxErrorModalContent
            title={t('Transaction failed. For detailed error message:')}
            subTitle={
              <AutoColumn gap="16px">
                {scanLink} {lockInfo}
              </AutoColumn>
            }
          />
        ) : null}
        {status === ApproveAndLockStatus.CONFIRMED ? (
          <TxSubmittedModalContent title={t('Transaction receipt:')} subTitle={scanLink} />
        ) : null}
        {status === ApproveAndLockStatus.REJECT ? <TxErrorModalContent title={t('Transaction rejected')} /> : null}
      </SeamlessModal>
    </ModalV2>
  )
}
