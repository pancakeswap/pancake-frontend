import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  CardFooter,
  Heading,
  ChevronDownIcon,
  ChevronUpIcon,
  Flex,
  Button, useModal,
} from '@rug-zombie-libs/uikit'
import { nftById } from '../../../../redux/get'
import WithdrawLpModal from '../../../Tombs/WithdrawLpModal'
import ViewModal from '../ViewModal'
import SwiperProvider from '../../../Predictions/context/SwiperProvider'


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
const StyleCardHeader = styled.div`
  width: 100%;
  height: 300px;
  background: #111820;
`

interface CollectiblesCardProps {
  id: number
}

const CollectiblesCard: React.FC<CollectiblesCardProps> = ({ id }: CollectiblesCardProps) => {
  const { name, description, address, path, type, rarity, userInfo: { ownedIds } } = nftById(id)
  const [isOpen, setIsOpen] = useState(false)
  const isOwned = ownedIds.length > 0
  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const [onPresentViewModal] = useModal(
    <SwiperProvider>
      <ViewModal
        id={id}
      />
    </SwiperProvider>,
  )

  return (
    <div>
      <Card className={isOwned ? 'card-collectibles' : 'card-active'}>
        <StyleCardHeader>
          <Flex justifyContent='center' paddingTop='5%' height='100%'>
            {type === 'image' ? <img
                src={path} alt='nft'
                style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain' }} /> :
              <video style={{ maxWidth: '90%', maxHeight: '100%' }} autoPlay loop>
                <source src={path} type='video/mp4' />
              </video>}
          </Flex>
        </StyleCardHeader>
        <CardBody>
          <Heading as='h2' fontSize='18px'>{name}</Heading>
        </CardBody>
        <CardFooter>
          <StyleDetails>
            <Flex justifyContent='center' alignItems='center'>
              {isOwned ? <div style={{ paddingRight: '10px' }}><Button variant='secondary' onClick={onPresentViewModal}>
                View
              </Button></div> : null}
              <StyleCursorPointer onClick={toggleOpen}>
                Details
                {
                  isOpen ? <ChevronUpIcon color='text' ml='10px' />
                    : <ChevronDownIcon color='text' ml='10px' />
                }
              </StyleCursorPointer>
            </Flex>
          </StyleDetails>
          {
            isOpen &&
            <div className='direction-column' style={{ paddingTop: '5%' }}>
              <span className='indetails-type'>{name}</span>
              <span className='indetails-title'>{description}</span>
            </div>
          }
        </CardFooter>
      </Card>
    </div>
  )
}

export default CollectiblesCard