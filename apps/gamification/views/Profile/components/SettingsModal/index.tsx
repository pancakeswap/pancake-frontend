import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  DiscordIcon,
  DotIcon,
  Flex,
  FlexGap,
  InjectedModalProps,
  // InstagramIcon,
  // YoutubeIcon,
  Modal,
  TelegramIcon,
  Text,
  TwitterIcon,
} from '@pancakeswap/uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useAuth from 'hooks/useAuth'
import { useConnectDiscord } from 'views/Profile/hooks/settingsModal/useConnectDiscord'
import { useConnectTelegram } from 'views/Profile/hooks/settingsModal/useConnectTelegram'
import { useConnectTwitter } from 'views/Profile/hooks/settingsModal/useConnectTwitter'
import { UserInfo } from 'views/Profile/hooks/settingsModal/useUserSocialHub'
import { useAccount } from 'wagmi'

interface SocialComponentProps {
  icon: JSX.Element
  name: string
  disabled: boolean
  connected?: boolean
  connect?: () => void
  disconnect?: () => void
}

const SocialComponent: React.FC<SocialComponentProps> = ({ icon, disabled, name, connected, connect, disconnect }) => {
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
        <Button
          scale="sm"
          disabled={disabled}
          variant={connected ? 'subtle' : 'primary'}
          onClick={connected ? disconnect : connect}
        >
          {connected ? t('Disconnect') : t('Connect')}
        </Button>
        <DotIcon ml="8px" width={8} height={8} color={connected ? 'success' : 'textDisabled'} />
      </Flex>
    </Flex>
  )
}

interface SettingsModalProps extends InjectedModalProps {
  userInfo: UserInfo
  refresh: () => void
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ userInfo, refresh, onDismiss }) => {
  const { t } = useTranslation()
  const { logout } = useAuth()
  const { address: account } = useAccount()
  const disabled = !account
  const { connect: connectDiscord, disconnect: disconnectDiscord } = useConnectDiscord({ refresh })
  const { connect: connectTelegram, disconnect: disconnectTelegram } = useConnectTelegram({ userInfo, refresh })
  const { connect: connectTwitter, disconnect: disconnectTwitter } = useConnectTwitter({ refresh })

  return (
    <Modal title={t('Settings')} onDismiss={onDismiss}>
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
              disabled={disabled}
              icon={<TwitterIcon color="textSubtle" width={20} height={20} />}
              connected={Boolean(userInfo?.socialHubToSocialUserIdMap?.Twitter)}
              connect={connectTwitter}
              disconnect={disconnectTwitter}
            />
            <Box>
              <SocialComponent
                name={t('Telegram')}
                disabled={disabled}
                icon={<TelegramIcon color="textSubtle" width={20} height={20} />}
                connected={Boolean(userInfo?.socialHubToSocialUserIdMap?.Telegram)}
                connect={connectTelegram}
                disconnect={disconnectTelegram}
              />
            </Box>
            <SocialComponent
              name={t('Discord')}
              disabled={disabled}
              icon={<DiscordIcon color="textSubtle" width={20} height={20} />}
              connected={Boolean(userInfo?.socialHubToSocialUserIdMap?.Discord)}
              connect={connectDiscord}
              disconnect={disconnectDiscord}
            />
            {/* <SocialComponent
              name={t('Youtube')}
              disabled={disabled}
              icon={<YoutubeIcon color="textSubtle" width={20} height={20} />}
              connected={Boolean(userInfo?.socialHubToSocialUserIdMap?.Youtube)}
            />
            <SocialComponent
              name={t('Instagram')}
              disabled={disabled}
              icon={<InstagramIcon color="textSubtle" width={20} height={20} />}
              connected={Boolean(userInfo?.socialHubToSocialUserIdMap?.Instagram)}
            /> */}
          </FlexGap>
        </Box>
        <Box width="100%" mt="12px">
          {account ? (
            <>
              <Text fontSize={12} bold color="textSubtle">
                {t('Disconnect the wallet')}
              </Text>
              <Button width="100%" mt="12px" onClick={logout}>
                {t('Disconnect')}
              </Button>
            </>
          ) : (
            <ConnectWalletButton width="100%" />
          )}
        </Box>
      </Flex>
    </Modal>
  )
}
