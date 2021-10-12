import { useTranslation } from 'contexts/Localization'
import React, { useState } from 'react'
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
import { isMobile } from 'react-device-detect';
import styled from 'styled-components'
import { useInstaBuyContract } from 'hooks/useContract';
import { Carousel } from "react-responsive-carousel";
import Video from '../../../../components/Video'
import Menu from '../../../../components/Catacombs/Menu'
import Page from '../../../../components/layout/Page'
import CatacombsBackgroundDesktopSVG from '../../../../images/CatacombsMain-1920x1080px.svg'
import CatacombsBackgroundMobileSVG from '../../../../images/CatacombsMain-414x720px.svg'
import { nftById } from '../../../../redux/get'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const StyledCard = styled(Card)`
  margin: 5%;
  @media (max-width: 479px) {
    margin: 7%;
  }
`

const StyledButton = styled(Button)`
  border: 2px solid white;
  color: white;
`

const StyledDiv = styled.div`
    text-align: center;
    position: relative;
    color: white;
    height: 100%;
    width: 100%;
`

const CarouselDiv = styled.div`
  text-align: center;
  position: absolute;
  top: 15%;
  width: 50%;
  height: 50%;
  left: 25%;
  @media (max-width: 479px) {
    height: 40%;
    top: 2%;
    width: 90%;
    left: 5%;
  }
`

const StyleDetails = styled.div`
  display: flex;
  justify-content: center;
`

const StyleCardHeader = styled.div`
  width: 100%;
  height: 300px;
  background: #111820;
`

const StyleCursorPointer = styled.div`
  cursor: pointer;
  display: flex;
  padding-left: 20px;
`

const DataLab: React.FC = () => {
  const { t } = useTranslation()
  const { name, description, address, path, type, rarity, userInfo: { ownedIds } } = nftById(1)
  const nftTwo = nftById(2)
  const nftThree = nftById(3)
  const isOwned = true
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <Menu>
      <StyledDiv>
        {isMobile ? <img src={CatacombsBackgroundMobileSVG} alt='catacombs-rug-zombie' /> :
          <img src={CatacombsBackgroundDesktopSVG} alt='catacombs-rug-zombie' />
        }
        <CarouselDiv>
          <Carousel showThumbs={false} showStatus={false} autoPlay infiniteLoop>
            <div>
              <StyledCard className="card-active">
                <StyleCardHeader>
                  <Flex justifyContent='center' paddingTop='5%' height='100%'>
                    {type === 'image' ? <img
                      src={path} alt='nft'
                      style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain' }} /> :
                      <Video path={path} />}
                  </Flex>
                </StyleCardHeader>
                <CardBody>
                  <Heading as='h2' fontSize='18px'>{name}&nbsp;&nbsp;&nbsp;1.4BNB</Heading>
                </CardBody>
                <CardFooter>
                  <StyleDetails>
                    <Flex justifyContent='center' alignItems='center'>
                      {/* {
                        isOwned ? 
                          <div style={{ paddingRight: '10px' }}>
                            <Button variant='secondary' >Instabuy</Button>
                          </div> : null
                      } */}
                      <div style={{ paddingRight: '10px' }}>
                        <StyledButton variant='secondary' >Instabuy</StyledButton>
                      </div>
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
                      {/* <span className='indetails-type'>{name}</span> */}
                      <span className='indetails-title'>{description}</span>
                    </div>
                  }
                </CardFooter>
              </StyledCard>
            </div>
            <div>
              <StyledCard className="card-active">
                <StyleCardHeader>
                  <Flex justifyContent='center' paddingTop='5%' height='100%'>
                    {nftTwo.type === 'image' ? <img
                      src={nftTwo.path} alt='nft'
                      style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain' }} /> :
                      <Video path={nftTwo.path} />}
                  </Flex>
                </StyleCardHeader>
                <CardBody>
                  <Heading as='h2' fontSize='18px'>{name}&nbsp;&nbsp;&nbsp;1.4BNB</Heading>
                </CardBody>
                <CardFooter>
                  <StyleDetails>
                    <Flex justifyContent='center' alignItems='center'>
                      {/* {
                        isOwned ?
                          <div style={{ paddingRight: '10px' }}>
                            <Button variant='secondary' >View</Button>
                          </div> : null
                      } */}
                      <div style={{ paddingRight: '10px' }}>
                        <StyledButton variant='secondary' >Instabuy</StyledButton>
                      </div>
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
                      {/* <span className='indetails-type'>{nftTwo.name}</span> */}
                      <span className='indetails-title'>{nftTwo.description}</span>
                    </div>
                  }
                </CardFooter>
              </StyledCard>
            </div>
            <div>
              <StyledCard className="card-active">
                <StyleCardHeader>
                  <Flex justifyContent='center' paddingTop='5%' height='100%'>
                    {nftThree.type === 'image' ? <img
                      src={nftThree.path} alt='nft'
                      style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain' }} /> :
                      <Video path={nftThree.path} />}
                  </Flex>
                </StyleCardHeader>
                <CardBody>
                  <Heading as='h2' fontSize='18px'>{nftThree.name}&nbsp;&nbsp;&nbsp;1.4BNB</Heading>
                </CardBody>
                <CardFooter>
                  <StyleDetails>
                    <Flex justifyContent='center' alignItems='center'>
                      {/* {
                        isOwned ?
                          <div style={{ paddingRight: '10px' }}>
                            <Button variant='secondary' >View</Button>
                          </div> : null
                      } */}
                      <div style={{ paddingRight: '10px' }}>
                        <StyledButton variant='secondary' >Instabuy</StyledButton>
                      </div>
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
                      {/* <span className='indetails-type'>{nftThree.name}</span> */}
                      <span className='indetails-title'>{nftThree.description}</span>
                    </div>
                  }
                </CardFooter>
              </StyledCard>
            </div>
          </Carousel>
        </CarouselDiv>
      </StyledDiv>
    </Menu>
  )
}

export default DataLab