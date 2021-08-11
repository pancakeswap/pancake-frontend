import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import UnlockButton from 'components/UnlockButton'
import { Text, Heading, Card, CardHeader, CardBody, Button, BaseLayout } from '@ricefarm/uikitv2'
import Container from 'components/Layout/Container'

import { BASE_URL } from '../../config'
import useGetReferralData from '../../hooks/referrals/useGetReferralData'
import { convertToIcap } from '../../utils/referralHelpers'

const Cards = styled(BaseLayout)`
  align-items: stretch;
  justify-content: stretch;
  margin-bottom: 32px;

  & > div {
    grid-column: span 6;
    width: 100%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    & > div {
      grid-column: span 8;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    & > div {
      grid-column: span 6;
    }
  }
`

const Header = styled.div`
  padding: 32px 0px;
  background: ${({ theme }) => theme.colors.gradients.bubblegum};

  padding-left: 16px;
  padding-right: 16px;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const Referrals = () => {
  const referralData = useGetReferralData()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const COPY_TEXT = 'Copy'
  const COPIED_TEXT = 'Copied'
  const icapAddress = convertToIcap(account)

  const [buttonCopyText, setCopyButtonText] = useState(COPY_TEXT)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCopyButtonText(COPY_TEXT)
    }, 2000)
    return () => clearTimeout(timer)
  }, [buttonCopyText])

  if (!account) {
    return (
      <>
        <Header>
          <Heading as="h1" size="lg" textAlign="center" color="secondary" mb="24px">
            {t('RiceFarm Referral Program')}
          </Heading>
          <Heading size="md" textAlign="center" color="text">
            {t("Share the referral link below to invite your friends and earn 1% of your friends' earnings FOREVER!")}
          </Heading>
        </Header>
        <Container>
          <Card>
            <CardBody>
              <Text textAlign="center" mb="16px">
                <UnlockButton mx="auto" />
              </Text>
              <Text textAlign="center" bold fontSize="20px">
                Unlock wallet to get your unique referral link
              </Text>
            </CardBody>
          </Card>
        </Container>
      </>
    )
  }

  return (
    <>
      <Header>
        <Heading as="h1" scale="xl" textAlign="center" color="secondary" mb="24px">
          {t('RiceFarm Referral Program')}
        </Heading>
        <Heading scale="md" textAlign="center" color="text">
          {t("Share the referral link below to invite your friends and earn 1% of your friends' earnings FOREVER!")}
        </Heading>
      </Header>
      <Container>
        <Cards>
          <Card>
            <CardHeader>
              <Heading scale="lg" textAlign="center" color="secondary">
                {t(`Total Referrals`)}
              </Heading>
            </CardHeader>
            <CardBody>
              <Text textAlign="center" mb="16px">
                {referralData.totalReferrals ? referralData.totalReferrals : '-'}
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading scale="lg" textAlign="center" color="secondary">
                {t(`Total Referral Commission`)}
              </Heading>
            </CardHeader>
            <CardBody>
              <Text textAlign="center" mb="16px">
                {referralData.totalReferralCommissions
                  ? parseFloat(referralData.totalReferralCommissions).toLocaleString(undefined, {
                      minimumFractionDigits: 4,
                      maximumFractionDigits: 4,
                    })
                  : '-'}{' '}
                RICE
              </Text>
            </CardBody>
          </Card>
        </Cards>
        <Card>
          <CardHeader>
            <Heading scale="lg" textAlign="center" color="secondary">
              {t(`Your Referral Link`)}
            </Heading>
          </CardHeader>
          <CardBody>
            <Text textAlign="center" mb="16px">
              {`${BASE_URL}/?ref=${icapAddress}`}
              <br />
              <Button
                scale="sm"
                mt="12px"
                onClick={() => {
                  navigator.clipboard.writeText(`${BASE_URL}/?ref=${icapAddress}`)
                  setCopyButtonText(COPIED_TEXT)
                }}
              >
                {buttonCopyText}
              </Button>
            </Text>
          </CardBody>
        </Card>
        <br />
        <Text textAlign="center" color="text">
          *Referral link is for farming earnings only and not rice purchases. <br />
          **The 1% is not taken from your referrals, therefore no one loses any Rice. Everyone wins!
        </Text>
      </Container>
    </>
  )
}

export default Referrals
