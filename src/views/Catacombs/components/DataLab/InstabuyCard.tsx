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
} from '@catacombs-libs/uikit'
import { nftById } from '../../../../redux/get'
import useSwiper from '../../../Mausoleum/hooks/useSwiper'
import Video from '../../../../components/Video'
import InstabuyViewCard from './InstabuyViewCard'


const StyleDetails = styled.div`
  display: flex;
  justify-content: center;
`
const StyleCursorPointer = styled.div`
  cursor: pointer;ß
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
  id: number;
  refresh: () => void;
}

const InstabuyCard: React.FC<CollectiblesCardProps> = ({ id, refresh }: CollectiblesCardProps) => {
  const { name, description, address, path, type, rarity } = nftById(id)
  const [isOpen, setIsOpen] = useState(false)

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  const [onPresentViewModal, onDismiss] = useModal(
      <InstabuyViewCard
        id={id}
        refresh={refresh}
      />
  )

  return (
    <div>
      <Card className='card-active'>
        <StyleCardHeader>
          <Flex justifyContent='center' paddingTop='5%' paddingBottom='5%' height='100%'>
            {type === 'image' ? <img
                src={path} alt='nft'
                style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain' }} /> :
              <Video path={path} />}
          </Flex>
        </StyleCardHeader>
        <CardBody>
          <Heading as='h2' fontSize='18px'>{name}</Heading>
        </CardBody>
        <CardFooter>
          <StyleDetails>
            <Flex justifyContent='center' alignItems='center'>
              <div style={{ paddingRight: '10px' }}><Button onClick={onPresentViewModal}>
                View
              </Button></div>
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

export default InstabuyCard