import { useTranslation } from '@pancakeswap/localization'
import { Flex, InjectedModalProps, Modal, PreTitle, Text, ThemeSwitcher, Toggle } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import { useUserShowTestnet } from 'hooks/useUserShowTestnet'
import { styled } from 'styled-components'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`

export const SettingsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss }) => {
  const { t } = useTranslation()
  const { isDark, setTheme } = useTheme()
  const [showTestnet, setShowTestnet] = useUserShowTestnet()

  return (
    <Modal title={t('Settings')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <ScrollableContainer>
        <Flex pb="24px" flexDirection="column">
          <PreTitle mb="24px">{t('Global')}</PreTitle>
          <Flex justifyContent="space-between" mb="24px">
            <Text>{t('Dark mode')}</Text>
            <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mb="24px">
          <Flex alignItems="center">
            <Text>{t('Show testnet')}</Text>
          </Flex>
          <Toggle
            id="toggle-show-testnet"
            checked={showTestnet}
            scale="md"
            onChange={() => {
              setShowTestnet((s) => !s)
            }}
          />
        </Flex>
      </ScrollableContainer>
    </Modal>
  )
}
