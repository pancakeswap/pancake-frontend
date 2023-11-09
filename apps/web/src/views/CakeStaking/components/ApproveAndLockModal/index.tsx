import { useTranslation } from '@pancakeswap/localization'
import { BscScanIcon, Modal, ModalProps, ModalV2, ScanLink, UseModalV2Props } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { ApproveAndLockStatus } from 'views/CakeStaking/types'
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
  lockCakeAmount: string
  lockWeeks: string
  hash?: string
  approved?: boolean
}

export const ApproveAndLockModal: React.FC<ApproveAndLockModalProps> = ({
  status,
  lockCakeAmount,
  lockWeeks,
  hash,
  approved,
  // modal props
  isOpen,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const lockInfo = <LockInfo amount={lockCakeAmount} week={lockWeeks} />
  const scanLink = hash ? (
    <ScanLink small icon={<BscScanIcon />} href={getBlockExploreLink(hash, 'transaction', chainId)}>
      {t('View on %site%', {
        site: t('Explorer'),
      })}
      {` ${hash.slice(0, 8)}...`}
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
            {!approved ? <StepsIndicator currentStep={status} /> : null}
          </>
        ) : null}

        {status === ApproveAndLockStatus.LOCK_CAKE_PENDING ? (
          <TxSubmittedModalContent title={t('Transaction Submitted')} subTitle={lockInfo} />
        ) : null}

        {status === ApproveAndLockStatus.CONFIRMED ? (
          <TxSubmittedModalContent title={t('Transaction receipt:')} subTitle={scanLink} />
        ) : null}
      </SeamlessModal>
    </ModalV2>
  )
}
