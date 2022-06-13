import styled from 'styled-components'
import { Flex, Box, Button, Text, HelpIcon, useTooltip } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
`

const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
`

const Container = styled.div`
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme }) => theme.shadows.inset};
`

const DepositAction: React.FC = () => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Fake Text'), {
    placement: 'bottom',
  })

  // if (true) {
  //   return <Button>{t('Enable')}</Button>
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
        <Container as="label">
          <LabelRow>
            {/* <NumericalInput
              className="pottery-amount-input"
              value={value}
              onUserInput={(val) => {
                onUserInput(val)
              }}
            /> */}
          </LabelRow>
          {/* <InputRow selected={disableCurrencySelect}>
            {account && currency && showMaxButton && label !== 'To' && (
              <Button onClick={onMax} scale="xs" variant="secondary">
                {t('Max').toLocaleUpperCase(locale)}
              </Button>
            )}
          </InputRow> */}
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
      <Button width="100%" mt="10px">
        {t('Deposit CAKE')}
      </Button>
    </Box>
  )
}

export default DepositAction
