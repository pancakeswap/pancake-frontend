import { useTranslation } from '@pancakeswap/localization'
import { Button, Flex, InjectedModalProps, Modal, Text } from '@pancakeswap/uikit'
import NextLink from 'next/link'

interface ConnectSocialAccountModalProps extends InjectedModalProps {
  socialName: string
}

export const ConnectSocialAccountModal: React.FC<ConnectSocialAccountModalProps> = ({ socialName, onDismiss }) => {
  const { t } = useTranslation()

  return (
    <Modal title={t('Connect your account')} onDismiss={onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '380px']}
      >
        <Text textAlign="center" color="textSubtle" mb="8px">
          {t('%socialName% account is not connected. Please connect your %socialName% account.', { socialName })}
        </Text>
        <NextLink href="/profile?openSettingModal=true" passHref>
          <Button mt="50px">{t('Go to Profile')}</Button>
        </NextLink>
      </Flex>
    </Modal>
  )
}
