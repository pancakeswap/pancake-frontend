import React from 'react'
import { Nft } from 'config/constants/types'
import { Text } from '@pancakeswap-libs/uikit'
import SelectionCard from './SelectionCard'

interface NftSelectionCardProps {
  isChecked?: boolean
  nft: Nft
}

const NftSelectionCard: React.FC<NftSelectionCardProps> = ({ nft, isChecked = false }) => {
  const handleChange = () => true

  return (
    <SelectionCard
      name="nft"
      value={nft.bunnyId}
      image={nft.previewImage}
      onChange={handleChange}
      isChecked={isChecked}
    >
      <Text bold>{nft.name}</Text>
    </SelectionCard>
  )
}

export default NftSelectionCard
