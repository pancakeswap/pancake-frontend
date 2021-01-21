import React from 'react'
import styled from 'styled-components'
import { Card, Flex, Radio, Text } from '@pancakeswap-libs/uikit'
import { Nft } from 'config/constants/types'

interface NftSelectionCardProps {
  isChecked?: boolean
  nft: Nft
}

const SelectionCard = styled(Card)<{ previewImage: Nft['previewImage'] }>`
  align-items: stretch;
  background-image: url('/images/nfts/${({ previewImage }) => previewImage}');
  background-position: right;
  background-repeat: no-repeat;
  background-size: 120px;
  border-radius: 16px;
  cursor: ${({ isSuccess }) => (isSuccess ? 'normal' : 'pointer')};
  display: flex;
  margin-bottom: 16px;
  padding-right: 120px;
  ${({ isSuccess }) => !isSuccess && 'box-shadow: none;'}
`

const Control = styled.div`
  flex: none;
  margin-right: 16px;
`
const Body = styled(Flex)`
  align-items: center;
  border: 2px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: 16px 0 0 16px;
  flex: 1;
  padding: 32px 16px;
`

const NftSelectionCard: React.FC<NftSelectionCardProps> = ({ isChecked = false, nft }) => {
  return (
    <SelectionCard isSuccess={isChecked} previewImage={nft.previewImage}>
      <Body>
        <Control>
          <Radio checked={isChecked} />
        </Control>
        <div>
          <Text bold>{nft.name}</Text>
        </div>
      </Body>
    </SelectionCard>
  )
}

export default NftSelectionCard
