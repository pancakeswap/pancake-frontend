import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Flex,
  InjectedModalProps,
  Input,
  Modal,
  PancakeToggle,
  QuestionHelper,
  Text,
  ThemeSwitcher,
  Toggle,
} from '@pancakeswap/uikit'
import { ExpertModal } from '@pancakeswap/widgets-internal'

import { escapeRegExp } from '@pancakeswap/utils/escapeRegExp'
import {
  useAudioPlay,
  useExpertMode,
  useUserExpertModeAcknowledgement,
  useUserSingleHopOnly,
  useUserSlippage,
} from '@pancakeswap/utils/user'
import { useTheme } from 'next-themes'
import { useCallback, useState } from 'react'
import { styled } from 'styled-components'

export const withCustomOnDismiss =
  (Component) =>
  ({ onDismiss, customOnDismiss, ...props }: { onDismiss?: () => void; customOnDismiss: () => void }) => {
    const handleDismiss = useCallback(() => {
      onDismiss?.()
      if (customOnDismiss) {
        customOnDismiss()
      }
    }, [customOnDismiss, onDismiss])

    return <Component {...props} onDismiss={handleDismiss} />
  }

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
const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
}

const SlippageSetting = () => {
  const { t } = useTranslation()

  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippage()
  const [slippageInput, setSlippageInput] = useState('')

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 500) {
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  const parseCustomSlippage = (value: string) => {
    if (value === '' || inputRegex.test(escapeRegExp(value))) {
      setSlippageInput(value)

      try {
        const valueAsIntFromRoundedFloat = Number.parseInt((Number.parseFloat(value) * 100).toString())
        if (!Number.isNaN(valueAsIntFromRoundedFloat) && valueAsIntFromRoundedFloat < 5000) {
          setUserSlippageTolerance(valueAsIntFromRoundedFloat)
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <Flex flexDirection="column" mb="24px">
      <Flex mb="12px">
        <Text>{t('Slippage Tolerance')}</Text>
        <QuestionHelper
          text={t(
            'Setting a high slippage tolerance can help transactions succeed, but you may not get such a good price. Use with caution.',
          )}
          placement="top"
          ml="4px"
        />
      </Flex>
      <Flex flexWrap="wrap">
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setSlippageInput('')
            setUserSlippageTolerance(10)
          }}
          variant={userSlippageTolerance === 10 ? 'primary' : 'tertiary'}
        >
          0.1%
        </Button>
        <Button
          mt="4px"
          mr="4px"
          scale="sm"
          onClick={() => {
            setSlippageInput('')
            setUserSlippageTolerance(50)
          }}
          variant={userSlippageTolerance === 50 ? 'primary' : 'tertiary'}
        >
          0.5%
        </Button>
        <Button
          mr="4px"
          mt="4px"
          scale="sm"
          onClick={() => {
            setSlippageInput('')
            setUserSlippageTolerance(100)
          }}
          variant={userSlippageTolerance === 100 ? 'primary' : 'tertiary'}
        >
          1.0%
        </Button>
        <Flex alignItems="center">
          <Box width="76px" mt="4px">
            <Input
              scale="sm"
              inputMode="decimal"
              pattern="^[0-9]*[.,]?[0-9]{0,2}$"
              placeholder={(userSlippageTolerance / 100).toFixed(2)}
              value={slippageInput}
              onBlur={() => {
                parseCustomSlippage((userSlippageTolerance / 100).toFixed(2))
              }}
              onChange={(event) => {
                if (event.currentTarget.validity.valid) {
                  parseCustomSlippage(event.target.value.replace(/,/g, '.'))
                }
              }}
              isWarning={!slippageInputIsValid}
              isSuccess={![10, 50, 100].includes(userSlippageTolerance)}
            />
          </Box>
          <Text color="primary" bold ml="2px">
            %
          </Text>
        </Flex>
      </Flex>
      {!!slippageError && (
        <Text fontSize="14px" color={slippageError === SlippageError.InvalidInput ? 'red' : '#F3841E'} mt="8px">
          {slippageError === SlippageError.InvalidInput
            ? t('Enter a valid slippage percentage')
            : slippageError === SlippageError.RiskyLow
            ? t('Your transaction may fail')
            : t('Your transaction may be frontrun')}
        </Text>
      )}
    </Flex>
  )
}

export const SettingsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss }) => {
  const [audioPlay, setAudioPlay] = useAudioPlay()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()

  const { t } = useTranslation()
  const { resolvedTheme, setTheme } = useTheme()
  const [expertMode, setExpertMode] = useExpertMode()
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgement()

  const isDark = resolvedTheme === 'dark'

  const handleExpertModeToggle = () => {
    if (expertMode || !showExpertModeAcknowledgement) {
      setExpertMode((s) => !s)
    } else {
      setShowConfirmExpertModal(true)
    }
  }

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
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>{t('Expert Mode')}</Text>
              <QuestionHelper
                text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
                placement="top"
                ml="4px"
              />
            </Flex>
            <Toggle id="toggle-expert-mode-button" scale="md" checked={expertMode} onChange={handleExpertModeToggle} />
          </Flex>
          <SlippageSetting />
          <Flex justifyContent="space-between" alignItems="center" mb="24px">
            <Flex alignItems="center">
              <Text>{t('Allow Multihops')}</Text>
              <QuestionHelper text={t('Restricts swaps to direct pairs only.')} placement="top" ml="4px" />
            </Flex>
            <Toggle
              id="toggle-disable-multihop-button"
              checked={!singleHopOnly}
              scale="md"
              onChange={() => {
                setSingleHopOnly((s) => !s)
              }}
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
            <PancakeToggle checked={audioPlay} onChange={(e) => setAudioPlay(e.target.checked)} scale="md" />
          </Flex>
        </Flex>
      </ScrollableContainer>
    </Modal>
  )
}
