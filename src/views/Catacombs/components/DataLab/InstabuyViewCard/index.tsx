import React from 'react';
import styled from 'styled-components';
import {
  Button,
  Card,
  CardFooter,
  Flex,
} from '@rug-zombie-libs/uikit'
import { nftById } from '../../../../../redux/get'
import Video from '../../../../../components/Video'

const StyleDetails = styled.div`
  display: flex;
  justify-content: center;
`

interface ViewCardProps {
  id: number;
  refresh: () => void;
}

const InstabuyViewCard: React.FC<ViewCardProps> = ({ id, refresh }: ViewCardProps) => {
  const { path, type, userInfo: { ownedIds } } = nftById(id);
  const isOwned = ownedIds.length > 0

  const handleSuccess = () => {
    refresh()
  }

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
            Rarity: nil
          </StyleDetails>

          <Button width="100%" variant="secondary" mt="24px" >
            Transfer
          </Button>

        </CardFooter>
      </Card>
    </div>
  )
}

export default InstabuyViewCard;