import styled from 'styled-components'
import { useState, useCallback, useMemo } from 'react'
import { Flex, Box, Card, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { OutlineText } from 'views/Pottery/components/TextStyle'
import BigNumber from 'bignumber.js'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { DeserializedPotteryUserData } from 'state/types'
import PotTab from './PotTab'
import Deposit from './Deposit/index'
import Claim from './Claim/index'
import CardHeader from './CardHeader'
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
  background: url(/images/pottery/honeypot.png);
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

interface PotProps {
  userData: DeserializedPotteryUserData
}

const Pot: React.FC<PotProps> = ({ userData }) => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeBusd()
  const { isMobile } = useMatchBreakpoints()

  const [activeTab, setIndex] = useState<POT_CATEGORY>(POT_CATEGORY.Deposit)
  const handleClick = useCallback((tabType: POT_CATEGORY) => setIndex(tabType), [])

  // TODO: Pottery
  const prizeInBusd = new BigNumber(300000000000000000000000).times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(prizeInBusd)
  const prizeDisplay = useMemo(
    () => `$${prizeTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
    [prizeTotal],
  )

  return (
    <PotteryContainer id="stake-to-win">
      <Flex width={['100%', '100%', '436px', '436px', '939px']} m="auto" flexDirection="column">
        <Text color="white" fontSize="32px" textAlign="center" bold>
          {t('Current Prize Pot')}
        </Text>
        <OutlineText mt="-10px" fontSize="40px" bold textAlign="center">
          {prizeDisplay}
        </OutlineText>
        <Text color="white" mt="10px" fontSize="24px" textAlign="center" bold>
          {t('Stake to get your tickets NOW')}
        </Text>
        <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <Flex mt="48px" alignItems="flex-start">
            <Card style={{ width: isMobile ? '100%' : '436px' }}>
              <PotTab onItemClick={handleClick} activeIndex={activeTab} />
              <Box>
                <CardHeader
                  title="Pottery"
                  subTitle="Stake CAKE, Earn CAKE, Win CAKE"
                  primarySrc="/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg"
                  secondarySrc="/images/tokens/pot-icon.svg"
                />
                {activeTab === POT_CATEGORY.Deposit ? <Deposit userData={userData} /> : <Claim />}
              </Box>
            </Card>
          </Flex>
          <PotImage />
        </Flex>
      </Flex>
    </PotteryContainer>
  )
}

export default Pot
