import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  CardFooter,
  Flex,
} from '@rug-zombie-libs/uikit'
import { nftById } from '../../../../redux/get'
import Video from '../../../../components/Video'

const StyleDetails = styled.div`
  display: flex;
  justify-content: center;
`
const Styleinfo = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`

interface ViewCardProps {
  id: number;
  nftId: number;
}

const ViewCard: React.FC<ViewCardProps> = ({ id, nftId }: ViewCardProps) => {
  const { name, symbol, address, path, type, rarity, userInfo: { ownedIds } } = nftById(id);
  const [isOpen, setIsOpen] = useState(false);
  const isOwned = ownedIds.length > 0


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
          {
            isOpen &&
            <Styleinfo>
              <p>
                {name}
              </p>
            </Styleinfo>
          }
        </CardFooter>
      </Card>
    </div>
  )
}

export default ViewCard;