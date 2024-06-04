import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  DiscordIcon,
  DotIcon,
  Flex,
  FlexGap,
  InjectedModalProps,
  InstagramIcon,
  Modal,
  TelegramIcon,
  Text,
  TwitterIcon,
  YoutubeIcon,
} from '@pancakeswap/uikit'

interface SocialComponentProps {
  icon: JSX.Element
  name: string
  connected?: boolean
}

const SocialComponent: React.FC<SocialComponentProps> = ({ icon, name, connected }) => {
  const { t } = useTranslation()
  return (
    <Flex>
      <Flex mr="auto">
        {icon}
        <Text bold style={{ alignSelf: 'center' }} ml="8px">
          {name}
        </Text>
      </Flex>
      <Flex>
        <Button variant={connected ? 'subtle' : 'primary'} scale="sm">
          {connected ? t('Disconnect') : t('Connect')}
        </Button>
        <DotIcon ml="8px" width={8} height={8} color={connected ? 'success' : 'textDisabled'} />
      </Flex>
    </Flex>
  )
}

interface SettingsModalProps extends InjectedModalProps {}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onDismiss }) => {
  const { t } = useTranslation()

  const isConnected = false

  return (
    <Modal title={t('Settings')} onDismiss={() => onDismiss}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width={['100%', '100%', '100%', '320px']}
      >
        <Box width="100%">
          <Text fontSize={12} bold color="textSubtle" mb="12px">
            {t('Connect your social accounts')}
          </Text>
          <FlexGap width="100%" gap="12px" flexDirection="column">
            <SocialComponent
              name={t('X')}
              icon={<TwitterIcon color="textSubtle" width={20} height={20} />}
              connected={isConnected}
            />
            <SocialComponent
              name={t('Telegram')}
              icon={<TelegramIcon color="textSubtle" width={20} height={20} />}
              connected={isConnected}
            />
            <SocialComponent
              name={t('Discord')}
              icon={<DiscordIcon color="textSubtle" width={20} height={20} />}
              connected={isConnected}
            />
            <SocialComponent
              name={t('Youtube')}
              icon={<YoutubeIcon color="textSubtle" width={20} height={20} />}
              connected={isConnected}
            />
            <SocialComponent
              name={t('Instagram')}
              icon={<InstagramIcon color="textSubtle" width={20} height={20} />}
              connected={isConnected}
            />
          </FlexGap>
        </Box>
        <Box width="100%" mt="12px">
          <Text fontSize={12} bold color="textSubtle">
            {t('Disconnect the wallet')}
          </Text>
          <Button width="100%" mt="12px">
            {t('Disconnect')}
          </Button>
        </Box>
      </Flex>
    </Modal>
  )
}
