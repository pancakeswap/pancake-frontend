import styled from 'styled-components'
import { useState, useCallback } from 'react'
import { Flex, Box, Card, Text, useMatchBreakpoints, Balance } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePriceCakeBusd } from 'state/farms/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { usePotteryData } from 'state/pottery/hook'
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

const BalanceStyle = styled(Balance)`
  padding: 0 2px;
  color: ${({ theme }) => theme.colors.secondary};
  background: #ffffff;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-stroke: 8px transparent;
  text-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2), 0px 4px 12px rgba(14, 14, 44, 0.1);
`

const Pot: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const cakePriceBusd = usePriceCakeBusd()
  const { isMobile } = useMatchBreakpoints()
  const { publicData } = usePotteryData()

  const [activeTab, setIndex] = useState<POT_CATEGORY>(POT_CATEGORY.Deposit)
  const handleClick = useCallback((tabType: POT_CATEGORY) => setIndex(tabType), [])

  const prizeInBusd = publicData.totalPrize.times(cakePriceBusd)
  const prizeTotal = getBalanceNumber(prizeInBusd)

  return (
    <PotteryContainer id="stake-to-win">
      <Flex width={['100%', '100%', '436px', '436px', '939px']} m="auto" flexDirection="column">
        <Text color="white" fontSize="32px" textAlign="center" bold>
          {t('Current Prize Pot')}
        </Text>
        <BalanceStyle
          bold
          mt="-10px"
          prefix="$"
          value={prizeTotal || 0}
          decimals={0}
          fontSize="40px"
          textAlign="center"
        />
        <Text color="white" mt="10px" fontSize="24px" textAlign="center" bold>
          {t('Stake to get your tickets NOW')}
        </Text>
        <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <Flex mt="48px" alignItems="flex-start">
            <Card style={{ width: isMobile ? '100%' : '436px' }}>
              <PotTab onItemClick={handleClick} activeIndex={activeTab} />
              <Box>
                <CardHeader
                  title={t('Pottery')}
                  subTitle={t('Stake CAKE, Earn CAKE, Win CAKE')}
                  primarySrc="/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.svg"
                  secondarySrc="/images/tokens/pot-icon.svg"
                />
                {activeTab === POT_CATEGORY.Deposit ? <Deposit /> : <Claim />}
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
