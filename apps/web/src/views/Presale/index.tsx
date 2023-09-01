import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { isAddress } from 'utils'
import { useAchievementsForAddress, useProfileForAddress } from 'state/profile/hooks'
import { Flex, Text, LogoIcon, TextLogo } from '@pancakeswap/uikit'
import Page from 'components/Layout/Page'
import { useTranslation } from '@pancakeswap/localization'
import styled from 'styled-components'
// import MarketPageHeader from '../Nft/market/components/MarketPageHeader'
// import { useNftsForAddress } from '../Nft/market/hooks/useNftsForAddress'
import { vars } from '@pancakeswap/ui/css/vars.css'
import { Lalezar, Rubik } from 'next/font/google'
import LogoImage from '../../assets/logo.png'
import ProgressBar from './components/ProgressBar'
import ClameReward from './components/ClaimReward'

const lalezar = Lalezar({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

const rubik = Rubik({
  weight: '600',
  subsets: ['latin'],
  display: 'swap',
})

const Wrapper = styled(Flex)`
  max-width: 1600px;
  padding: 0 40px;
  margin: auto;
  flex-direction: row;
  @media (max-width: 900px) {
    flex-direction: column;
  }
  @media (max-width: 576px) {
    padding: 0 10px;
  }
`
const Container = styled(Flex)`
  background-color: rgba(158, 172, 208, 0.3);
  border-radius: 30px;
  padding: 20px 30px;
  width: 60%;
  @media (max-width: 900px) {
    width: 100%;
    margin-bottom: 30px;
  }
`

const StyledRightContainer = styled(Flex)`
  border-radius: 30px;
  padding: 0;
  width: 40%;
  margin-left: 40px;
  @media (max-width: 900px) {
    width: 100%;
    margin-bottom: 30px;
    margin-left: 0;
  }
`

const StyledPoolStatus = styled(Flex)`
  background-color: rgba(158, 172, 208, 0.3);
  width: 100%;
  padding: 20px 30px;
  border-radius: 30px;
`

const StyledTextLogo = styled.span`
  color: ${vars.colors.white};
  width: 100%;
  font-size: 19px;
  padding-bottom: 10px;
  border-bottom: 1px solid #9eacd04d;
  margin-top: 10px;
  & > span:nth-child(1) {
    color: #2d98fb;
  }
  display: flex;
  justify-content: center;

  @media (max-width: 576px) {
    width: 100%;
    text-align: center;
    margin-bottom: 30px;
  }
`

const StyledPresaleInfo = styled(Flex)`
  border-bottom: 1px solid #9eacd04d;
  margin-top: 20px;
`

const StyledDescription = styled(Text)`
  padding: 30px;
  font-size: 25px;
  text-align: center;
  border-bottom: 1px solid #9eacd04d;
  margin-bottom: 10px;
  @media (max-width: 576px) {
    font-size: 16px;
    padding: 15px;
  }
`

const StyledTextLogoImage = styled(TextLogo)`
  width: 176px;
  height: 30px;
  @media (max-width: 576px) {
    width: 100px;
    height: 25px;
  }
`

const PresaleContainer: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  const accountAddress = useRouter().query.accountAddress as string
  const { t } = useTranslation()
  const [percent, setPercent] = useState(30)

  return (
    <Wrapper>
      <Container flexDirection="column" width="60%">
        <LogoIcon width={86} />
        <StyledTextLogo>
          <StyledTextLogoImage marginBottom="8px" marginRight="15px" />
          <Text
            className={lalezar.className}
            style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}
            fontSize={['18px', null, '30px']}
          >
            FINANCE
          </Text>
        </StyledTextLogo>
        <StyledDescription className={lalezar.className}>
          Lorem ipsum is placeholder text commonly used in the graphic, print, and publishing industries for previewing
          layouts and visual mockups.
        </StyledDescription>
        <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            Launch Time
          </Text>
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            Aug 16, 2:00 PM (EDT)
          </Text>
        </StyledPresaleInfo>
        <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            Hardcap
          </Text>
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            150,000 BNB
          </Text>
        </StyledPresaleInfo>
        <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            Token Price
          </Text>
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            1.5 BNB
          </Text>
        </StyledPresaleInfo>
        <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            Min Buy
          </Text>
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            1 BNB
          </Text>
        </StyledPresaleInfo>
        <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            Max Buy
          </Text>
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            5,000 BNB
          </Text>
        </StyledPresaleInfo>
        <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            Total raised (% of target)
          </Text>
          <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
            0 BNB (0.00%)
          </Text>
        </StyledPresaleInfo>
      </Container>
      <StyledRightContainer
        width="40%"
        flexDirection="column"
        style={{ display: 'grid', gridTemplateRows: 'auto 1fr' }}
      >
        <StyledPoolStatus flexDirection="column" marginBottom="30px">
          <Text className={lalezar.className} fontSize={['16px', null, '30px']}>
            This pool Has ended.
          </Text>
          <ProgressBar completed={percent} />
          <Flex flexDirection="row" justifyContent="space-between" marginTop="10px">
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              0 BNB
            </Text>
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              150000 BUSD
            </Text>
          </Flex>
          <Text className={lalezar.className} fontSize="12px" color="#A5A5A5">
            Your contribution (BUSD)
          </Text>
          <ClameReward amount={20} />
        </StyledPoolStatus>
        <StyledPoolStatus flexDirection="column">
          <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              Status
            </Text>
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              ended
            </Text>
          </StyledPresaleInfo>
          <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              Sale type
            </Text>
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              Private
            </Text>
          </StyledPresaleInfo>
          <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              Minimum Buy
            </Text>
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              1 BNB
            </Text>
          </StyledPresaleInfo>
          <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              Maximum Buy
            </Text>
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              5,000 BNB
            </Text>
          </StyledPresaleInfo>
          <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              Total Contributors
            </Text>
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              0
            </Text>
          </StyledPresaleInfo>
          <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              You Purcased
            </Text>
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              0.00
            </Text>
          </StyledPresaleInfo>
          <StyledPresaleInfo flexDirection="row" justifyContent="space-between">
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              Total Tokens Bought
            </Text>
            <Text className={lalezar.className} fontSize={['14px', null, '22px']}>
              0
            </Text>
          </StyledPresaleInfo>
        </StyledPoolStatus>
      </StyledRightContainer>
    </Wrapper>
  )
}

export default PresaleContainer
