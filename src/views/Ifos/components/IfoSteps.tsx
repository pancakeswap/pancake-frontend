import React from 'react'
import styled from 'styled-components'
import every from 'lodash/every'
import { Stepper, Step, StepStatus, Card, CardBody, Heading, Text, Button, Link, OpenNewIcon } from '@ricefarm/uikitv2'
import { BASE_ADD_LIQUIDITY_URL, BASE_V1_ADD_LIQUIDITY_URL } from 'config'
import { Ifo } from 'config/constants/types'
import { WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from 'contexts/Localization'
import useTokenBalance from 'hooks/useTokenBalance'
import Container from 'components/Layout/Container'
import { useProfile } from 'state/profile/hooks'
import { getAddress } from 'utils/addressHelpers'

interface Props {
  ifo: Ifo
  walletIfoData: WalletIfoData
}

const Wrapper = styled(Container)`
  background: ${({ theme }) => theme.colors.gradients.bubblegum};
  margin-left: -16px;
  margin-right: -16px;
  padding-top: 48px;
  padding-bottom: 48px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: -24px;
    margin-right: -24px;
  }
`

const IfoSteps: React.FC<Props> = ({ ifo, walletIfoData }) => {
  const { poolBasic, poolUnlimited } = walletIfoData
  const { hasProfile } = useProfile()
  const { t } = useTranslation()
  const { balance } = useTokenBalance(getAddress(ifo.currency.address))
  const stepsValidationStatus = [
    hasProfile,
    balance.isGreaterThan(0),
    poolBasic.amountTokenCommittedInLP.isGreaterThan(0) || poolUnlimited.amountTokenCommittedInLP.isGreaterThan(0),
    poolBasic.hasClaimed || poolUnlimited.hasClaimed,
  ]

  const getStatusProp = (index: number): StepStatus => {
    const arePreviousValid = index === 0 ? true : every(stepsValidationStatus.slice(0, index), Boolean)
    if (stepsValidationStatus[index]) {
      return arePreviousValid ? 'past' : 'future'
    }
    return arePreviousValid ? 'current' : 'future'
  }

  const renderCardBody = (step: number) => {
    const isStepValid = stepsValidationStatus[step]
    switch (step) {
      case 0:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Get TeslaSafe-BNB LP Tokens')}
            </Heading>
            <Text color="textSubtle" small>
              {t('Stake TeslaSafe and BNB in the liquidity pool to get LP tokens.')} <br />
              {t('You’ll spend them to buy IFO sale tokens.')}
            </Text>
            <Button
              as={Link}
              external
              href={`${BASE_V1_ADD_LIQUIDITY_URL}/BNB/0x3504de9e61FDFf2Fc70f5cC8a6D1Ee493434C1Aa`}
              endIcon={<OpenNewIcon color="white" />}
              mt="16px"
            >
              {t('Get TS-BNB LP tokens')}
            </Button>
          </CardBody>
        )
      case 1:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Get RICE-BNB LP Tokens')}
            </Heading>
            <Text color="textSubtle" small>
              {t('Stake RICE and BNB in the liquidity pool to get LP tokens.')} <br />
              {t('You’ll spend them to buy IFO sale tokens.')}
            </Text>
            <Button
              as={Link}
              external
              href={`${BASE_ADD_LIQUIDITY_URL}/BNB/0xC4eEFF5aab678C3FF32362D80946A3f5De4a1861`}
              endIcon={<OpenNewIcon color="white" />}
              mt="16px"
            >
              {t('Get RICE-BNB LP tokens')}
            </Button>
          </CardBody>
        )
      case 2:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Commit LP Tokens')}
            </Heading>
            <Text color="textSubtle" small>
              {t('When the IFO sales are live, you can “commit” your LP tokens to buy the tokens being sold.')} <br />
              {t('We recommend committing to both TeslaSafe and Rice Sales, but you can also do just one sale.')}
            </Text>
          </CardBody>
        )
      case 3:
        return (
          <CardBody>
            <Heading as="h4" color="secondary" mb="16px">
              {t('Claim your tokens')}
            </Heading>
            <Text color="textSubtle" small>
              {t(
                'After the IFO sales finish, you can claim any IFO tokens that you bought, and any unspent RICE-BNB LP tokens will be returned to your wallet.',
              )}
            </Text>
          </CardBody>
        )
      default:
        return null
    }
  }

  return (
    <Wrapper>
      <Heading as="h2" scale="xl" color="secondary" mb="24px" textAlign="center">
        {t('How to Take Part')}
      </Heading>
      <Stepper>
        {stepsValidationStatus.map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Step key={index} index={index} status={getStatusProp(index)}>
            <Card>{renderCardBody(index)}</Card>
          </Step>
        ))}
      </Stepper>
    </Wrapper>
  )
}

export default IfoSteps
