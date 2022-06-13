import styled from 'styled-components'
import { useState } from 'react'
import { Flex, Box, Button, Text, HelpIcon, useTooltip, LogoRoundIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'
import EnableButton from './EnableButton'
import DepositButton from './DepositButton'

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`
const Container = styled.div`
  border-radius: 16px;
  padding: 8px 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`

const DepositAction: React.FC = () => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const [value, setValue] = useState('')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Fake Text'), {
    placement: 'bottom',
  })

  const onMax = () => {
    console.log('onclick max')
  }

  // if (true) {
  //   return <EnableButton />
  // }

  return (
    <Box>
      <Box mb="4px">
        <Text fontSize="12px" color="secondary" textTransform="uppercase" bold as="span">
          {t('deposit')}
        </Text>
        <Text fontSize="12px" ml="4px" color="textSubtle" textTransform="uppercase" bold as="span">
          {t('cake')}
        </Text>
      </Box>
      <InputPanel>
        <Container>
          <Text fontSize="14px" color="textSubtle" mb="12px" textAlign="right">
            {t('Balance: %balance%', { balance: '0' })}
          </Text>
          <Flex mb="6.5px">
            <NumericalInput
              style={{ textAlign: 'left' }}
              className="pottery-amount-input"
              value={value}
              onUserInput={(val) => setValue(val)}
            />
            <Flex ml="8px">
              <Button onClick={onMax} scale="xs" variant="secondary" style={{ alignSelf: 'center' }}>
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
              <LogoRoundIcon m="0 4px" width="24px" height="24px" />
              <Text>{t('Cake')}</Text>
            </Flex>
          </Flex>
        </Container>
      </InputPanel>
      <Flex>
        <Flex ml="auto">
          <Text fontSize="12px" color="textSubtle">
            {t('Deposited CAKE will be locked for 10 weeks')}
          </Text>
          <Flex ref={targetRef}>
            {tooltipVisible && tooltip}
            <HelpIcon ml="4px" width="20px" height="20px" color="textSubtle" />
          </Flex>{' '}
        </Flex>
      </Flex>
      <DepositButton />
    </Box>
  )
}

export default DepositAction
