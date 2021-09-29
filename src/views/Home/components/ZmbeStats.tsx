import React from 'react'
import { Card, CardBody, Heading, Text } from '@rug-zombie-libs/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from 'utils/formatBalance'
import { useTotalSupply, useBurnedBalance } from 'hooks/useTokenBalance'
import { useTranslation } from 'contexts/Localization'
import { getCakeAddress, getZombieAddress } from 'utils/addressHelpers'
import CardValue from './CardValue'
import { nfts, nftTotalSupply } from '../../../redux/get'

const StyledCakeStats = styled(Card)`
  margin-left: auto;
  margin-right: auto;
  box-shadow: rgb(204 246 108) 0px 0px 20px;
`

const Row = styled.div`
  align-items: center;
  display: flex;
  font-size: 14px;
  justify-content: space-between;
  margin-bottom: 8px;
`

const ZmbeStats = () => {
  const { t } = useTranslation()
  const totalSupply = useTotalSupply()
  const burnedBalance = getBalanceNumber(useBurnedBalance(getZombieAddress()))
  const zmbeSupply = totalSupply ? getBalanceNumber(totalSupply) - burnedBalance : 0

  return ( // TODO Set proper values for these cards
    <StyledCakeStats>
      <CardBody>
        <Heading size="xl" mb="24px">
          {t('Zombie Stats')}
        </Heading>
        <Row>
          <Text fontSize="14px">{t('Total ZMBE Supply')}</Text>
          {zmbeSupply && <CardValue fontSize="14px" value={zmbeSupply} />}
        </Row>
        <Row>
          <Text fontSize="14px">{t('Total ZMBE Burned')}</Text>
          <CardValue fontSize="14px" decimals={0} value={burnedBalance} />
        </Row>
        <Row>
          <Text fontSize="14px">{t('New ZMBE/block')}</Text>
          <CardValue fontSize="14px" decimals={0} value={20} />
        </Row>
        <Row>
          <Text fontSize="14px">{t('Total NFT\'s Minted')}</Text>
          <CardValue fontSize="14px" decimals={0} value={nftTotalSupply().toNumber()} />
        </Row>
      </CardBody>
    </StyledCakeStats>
  )
}

export default ZmbeStats
