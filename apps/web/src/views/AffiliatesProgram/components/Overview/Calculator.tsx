import { useMemo, useState } from 'react'
import { styled } from 'styled-components'
import { Flex, Text, Box, Button, ArrowDownIcon, Input, Balance } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'

const CalculatorWrapper = styled(Flex)`
  padding: 24px;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.default};
`

const EarnWrapper = styled(Box)`
  background: linear-gradient(180deg, #53dee9, #7645d9);
  padding: 1px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radii.default};
`

const EarnCardInner = styled(Box)`
  padding: 24px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

const referralList: Array<string> = ['100', '500', '1000', '2000', '5000']
const amountList: Array<string> = ['1000', '5000', '10000', '20000', '50000']

const Calculator = () => {
  const { t } = useTranslation()
  const [referral, setReferral] = useState('2000')
  const [volume, setVolume] = useState('20000')

  const defaultAmount = (amount: BigNumber) => (amount.gt(0) ? amount.toFixed(0) : '1')

  const totalPerMonth = useMemo(
    () => new BigNumber(referral).times(volume).times(0.03).times(0.0025).toNumber(),
    [referral, volume],
  )

  return (
    <Box
      id="calculate"
      width={['100%', '100%', '375px', 'auto']}
      m={['64px auto', '64px auto', '64px auto', '64px auto', '0 0 0 48px']}
    >
      <Text mb="24px" color="secondary" fontSize={['20px']} bold>
        {t('Rewards calculator')}
      </Text>
      <CalculatorWrapper>
        <Flex flexDirection="column">
          <Text mb="8px" color="secondary" textTransform="uppercase" fontSize="12px" bold>
            {t('number of referrals')}
          </Text>
          <Input
            min="1"
            placeholder="0"
            inputMode="decimal"
            value={referral}
            style={{ textAlign: 'right' }}
            onChange={(e) => setReferral(defaultAmount(new BigNumber(e.currentTarget.value)))}
          />
          <Flex justifyContent="space-between" mt="8px">
            {referralList.map((list) => (
              <Button
                key={list}
                scale="xs"
                mr="4px"
                p="4px 16px"
                width={`${100 / referralList.length}%`}
                variant={list === referral ? 'primary' : 'tertiary'}
                onClick={() => setReferral(list)}
              >
                {list}
              </Button>
            ))}
          </Flex>
        </Flex>
        <Flex flexDirection="column" mt="28px">
          <Text mb="8px" color="secondary" textTransform="uppercase" fontSize="12px" bold>
            {t('Volume per user per month')}
          </Text>
          <Input
            min="1"
            placeholder="0"
            inputMode="decimal"
            value={volume}
            style={{ textAlign: 'right' }}
            onChange={(e) => setVolume(defaultAmount(new BigNumber(e.currentTarget.value)))}
          />
          <Flex justifyContent="space-between" mt="8px">
            {amountList.map((amount) => (
              <Button
                key={amount}
                scale="xs"
                mr="4px"
                p="4px 8px"
                width={`${100 / amountList.length}%`}
                variant={amount === volume ? 'primary' : 'tertiary'}
                onClick={() => setVolume(amount)}
              >
                {Number(amount).toLocaleString('en', { maximumFractionDigits: 0 })}
              </Button>
            ))}
          </Flex>
        </Flex>
        <ArrowDownIcon margin={['28px 0']} width="24px" height="24px" color="textSubtle" />
        <EarnWrapper>
          <EarnCardInner>
            <Text color="secondary" textTransform="uppercase" fontSize="12px" bold>
              {t('affiliate commissions per month')}
            </Text>
            <Balance bold prefix="$ " fontSize="24px" decimals={0} value={totalPerMonth} />
          </EarnCardInner>
        </EarnWrapper>
      </CalculatorWrapper>
    </Box>
  )
}

export default Calculator
