import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import {
  Flex,
  InjectedModalProps,
  Link,
  Modal,
  ExpertModal,
  PancakeToggle,
  QuestionHelper,
  Text,
  ThemeSwitcher,
  Toggle,
  Button,
  ModalV2,
  PreTitle,
  AutoColumn,
  Message,
  MessageText,
  NotificationDot,
  ButtonProps,
  Checkbox,
  AutoRow,
  RowFixed,
} from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { ReactNode, useCallback, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import {
  useAudioPlay,
  useExpertMode,
  useUserSingleHopOnly,
  useUserExpertModeAcknowledgement,
} from '@pancakeswap/utils/user'
import { useSubgraphHealthIndicatorManager, useUserUsernameVisibility } from 'state/user/hooks'
import { useUserTokenRisk } from 'state/user/hooks/useUserTokenRisk'
import {
  useOnlyOneAMMSourceEnabled,
  useUserSplitRouteEnable,
  useUserStableSwapEnable,
  useUserV2SwapEnable,
  useUserV3SwapEnable,
  useRoutingSettingChanged,
} from 'state/user/smartRouter'
import { AtomBox } from '@pancakeswap/ui'
import { useMMLinkedPoolByDefault } from 'state/user/mmLinkedPool'
import styled from 'styled-components'
import GasSettings from './GasSettings'
import TransactionSettings from './TransactionSettings'
import { SettingsMode } from './types'

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

export const withCustomOnDismiss =
  (Component) =>
  ({
    onDismiss,
    customOnDismiss,
    mode,
    ...props
  }: {
    onDismiss?: () => void
    customOnDismiss: () => void
    mode: SettingsMode
  }) => {
    const handleDismiss = useCallback(() => {
      onDismiss?.()
      if (customOnDismiss) {
        customOnDismiss()
      }
    }, [customOnDismiss, onDismiss])

    return <Component {...props} mode={mode} onDismiss={handleDismiss} />
  }

const SettingsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss, mode }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgement()
  const [expertMode, setExpertMode] = useExpertMode()
  const [audioPlay, setAudioMode] = useAudioPlay()
  const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
  const [userUsernameVisibility, setUserUsernameVisibility] = useUserUsernameVisibility()
  const { onChangeRecipient } = useSwapActionHandlers()
  const { chainId } = useActiveChainId()
  const [tokenRisk, setTokenRisk] = useUserTokenRisk()

  const { t } = useTranslation()
  const { isDark, setTheme } = useTheme()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        toggleExpertMode={() => setExpertMode((s) => !s)}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode || !showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      setExpertMode((s) => !s)
    } else {
      setShowConfirmExpertModal(true)
    }
  }

  return (
    <Modal title={t('Settings')} headerBackground="gradientCardHeader" onDismiss={onDismiss}>
      <ScrollableContainer>
        {mode === SettingsMode.GLOBAL && (
          <>
            <Flex pb="24px" flexDirection="column">
              <PreTitle mb="24px">{t('Global')}</PreTitle>
              <Flex justifyContent="space-between" mb="24px">
                <Text>{t('Dark mode')}</Text>
                <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                <Flex alignItems="center">
                  <Text>{t('Subgraph Health Indicator')}</Text>
                  <QuestionHelper
                    text={t(
                      'Turn on subgraph health indicator all the time. Default is to show the indicator only when the network is delayed',
                    )}
                    placement="top"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  id="toggle-subgraph-health-button"
                  checked={subgraphHealth}
                  scale="md"
                  onChange={() => {
                    setSubgraphHealth(!subgraphHealth)
                  }}
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                <Flex alignItems="center">
                  <Text>{t('Show username')}</Text>
                  <QuestionHelper text={t('Shows username of wallet instead of bunnies')} placement="top" ml="4px" />
                </Flex>
                <Toggle
                  id="toggle-username-visibility"
                  checked={userUsernameVisibility}
                  scale="md"
                  onChange={() => {
                    setUserUsernameVisibility(!userUsernameVisibility)
                  }}
                />
              </Flex>
              {chainId === ChainId.BSC && (
                <>
                  <Flex justifyContent="space-between" alignItems="center" mb="24px">
                    <Flex alignItems="center">
                      <Text>{t('Token Risk Scanning')}</Text>
                      <QuestionHelper
                        text={
                          <>
                            <Text>{t('Automatic risk scanning for the selected token')}</Text>
                            <Text as="span">{t('Risk scan results are provided by a third party')}</Text>
                            <Link style={{ display: 'inline' }} ml="4px" external href="https://www.avengerdao.org">
                              AvengerDAO
                            </Link>
                            <Text my="8px">
                              {t(
                                'It is a tool for indicative purposes only to allow users to check the reference risk level of a BNB Chain Smart Contract. Please do your own research - interactions with any BNB Chain Smart Contract is at your own risk.',
                              )}
                            </Text>
                          </>
                        }
                        placement="top"
                        ml="4px"
                      />
                    </Flex>
                    <Toggle
                      id="toggle-username-visibility"
                      checked={tokenRisk}
                      scale="md"
                      onChange={() => {
                        setTokenRisk(!tokenRisk)
                      }}
                    />
                  </Flex>
                  <GasSettings />
                </>
              )}
            </Flex>
          </>
        )}
        {mode === SettingsMode.SWAP_LIQUIDITY && (
          <>
            <Flex pt="3px" flexDirection="column">
              <PreTitle>{t('Swaps & Liquidity')}</PreTitle>
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                {chainId === ChainId.BSC && <GasSettings />}
              </Flex>
              <TransactionSettings />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text>{t('Expert Mode')}</Text>
                <QuestionHelper
                  text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
                  placement="top"
                  ml="4px"
                />
              </Flex>
              <Toggle
                id="toggle-expert-mode-button"
                scale="md"
                checked={expertMode}
                onChange={handleExpertModeToggle}
              />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text>{t('Flippy sounds')}</Text>
                <QuestionHelper
                  text={t('Fun sounds to make a truly immersive pancake-flipping trading experience')}
                  placement="top"
                  ml="4px"
                />
              </Flex>
              <PancakeToggle checked={audioPlay} onChange={() => setAudioMode((s) => !s)} scale="md" />
            </Flex>
            <RoutingSettingsButton />
          </>
        )}
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal

export function RoutingSettingsButton({
  children,
  showRedDot = true,
  buttonProps,
}: {
  children?: ReactNode
  showRedDot?: boolean
  buttonProps?: ButtonProps
}) {
  const [show, setShow] = useState(false)
  const { t } = useTranslation()
  const [isRoutingSettingChange] = useRoutingSettingChanged()
  return (
    <>
      <AtomBox textAlign="center">
        <NotificationDot show={isRoutingSettingChange && showRedDot}>
          <Button variant="text" onClick={() => setShow(true)} scale="sm" {...buttonProps}>
            {children || t('Customize Routing')}
          </Button>
        </NotificationDot>
      </AtomBox>
      <ModalV2 isOpen={show} onDismiss={() => setShow(false)} closeOnOverlayClick>
        <RoutingSettings />
      </ModalV2>
    </>
  )
}

function RoutingSettings() {
  const { t } = useTranslation()

  const [isStableSwapByDefault, setIsStableSwapByDefault] = useUserStableSwapEnable()
  const [v2Enable, setV2Enable] = useUserV2SwapEnable()
  const [v3Enable, setV3Enable] = useUserV3SwapEnable()
  const [split, setSplit] = useUserSplitRouteEnable()
  const [isMMLinkedPoolByDefault, setIsMMLinkedPoolByDefault] = useMMLinkedPoolByDefault()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const onlyOneAMMSourceEnabled = useOnlyOneAMMSourceEnabled()
  const [isRoutingSettingChange, reset] = useRoutingSettingChanged()

  return (
    <Modal
      title={t('Customize Routing')}
      headerRightSlot={
        isRoutingSettingChange && (
          <Button variant="text" scale="sm" onClick={reset}>
            {t('Reset')}
          </Button>
        )
      }
    >
      <AutoColumn
        width={{
          xs: '100%',
          md: 'screenSm',
        }}
        gap="16px"
      >
        <AtomBox>
          <PreTitle mb="24px">{t('Liquidity source')}</PreTitle>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>PancakeSwap V3</Text>
              <QuestionHelper
                text={
                  <Flex>
                    <Text mr="5px">
                      {t(
                        'V3 offers concentrated liquidity to provide deeper liquidity for traders with the same amount of capital, offering lower slippage and more flexible trading fee tiers.',
                      )}
                    </Text>
                  </Flex>
                }
                placement="top"
                ml="4px"
              />
            </Flex>
            <Toggle
              disabled={v3Enable && onlyOneAMMSourceEnabled}
              scale="md"
              checked={v3Enable}
              onChange={() => setV3Enable((s) => !s)}
            />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>PancakeSwap V2</Text>
              <QuestionHelper
                text={
                  <Flex flexDirection="column">
                    <Text mr="5px">
                      {t('The previous V2 exchange is where a number of iconic, popular assets are traded.')}
                    </Text>
                    <Text mr="5px" mt="1em">
                      {t('Recommend leaving this on to ensure backward compatibility.')}
                    </Text>
                  </Flex>
                }
                placement="top"
                ml="4px"
              />
            </Flex>
            <Toggle
              disabled={v2Enable && onlyOneAMMSourceEnabled}
              scale="md"
              checked={v2Enable}
              onChange={() => setV2Enable((s) => !s)}
            />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>PancakeSwap {t('StableSwap')}</Text>
              <QuestionHelper
                text={
                  <Flex flexDirection="column">
                    <Text mr="5px">
                      {t(
                        'StableSwap provides higher efficiency for stable or pegged assets and lower fees for trades.',
                      )}
                    </Text>
                  </Flex>
                }
                placement="top"
                ml="4px"
              />
            </Flex>
            <PancakeToggle
              disabled={isStableSwapByDefault && onlyOneAMMSourceEnabled}
              id="stable-swap-toggle"
              scale="md"
              checked={isStableSwapByDefault}
              onChange={() => {
                setIsStableSwapByDefault((s) => !s)
              }}
            />
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>{`PancakeSwap ${t('MM Linked Pool')}`}</Text>
              <QuestionHelper
                text={
                  <Flex flexDirection="column">
                    <Text mr="5px">{t('Trade through the market makers if they provide better deal')}</Text>
                    <Text mr="5px" mt="1em">
                      {t(
                        'If a trade is going through market makers, it will no longer route through any traditional AMM DEX pools.',
                      )}
                    </Text>
                  </Flex>
                }
                placement="top"
                ml="4px"
              />
            </Flex>
            <Toggle
              id="toggle-disable-mm-button"
              checked={isMMLinkedPoolByDefault}
              onChange={(e) => setIsMMLinkedPoolByDefault(e.target.checked)}
              scale="md"
            />
          </Flex>
          {onlyOneAMMSourceEnabled && (
            <Message variant="warning">
              <MessageText>
                {t('At least one AMM liquidity source has to be enabled to support normal trading.')}
              </MessageText>
            </Message>
          )}
        </AtomBox>
        <AtomBox>
          <PreTitle mb="24px">{t('Routing preference')}</PreTitle>
          <AutoRow alignItems="center" as="label" mb="24px" gap="16px">
            <Checkbox
              id="toggle-disable-multihop-button"
              checked={!singleHopOnly}
              scale="sm"
              onChange={() => {
                setSingleHopOnly((s) => !s)
              }}
            />
            <RowFixed>
              <Text>{t('Allow Multihops')}</Text>
              <QuestionHelper
                text={
                  <Flex flexDirection="column">
                    <Text mr="5px">
                      {t(
                        'Multihops enables token swaps through multiple hops between serval pools to achieve the best deal.',
                      )}
                    </Text>
                    <Text mr="5px" mt="1em">
                      {t(
                        'Turning this off will only allow direct swap, which may cause higher slippage or even fund loss.',
                      )}
                    </Text>
                  </Flex>
                }
                placement="top"
                ml="4px"
              />
            </RowFixed>
          </AutoRow>
          <AutoRow alignItems="center" mb="24px" as="label" gap="16px">
            <Checkbox
              id="toggle-disable-multihop-button"
              checked={split}
              scale="sm"
              onChange={() => {
                setSplit((s) => !s)
              }}
            />
            <RowFixed alignItems="center">
              <Text>{t('Allow Split Routing')}</Text>
              <QuestionHelper
                text={
                  <Flex flexDirection="column">
                    <Text mr="5px">
                      {t(
                        'Split routing enables token swaps to be broken into multiple routes to achieve the best deal.',
                      )}
                    </Text>
                    <Text mr="5px" mt="1em">
                      {t(
                        'Turning this off will only allow a single route, which may result in low efficiency or higher slippage.',
                      )}
                    </Text>
                  </Flex>
                }
                placement="top"
                ml="4px"
              />
            </RowFixed>
          </AutoRow>
        </AtomBox>
      </AutoColumn>
    </Modal>
  )
}
