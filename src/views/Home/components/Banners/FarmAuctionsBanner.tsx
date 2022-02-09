import styled from 'styled-components'
import { Text, Flex, Button, ArrowForwardIcon, Heading } from '@pancakeswap/uikit'
import { NextLinkFromReactRouter } from 'components/NextLink'
import { useTranslation } from 'contexts/Localization'

const StyledSubheading = styled(Heading)`
  background: -webkit-linear-gradient(#ffd800, #eb8c00);
  font-size: 20px;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1px rgba(0, 0, 0, 0.5);
  ${({ theme }) => theme.mediaQueries.xs} {
    font-size: 24px;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    -webkit-text-stroke: unset;
  }
  margin-bottom: 8px;
`

const StyledHeading = styled(Heading)`
  color: #ffffff;
  background: -webkit-linear-gradient(#7645d9 0%, #452a7a 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 6px transparent;
  text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  margin-bottom: 16px;
`

const Wrapper = styled.div`
  border-radius: 32px;
  width: 100%;
  background-image: linear-gradient(#7645d9, #452a7a);
  max-height: max-content;
  overflow: hidden;
`

const Inner = styled(Flex)`
  position: relative;
  padding: 24px;
  flex-direction: row;
  justify-content: space-between;
  max-height: 220px;
`

const LeftWrapper = styled(Flex)`
  z-index: 1;
  width: 100%;
  flex-direction: column;
  justify-content: center;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 40px;
    padding-bottom: 40px;
  }
`

const RightWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 24px;
  opacity: 0.9;

  & img {
    height: 186px; // 200px for normal bunny, 186px for gaming bunny
  }

  ${({ theme }) => theme.mediaQueries.md} {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    opacity: 1;

    & img {
      height: 100%; // 100% for normal bunny, 130% for gaming bunny
    }
  }
`

const FarmAuctionsBanner = () => {
  const { t } = useTranslation()

  return (
    <Wrapper>
      <Inner>
        <LeftWrapper>
          <StyledSubheading>{t('%num% Contenders...', { num: 16 })}</StyledSubheading>
          <StyledHeading scale="xl">{t('%num% Winners', { num: 3 })}</StyledHeading>
          <NextLinkFromReactRouter to="/farms/auction">
            <Button>
              <Text color="invertedContrast" bold fontSize="16px" mr="4px">
                {t('Farm Auctions')}
              </Text>
              <ArrowForwardIcon color="invertedContrast" />
            </Button>
          </NextLinkFromReactRouter>
        </LeftWrapper>
        <RightWrapper>
          <img src="/images/decorations/auction-bunny.png" alt={t('auction bunny')} />
        </RightWrapper>
      </Inner>
    </Wrapper>
  )
}

export default FarmAuctionsBanner
