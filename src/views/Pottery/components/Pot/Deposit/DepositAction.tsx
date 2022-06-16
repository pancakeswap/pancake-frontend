import styled from 'styled-components'
import { useState, useMemo } from 'react'
import { Flex, Box, Button, Text, HelpIcon, useTooltip, LogoRoundIcon } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { DeserializedPotteryUserData } from 'state/types'
import { Input as NumericalInput } from 'components/CurrencyInputPanel/NumericalInput'
import tokens from 'config/constants/tokens'
import useTokenBalance from 'hooks/useTokenBalance'
import { getFullDisplayBalance } from 'utils/formatBalance'
import { useUserEnoughCakeValidator } from 'views/Pools/components/LockedPool/hooks/useUserEnoughCakeValidator'
import { BIG_TEN } from 'utils/bigNumber'
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

interface DepositActionProps {
  userData: DeserializedPotteryUserData
}

const DepositAction: React.FC<DepositActionProps> = ({ userData }) => {
  const { t } = useTranslation()
  const [depositAmount, setDepositAmount] = useState('')

  const { balance: userCake } = useTokenBalance(tokens.cake.address)
  const userCakeDisplayBalance = getFullDisplayBalance(userCake, 18, 3)
  const { userNotEnoughCake, notEnoughErrorMessage } = useUserEnoughCakeValidator(depositAmount, userCake)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'CAKE deposit will be diverted to the fixed-term staking pool. Please note that CAKE deposited can ONLY be withdrawn after 10 weeks.',
    ),
    {
      placement: 'bottom',
    },
  )

  const onClickMax = () => {
    setDepositAmount(userCake.dividedBy(BIG_TEN.pow(18)).toString())
  }

  const showMaxButton = useMemo(
    () => new BigNumber(depositAmount).multipliedBy(BIG_TEN.pow(18)).eq(userCake),
    [depositAmount, userCake],
  )

  if (userData.allowance.eq(0)) {
    return <EnableButton />
  }

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
            {t('Balance: %balance%', { balance: userCakeDisplayBalance })}
          </Text>
          <Flex mb="6.5px">
            <NumericalInput
              style={{ textAlign: 'left' }}
              className="pottery-amount-input"
              value={depositAmount}
              onUserInput={(val) => setDepositAmount(val)}
            />
            <Flex ml="8px">
              {!showMaxButton && (
                <Button onClick={onClickMax} scale="xs" variant="secondary" style={{ alignSelf: 'center' }}>
                  {t('Max').toUpperCase()}
                </Button>
              )}
              <LogoRoundIcon m="0 4px" width="24px" height="24px" />
              <Text textTransform="uppercase">{t('Cake')}</Text>
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
      {userNotEnoughCake ? (
        <Button disabled mt="10px" width="100%">
          {notEnoughErrorMessage}
        </Button>
      ) : (
        <DepositButton depositAmount={depositAmount} />
      )}
    </Box>
  )
}

export default DepositAction
