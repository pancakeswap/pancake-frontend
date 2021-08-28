import React, { useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  CardFooter,
  ChevronDownIcon,
  ChevronUpIcon,
  Flex,
  Button,
} from '@rug-zombie-libs/uikit'
import { nftById } from '../../../../redux/get'


const StyleDetails = styled.div`
  display: flex;
  justify-content: center;
`
const StyleCursorPointer = styled.div`
  cursor: pointer;
  display: flex;
`

const Styleinfo = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`
const StyleCardHeader = styled.div `
  width: 100%;
  height: 300px;

  background: blue;
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
              <video style={{ maxWidth: '90%', maxHeight: '100%' }} autoPlay loop>
                <source src={path} type='video/mp4' />
              </video>}
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