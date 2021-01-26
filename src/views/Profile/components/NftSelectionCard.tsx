import React from 'react'
import { Nft } from 'config/constants/types'
import { Text } from '@pancakeswap-libs/uikit'
import SelectionCard from './SelectionCard'

interface NftSelectionCardProps {
  isChecked?: boolean
  onChange: (bunnyId: string) => void
  nft: Nft
}

const NftSelectionCard: React.FC<NftSelectionCardProps> = ({ nft, isChecked = false, onChange }) => (
  <SelectionCard name="starter" value={nft.bunnyId} image={nft.previewImage} onChange={onChange} isChecked={isChecked}>
    <Text bold>{nft.name}</Text>
  </SelectionCard>
)

export default NftSelectionCard
