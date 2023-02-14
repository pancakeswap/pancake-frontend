import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { Flex, Text, Box, Button, ArrowDownIcon, Input, Balance } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'

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

const referralList: Array<string> = ['15', '25', '35', '50', '100']
const amountList: Array<string> = ['1000', '3000', '5000', '10000', '20000']

const Calculator = () => {
  const [referral, setReferral] = useState('50')
  const [volume, setVolume] = useState('5000')

  const defaultAmount = (amount: BigNumber) => (amount.gt(0) ? amount.toFixed(0) : '1')

  const totalPerMonth = useMemo(
    () => new BigNumber(referral).times(0.25).times(volume).times(3).toNumber(),
    [referral, volume],
  )

  return (
    <Box
      width={['100%', '100%', '375px', 'auto']}
      m={['64px auto', '64px auto', '64px auto', '64px auto', '0 0 0 48px']}
    >
      <Text mb="24px" color="secondary" fontSize={['20px']} bold>
        Rewards calculator
      </Text>
      <CalculatorWrapper>
        <Flex flexDirection="column">
          <Text mb="8px" color="secondary" textTransform="uppercase" fontSize="12px" bold>
            number of referrals
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
            volume per month
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
              affiliate fees per month
            </Text>
            <Balance bold prefix="$ " fontSize="24px" decimals={0} value={totalPerMonth} />
          </EarnCardInner>
        </EarnWrapper>
      </CalculatorWrapper>
    </Box>
  )
}

export default Calculator
