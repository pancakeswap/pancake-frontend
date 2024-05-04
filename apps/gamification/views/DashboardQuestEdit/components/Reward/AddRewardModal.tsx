import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, InjectedModalProps, Modal } from '@pancakeswap/uikit'
// import { TokenImage } from 'components/TokenImage'

interface AddRewardModalProps extends InjectedModalProps {}

export const AddRewardModal: React.FC<React.PropsWithChildren<AddRewardModalProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Add a reward')} onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '430px']}
      >
        {/* <TokenImage token={token} width={64} height={64} /> */}

        <Button width="100%" mt="24px">
          {t('Continue')}
        </Button>
      </Flex>
    </Modal>
  )
}
