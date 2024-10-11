import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, Flex, FlexGap, Input, Message, QuestionHelper, Text } from '@pancakeswap/uikit'
import { useUserSlippage } from '@pancakeswap/utils/user'
import { useState } from 'react'
import { escapeRegExp } from 'utils'

import { VerticalDivider } from '@pancakeswap/widgets-internal'
import { useUserTransactionTTL } from 'hooks/useTransactionDeadline'
import styled from 'styled-components'
import { PrimaryOutlineButton } from './styles'

const ButtonsContainer = styled(FlexGap).attrs({ flexWrap: 'wrap', gap: '4px' })`
  background-color: ${({ theme }) => theme.colors.input};
  border-radius: ${({ theme }) => theme.radii.default};
  padding: 1px;
  width: fit-content;

  box-shadow: ${({ theme }) => theme.shadows.inset};
`

const StyledButton = styled(Button)`
  height: 52px;
`

const StyledVerticalDivider = styled(VerticalDivider).attrs(({ theme }) => ({ bg: theme.colors.inputSecondary }))`
  margin: 0 4px;
`

enum SlippageError {
  InvalidInput = 'InvalidInput',
  RiskyLow = 'RiskyLow',
  RiskyHigh = 'RiskyHigh',
  RiskyVeryHigh = 'RiskyVeryHigh',
}

enum DeadlineError {
  InvalidInput = 'InvalidInput',
}

const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`) // match escaped "." characters via in a non-capturing group
const THREE_DAYS_IN_SECONDS = 60 * 60 * 24 * 3

const DEFAULT_TXN_DEADLINE = 20 // In Minutes

export const DEFAULT_SLIPPAGE_TOLERANCE = 50

const SlippageTabs = () => {
  const [userSlippageTolerance, setUserSlippageTolerance] = useUserSlippage()
  const [ttl, setTTL] = useUserTransactionTTL()
  const [slippageInput, setSlippageInput] = useState('')
  const [deadlineInput, setDeadlineInput] = useState('')

  const { t } = useTranslation()

  const slippageInputIsValid =
    slippageInput === '' || (userSlippageTolerance / 100).toFixed(2) === Number.parseFloat(slippageInput).toFixed(2)
  const deadlineInputIsValid =
    deadlineInput === '' || (ttl !== undefined && (Number(ttl) / 60).toString() === deadlineInput)

  let slippageError: SlippageError | undefined
  if (slippageInput !== '' && !slippageInputIsValid) {
    slippageError = SlippageError.InvalidInput
  } else if (slippageInputIsValid && userSlippageTolerance < 50) {
    // Slippage < 0.5%
    slippageError = SlippageError.RiskyLow
  } else if (slippageInputIsValid && userSlippageTolerance > 2000) {
    // Slippage > 20%
    slippageError = SlippageError.RiskyVeryHigh
  } else if (slippageInputIsValid && userSlippageTolerance > 100) {
    // Slippage > 1%
    slippageError = SlippageError.RiskyHigh
  } else {
    slippageError = undefined
  }

  let deadlineError: DeadlineError | undefined
  if (deadlineInput !== '' && !deadlineInputIsValid) {
    deadlineError = DeadlineError.InvalidInput
  } else {
    deadlineError = undefined
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

  const parseCustomDeadline = (value: string) => {
    setDeadlineInput(value)

    try {
      const valueAsInt: number = Number.parseInt(value) * 60
      if (!Number.isNaN(valueAsInt) && valueAsInt > 60 && valueAsInt < THREE_DAYS_IN_SECONDS) {
        setTTL(valueAsInt)
      } else {
        deadlineError = DeadlineError.InvalidInput
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Flex flexDirection="column">
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
        <ButtonsContainer>
          <StyledButton
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(10)
            }}
            variant={userSlippageTolerance === 10 ? 'subtle' : 'light'}
          >
            0.1%
          </StyledButton>
          <StyledButton
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(50)
            }}
            variant={userSlippageTolerance === 50 ? 'subtle' : 'light'}
          >
            0.5%
          </StyledButton>
          <StyledButton
            scale="sm"
            onClick={() => {
              setSlippageInput('')
              setUserSlippageTolerance(100)
            }}
            variant={userSlippageTolerance === 100 ? 'subtle' : 'light'}
          >
            1.0%
          </StyledButton>
          <Flex ml="8px" pr="8px" alignItems="center">
            <Box position="relative" width="82px">
              <Input
                scale="md"
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
                style={{
                  paddingRight: '28px',
                }}
              />
              <Flex position="absolute" right="8px" top="8px" alignItems="center">
                <StyledVerticalDivider />
                <Text color="textSubtle"> %</Text>
              </Flex>
            </Box>
          </Flex>
        </ButtonsContainer>
        {!!slippageError && (
          <Message
            mt="8px"
            variant={
              slippageError === SlippageError.InvalidInput
                ? 'primary'
                : slippageError === SlippageError.RiskyLow || slippageError === SlippageError.RiskyHigh
                ? 'warning'
                : 'danger'
            }
          >
            <Text>
              {slippageError === SlippageError.InvalidInput
                ? t('Enter a valid slippage percentage')
                : slippageError === SlippageError.RiskyLow
                ? t('Your transaction may fail')
                : t('Your transaction may be frontrun')}
              .<br />
              <Text
                as="button"
                role="button"
                onClick={() => {
                  setSlippageInput('')
                  setUserSlippageTolerance(DEFAULT_SLIPPAGE_TOLERANCE)
                }}
                style={{
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  display: 'inline-block',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                }}
                bold
              >
                {t('Reset slippage settings')}
              </Text>{' '}
              {t('to avoid potential loss')}.
            </Text>
          </Message>
        )}
      </Flex>
      <Box mb="24px">
        <Flex alignItems="center">
          <Text>{t('Tx deadline')}</Text>
          <QuestionHelper
            text={t('Your transaction will revert if it is left confirming for longer than this time.')}
            placement="top"
            ml="4px"
          />
        </Flex>
        <Flex alignItems="center">
          <Box position="relative" width="128px" mt="4px">
            <Input
              scale="md"
              inputMode="numeric"
              pattern="^[0-9]+$"
              isWarning={!!deadlineError}
              placeholder={(Number(ttl) / 60).toString()}
              value={deadlineInput}
              onChange={(event) => {
                if (event.currentTarget.validity.valid) {
                  parseCustomDeadline(event.target.value)
                }
              }}
              style={{
                paddingRight: '48px',
              }}
            />
            <Flex position="absolute" right="8px" top="8px" alignItems="center">
              <StyledVerticalDivider />
              <Text color="textSubtle">{t('Mins')}</Text>
            </Flex>
          </Box>
          <PrimaryOutlineButton
            ml="8px"
            mt="3px"
            variant="text"
            scale="sm"
            onClick={() => parseCustomDeadline(DEFAULT_TXN_DEADLINE.toString())}
          >
            {t('Reset')}
          </PrimaryOutlineButton>
        </Flex>
      </Box>
    </Flex>
  )
}

export default SlippageTabs
