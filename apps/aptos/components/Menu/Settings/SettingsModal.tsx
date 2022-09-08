import { useTranslation } from '@pancakeswap/localization'
import { Flex, InjectedModalProps, Modal, PancakeToggle, QuestionHelper, Text, ThemeSwitcher } from '@pancakeswap/uikit'
import { useAtom } from 'jotai'
import { useTheme } from 'next-themes'
import { userAtomWithLocalStorage } from 'state/user'
import styled from 'styled-components'

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
  const [audioPlay, setAudioPlay] = useAtom(userAtomWithLocalStorage)

  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <Modal
      title={t('Settings')}
      headerBackground="gradientCardHeader"
      onDismiss={onDismiss}
      style={{ maxWidth: '420px' }}
    >
      <ScrollableContainer>
        <Flex justifyContent="space-between" mb="24px">
          <Text>{t('Dark mode')}</Text>
          <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
        </Flex>
        <Flex pt="3px" flexDirection="column">
          {/* TODO: aptos swap */}
          {/* <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>{t('Expert Mode')}</Text>
              <QuestionHelper
                text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
                placement="top-start"
                ml="4px"
              />
            </Flex>
            <Toggle id="toggle-expert-mode-button" scale="md" checked={expertMode} onChange={handleExpertModeToggle} />
          </Flex> */}
          {/* TODO: aptos swap */}
          {/* <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>{t('Disable Multihops')}</Text>
              <QuestionHelper text={t('Restricts swaps to direct pairs only.')} placement="top-start" ml="4px" />
            </Flex>
            <Toggle
              id="toggle-disable-multihop-button"
              checked={singleHopOnly}
              scale="md"
              onChange={() => {
                setSingleHopOnly(!singleHopOnly)
              }}
            />
          </Flex> */}
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>{t('Flippy sounds')}</Text>
              <QuestionHelper
                text={t('Fun sounds to make a truly immersive pancake-flipping trading experience')}
                placement="top-start"
                ml="4px"
              />
            </Flex>
            <PancakeToggle checked={audioPlay === '1'} onChange={(e) => setAudioPlay(e.target.checked)} scale="md" />
          </Flex>
        </Flex>
      </ScrollableContainer>
    </Modal>
  )
}
