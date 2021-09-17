import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Button,
  Card,
  CardFooter,
  Flex, useModal,
} from '@rug-zombie-libs/uikit'
import { nftById } from '../../../../redux/get'
import Video from '../../../../components/Video'
import TransferNftModal from '../TransferNftModal'

const StyleDetails = styled.div`
  display: flex;
  justify-content: center;
`

interface ViewCardProps {
  id: number;
  nftId: number;
  refresh: () => void;
}

const ViewCard: React.FC<ViewCardProps> = ({ id, nftId, refresh }: ViewCardProps) => {
  const { path, type, userInfo: { ownedIds } } = nftById(id);
  const isOwned = ownedIds.length > 0

  const handleSuccess = () => {
    refresh()
  }

  const [onPresentTransferModal] = useModal(
    <TransferNftModal id={id} tokenId={nftId} onSuccess={handleSuccess} />,
  )

  return (
    <div>
      <Card className={isOwned ? 'card-collectibles' : 'card-active'} >
          <Flex justifyContent="center" paddingTop="5%" height="100%" style={{aspectRatio: "1/1"}}>
            {type === 'image' ? <img
                src={path} alt='test'
                style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain' }} /> :
              <Video path={path}/> }
          </Flex>
        <CardFooter>
          <StyleDetails>
            Rarity: {nftId}
          </StyleDetails>

          <Button width="100%" variant="secondary" mt="24px" onClick={onPresentTransferModal}>
            Transfer
          </Button>

        </CardFooter>
      </Card>
    </div>
  )
}

export default ViewCard;