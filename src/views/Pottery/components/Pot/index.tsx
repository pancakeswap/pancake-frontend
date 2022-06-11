import styled from 'styled-components'
import { useState, useCallback } from 'react'
import { Flex, Box, Card, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { OutlineText } from 'views/Pottery/components/TextStyle'
import PotTab from './PotTab'
import Deposit from './Deposit/index'
import Claim from './Claim/index'
import { POT_CATEGORY } from '../../types'

const PotteryContainer = styled(Box)`
  position: relative;
  padding: 44px 16px 56px 16px;
  background: radial-gradient(51.67% 114.22% at 51.67% 49.78%, #6e42bc 0%, #a881fc 100%);

  &:: before {
    content: '';
    width: 100%;
    height: 48px;
    position: absolute;
    top: -48px;
    left: 0;
    z-index: 1;
    clip-path: polygon(0 0%, 0% 100%, 100% 100%);
    background: linear-gradient(
      90deg,
      rgba(168, 129, 252, 1) 0%,
      rgb(160 121 244) 15%,
      rgb(145 104 226) 30%,
      rgb(136 95 216) 45%,
      rgb(139 98 219) 65%,
      rgb(148 108 230) 80%,
      rgba(168, 129, 252, 1) 100%
    );
  }
`

const PotImage = styled.div`
  width: 260px;
  height: 228.77px;
  align-self: center;
  background: url(/images/syruppot/honeypot.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  margin-top: 48px;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 412px;
    height: 362.52px;
    margin-top: 0;
  }
`

const Pot: React.FC = () => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const [activeTab, setIndex] = useState<POT_CATEGORY>(POT_CATEGORY.Deposit)
  const handleClick = useCallback((tabType: POT_CATEGORY) => setIndex(tabType), [])

  return (
    <PotteryContainer id="stake-to-win">
      <Flex width={['100%', '100%', '436px', '436px', '939px']} m="auto" flexDirection="column">
        <Text color="white" fontSize="32px" textAlign="center" bold>
          {t('Current Prize Pot')}
        </Text>
        <OutlineText mt="-10px" fontSize="40px" bold textAlign="center">
          $24,232,232
        </OutlineText>
        <Text color="white" mt="10px" fontSize="24px" textAlign="center" bold>
          {t('Stake to get your tickets NOW')}
        </Text>
        <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <Flex mt="48px" alignItems="flex-start">
            <Card style={{ width: isMobile ? '100%' : '436px' }}>
              <PotTab onItemClick={handleClick} activeIndex={activeTab} />
              {activeTab === POT_CATEGORY.Deposit ? <Deposit /> : <Claim />}
            </Card>
          </Flex>
          <PotImage />
        </Flex>
      </Flex>
    </PotteryContainer>
  )
}

export default Pot
