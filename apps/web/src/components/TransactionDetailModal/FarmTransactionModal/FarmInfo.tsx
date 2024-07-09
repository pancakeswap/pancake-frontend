import { useTranslation } from '@pancakeswap/localization'
import { Box, Flex, LightBulbIcon, StyledLink, Text, useTooltip } from '@pancakeswap/uikit'
import { FarmTransactionStatus, CrossChainFarmStepType } from 'state/transactions/actions'
import { TransactionDetails } from 'state/transactions/reducer'
import { styled } from 'styled-components'
import NextLink from 'next/link'

const ListStyle = styled.div`
  position: relative;
  margin-bottom: 4px;
  padding-left: 8px;
  &:before {
    content: '';
    position: absolute;
    top: 8px;
    left: 0px;
    width: 4px;
    height: 4px;
    background-color: white;
    border-radius: 50%;
  }
  &:last-child {
    margin-bottom: 0px;
  }
`

const LinkStyle = styled(StyledLink)`
  display: inline-block;
  margin: 0 4px;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: underline;
`

interface FarmInfoProps {
  pickedData?: TransactionDetails
}

const FarmPending: React.FC<React.PropsWithChildren<FarmInfoProps>> = ({ pickedData }) => {
  const { t } = useTranslation()

  if (!pickedData?.crossChainFarm) {
    return null
  }

  const { amount, lpSymbol, type } = pickedData.crossChainFarm
  const title = type === CrossChainFarmStepType.STAKE ? t('Staking') : t('Unstaking')

  return (
    <Box mb="24px">
      <Box>
        <Text as="span">{title}</Text>
        <Text bold as="span" m="0 4px">
          {`${amount} ${lpSymbol}`}
        </Text>
        <Text as="span">{t('in progress..')}</Text>
      </Box>
      <Text as="span">{t('It might take around 30 minutes for the cross-chain tx to confirm.')}</Text>
    </Box>
  )
}

const FarmResult: React.FC<React.PropsWithChildren<FarmInfoProps>> = ({ pickedData }) => {
  const { t } = useTranslation()
  const { amount, lpSymbol, type, steps } = pickedData?.crossChainFarm ?? {}
  const firstStep = steps?.find((step) => step.step === 1)
  const text =
    type === CrossChainFarmStepType.STAKE ? t('token have been staked in the Farm!') : t('token have been unstaked!')

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <Flex flexDirection="column">
      <ListStyle>{t('You have received 0.0005 BNB as a first-time BNB Smart Chain user')}</ListStyle>
      <ListStyle>
        {t('You can swap more BNB on')}
        <NextLink href="/swap">
          <LinkStyle>{t('Swap.')}</LinkStyle>
        </NextLink>
      </ListStyle>
      <ListStyle>
        {t('Explore more features like')}
        <NextLink href="/pools?chain=bsc">
          <LinkStyle>{t('Pools')}</LinkStyle>
        </NextLink>
        {t('and')}
        <NextLink href="/prediction?chain=bsc">
          <LinkStyle>{t('Win')}</LinkStyle>
        </NextLink>
        {t('with your CAKE earned.')}
      </ListStyle>
    </Flex>,
    { placement: 'top' },
  )

  if (!pickedData?.crossChainFarm) {
    return null
  }

  return (
    <Box mb="24px">
      <Box>
        <Text bold as="span">
          {`${amount} ${lpSymbol}`}
        </Text>
        <Text ml="4px" as="span">
          {text}
        </Text>
      </Box>
      {firstStep?.isFirstTime && (
        <Box mt="24px">
          <Flex>
            <Box display="inline-flex">
              <Text bold as="span">
                0.005 BNB
              </Text>
              {tooltipVisible && tooltip}
              <Box m="0 4px" ref={targetRef}>
                <LightBulbIcon color="primary" />
              </Box>
              <Text as="span">{t('have been')}</Text>
            </Box>
          </Flex>
          <Text>{t('earned to your Wallet!')}</Text>
        </Box>
      )}
    </Box>
  )
}

const FarmError: React.FC<React.PropsWithChildren<FarmInfoProps>> = ({ pickedData }) => {
  const { t } = useTranslation()

  if (!pickedData?.crossChainFarm) {
    return null
  }

  const { amount, lpSymbol, type, steps } = pickedData.crossChainFarm
  const text = type === CrossChainFarmStepType.STAKE ? t('The attempt to stake') : t('The attempt to unstake')
  const errorText = type === CrossChainFarmStepType.STAKE ? t('Token fail to stake.') : t('Token fail to unstake.')
  const isFirstStepError = steps.find((step) => step.step === 1 && step.status === FarmTransactionStatus.FAIL)

  return (
    <Box mb="24px">
      {isFirstStepError ? (
        <Box>
          <Text bold as="span">
            {`${amount} ${lpSymbol}`}
          </Text>
          <Text as="span" ml="4px">
            {errorText}
          </Text>
        </Box>
      ) : (
        <Box>
          <Text as="span">{text}</Text>
          <Text bold as="span" m="0 4px">
            {`${amount} ${lpSymbol}`}
          </Text>
          <Text as="span">{t('did not succeed on the BNB Chain side. Please copy the')}</Text>
          <Text bold as="span" m="0 4px">
            {t('Transaction ID')}
          </Text>
          <Text as="span">{t('below and look for assistance from our helpful Community Admins or Chefs.')}</Text>
        </Box>
      )}
    </Box>
  )
}

const FarmInfo: React.FC<React.PropsWithChildren<FarmInfoProps>> = ({ pickedData }) => {
  const { status } = pickedData?.crossChainFarm ?? {}
  if (status === FarmTransactionStatus.FAIL) {
    return <FarmError pickedData={pickedData} />
  }

  if (status === FarmTransactionStatus.PENDING) {
    return <FarmPending pickedData={pickedData} />
  }

  return <FarmResult pickedData={pickedData} />
}

export default FarmInfo
