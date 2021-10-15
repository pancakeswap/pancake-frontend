import React, { useEffect, useState } from 'react'
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
import { BigNumber } from 'bignumber.js'
import { Lightbox } from "react-modal-image";
import { account, nftById } from '../../../../redux/get'
import Video from '../../../../components/Video'
import { useInstaBuyContract } from '../../../../hooks/useContract'
import { BIG_ZERO } from '../../../../utils/bigNumber'
import { getFullDisplayBalance } from '../../../../utils/formatBalance'
import useToast from '../../../../hooks/useToast'


const StyleDetails = styled.div`
  display: flex;
  justify-content: center;
`
const StyleCursorPointer = styled.div`
  cursor: pointer;
  ß
  display: flex;
`

const Styleinfo = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
`
const StyledButton = styled(Button)`
  border: 2px solid white;
  color: white;
`
const StyleCardHeader = styled.div`
  width: 100%;
  height: 300px;
  background: #111820;
`

interface InstabuyCardProps {
  id: number;
  refresh: () => void;
  modalObj: {modal: boolean, setModal: any};
}

const initialNftInfo = {
  price: BIG_ZERO,
}

const InstabuyCard: React.FC<InstabuyCardProps> = ({ id, refresh, modalObj }: InstabuyCardProps) => {
  const { name, symbol, description, address, path, type, rarity } = nftById(id)
  const [isOpen, setIsOpen] = useState(false)
  const [nftInfo, setNftInfo] = useState(initialNftInfo)
  const instaBuy = useInstaBuyContract()
  const { toastSuccess } = useToast()

  useEffect(() => {
    instaBuy.methods.nftInfo(address).call()
      .then(res => {
        setNftInfo({
          price: new BigNumber(res.price)
        })
      })
  }, [address, instaBuy.methods])


  const closeModal = () => {
    modalObj.setModal(null)
  }

  const openModal = () => {
      modalObj.setModal(
        <Lightbox
          large={path}
          alt={name}
          onClose={closeModal}
          hideDownload
        />
      )
  }



  const handleInstabuy = () => {
    instaBuy.methods.priceInBnb(address).call().then(res => {
      instaBuy.methods.instaBuy(address)
        .send({ from: account(), value: res }).then(() => {
        toastSuccess(`Bought ${symbol}`)
      })
    })
  }

  return (
    <div>
      <Card className='card-active'>
        <StyleCardHeader>
          <Flex justifyContent='center' paddingTop='5%' paddingBottom='5%' height='100%' onClick={openModal}>
            {type === 'image' ? <img
                src={path} alt='nft'
                style={{ maxWidth: '90%', maxHeight: '100%', objectFit: 'contain' }} /> :
              <Video path={path} />}
          </Flex>
        </StyleCardHeader>
        <CardBody>
          <Heading as='h2' fontSize='18px'>{name} - {getFullDisplayBalance(nftInfo.price)} BNB</Heading>
        </CardBody>
        <CardFooter>
          <StyleDetails>
            <Flex justifyContent='center' alignItems='center'>
              <div style={{ paddingRight: '10px' }}><StyledButton variant='secondary' onClick={handleInstabuy}>
                Instabuy
              </StyledButton>
              </div>
              <StyleCursorPointer onClick={() => {setIsOpen(!isOpen)}}>
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