import { useTranslation } from '@pancakeswap/localization'
import { Flex, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import Image from 'next/legacy/image'
import styled from 'styled-components'
import useSWRImmutable from 'swr/immutable'
import aptosBallRocket from '../../images/aptos-ball-rocket.png'
import bnbBallRocket from '../../images/bnb-ball-rocket.png'
import ethBallRocket from '../../images/eth-ball-rocket.png'
import { ChainTags } from './ChainTags'
import { MetricsCard } from './MetricsCard'

const ImageLayer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  overflow: hidden;
`
const BnbBallRocket = styled.div`
  position: absolute;
  bottom: 151px;
  left: calc(50% - 72px - 650px);
`
const EthBallRocket = styled.div`
  position: absolute;
  right: 0;
  bottom: -30px;
`

const AptosBallRocket = styled.div`
  position: absolute;
  top: 75px;
  left: calc(50% - 42px + 520px);
`

const Stats = () => {
  const { t } = useTranslation()
  const { data: tvl } = useSWRImmutable('tvl')
  const { data: txCount } = useSWRImmutable('totalTx30Days')
  const { data: addressCount } = useSWRImmutable('addressCount30Days')
  const { isMobile } = useMatchBreakpoints()

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column" overflow="hidden">
      {/* <GradientLogo height="48px" width="48px" mb="24px" /> */}
      <Text textAlign="center" fontWeight={600} fontSize={isMobile ? '20px' : '32px'}>
        {t('Shaping the Future of Decentralized Trading:')}
      </Text>
      <Text textAlign="center" fontWeight={600} fontSize={isMobile ? '20px' : '32px'} mb="32px">
        {t(' PancakeSwap’s Unstoppable Expansion')}
      </Text>
      <Flex
        justifyContent="center"
        alignItems="center"
        flexDirection={isMobile ? 'column' : 'row'}
        width={['100%', '100%', '100%', '800px']}
        style={{ gap: isMobile ? 32 : 50 }}
      >
        <MetricsCard title={t('Total Users:')} value={addressCount} description={t('in the last 30 days')} />
        <MetricsCard title={t('Total Trading Volume:')} value={txCount} description={t('in the last 30 days')} />
        <MetricsCard title={t('Total Value Locked:')} value={tvl} description={t('in the last 30 days')} />
      </Flex>
      <ChainTags />
      <ImageLayer style={{ display: isMobile ? 'none' : 'block' }}>
        <BnbBallRocket>
          <Image src={bnbBallRocket} alt="bnbBallRocket" width={144} height={168} placeholder="blur" />
        </BnbBallRocket>
        <EthBallRocket>
          <Image src={ethBallRocket} alt="ethBallRocket" width={116} height={230} placeholder="blur" />
        </EthBallRocket>
        <AptosBallRocket>
          <Image src={aptosBallRocket} alt="aptosBallRocket" width={84} height={101} placeholder="blur" />
        </AptosBallRocket>
      </ImageLayer>
    </Flex>
  )
}

export default Stats
