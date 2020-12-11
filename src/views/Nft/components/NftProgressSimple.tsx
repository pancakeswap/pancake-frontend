import React, { useContext } from 'react'
import { Card, CardBody, Text } from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { NftProviderContext } from '../contexts/NftProvider'
import InfoRow from './InfoRow'

const NftProgressSimple = () => {
  const TranslateString = useI18n()
  const { isInitialized, currentDistributedSupply, totalSupplyDistributed, countBunniesBurnt } = useContext(
    NftProviderContext,
  )

  return (
    <Card>
      <CardBody>
        <InfoRow>
          <Text>{TranslateString(999, "Total NFT's claimed")}:</Text>
          <Text>
            <strong>{!isInitialized ? '...' : `${currentDistributedSupply}/${totalSupplyDistributed}`}</strong>
          </Text>
        </InfoRow>
        <InfoRow>
          <Text>{TranslateString(999, "Total NFT's burned")}:</Text>
          <Text>
            <strong>{!isInitialized ? '...' : `${countBunniesBurnt}/${totalSupplyDistributed}`}</strong>
          </Text>
        </InfoRow>
      </CardBody>
    </Card>
  )
}

export default NftProgressSimple
