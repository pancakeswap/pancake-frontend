/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {
  BalanceInput,
  Button,
  Flex,
  Image,
  Input,
  LinkExternal,
  Modal,
  Slider,
  Text,
  useModal,
} from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import { useDrFrankenstein, useERC721, useMultiCall, useNftConverter, useNftOwnership } from 'hooks/useContract'
import { BASE_BSC_SCAN_URL, BASE_EXCHANGE_URL, BASE_V1_EXCHANGE_URL } from 'config'
import { getAddress, getNftConverterAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import erc721Abi from 'config/abi/erc721.json'
import WarningModal from '../WarningModal'
import WarningDepositRugModal from '../WarningDepositRugModal'
import { Grave } from '../../../../redux/types'
import { account, graveByPid, nftByName } from '../../../../redux/get'
import NftWarningModal from '../NftWarningModal'

interface StakeModalProps {
  pid: number,
  updateResult: any,
  onDismiss?: () => void,
  updateAllowance: any,
}

const StyledButton = styled(Button)`
  flex-grow: 1;
`

const ConvertNftModal: React.FC<StakeModalProps> = ({ pid, updateResult, onDismiss }) => {
  const { nftConverterPid, nft } = graveByPid(pid)
  const { path, type, address, symbol } = nftByName(nft)
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const nftContract = useERC721(address)
  const nftOwnershipContract = useNftOwnership()
  const nftConverterContract = useNftConverter()
  const [nftBalance, setNftBalance] = useState(BIG_ZERO)
  const [ids, setIds] = useState([])
  const [selected, setSelected] = useState(null)
  const [approved, setApproved] = useState(false)

  const wallet = account()

  const { theme } = useTheme()

  useEffect(() => {
    if (selected) {
      nftContract.methods.getApproved(selected).call()
        .then(res => {
          setApproved(res === getNftConverterAddress())
        })
    }
  }, [selected, nftContract.methods])

  useEffect(() => {
    nftContract.methods.balanceOf(wallet).call()
      .then(res => {
        setNftBalance(new BigNumber(res))
      })
  }, [nftContract.methods, wallet])

  useEffect(() => {
    if (wallet)
      nftOwnershipContract.methods.checkOwnership(wallet, address).call()
        .then(res => {
          setIds(res)
        })
  }, [address, nftOwnershipContract.methods, wallet])

  const handleConvertNft = () => {
    if (selected) {
      if(approved) {
        nftConverterContract.methods.deposit(nftConverterPid, selected)
          .send({ from: wallet }).then(() => {
          updateResult(pid)
          toastSuccess(t(`Converted ${symbol}`))
          onDismiss()
        })
      } else {
        nftContract.methods.approve(getNftConverterAddress(), selected)
          .send({ from: wallet }).then(() => {
          setApproved(true)
          nftConverterContract.methods.deposit(nftConverterPid, selected)
            .send({ from: wallet }).then(() => {
            updateResult(pid)
            toastSuccess(t(`Converted ${symbol}`))
            onDismiss()
          })
        })
      }
    }
  }

  const [onNftWarningModal] = useModal(
    <NftWarningModal onClick={handleConvertNft} approved={approved}/>,
  )

  return <Modal onDismiss={onDismiss} title={`Convert ${symbol}`} headerBackground={theme.colors.gradients.cardHeader}>
    <Flex alignItems='center' justifyContent='space-between' mb='8px'>
      <Text bold>Select ID of NFT:</Text>
      <Flex alignItems='center' minWidth='70px'>
        <Text ml='4px' bold>
          {symbol}
        </Text>
      </Flex>
    </Flex>
    <Flex justifyContent='center'>
      {type === 'image' ? (
        <img src={path} alt='NFT' style={{ maxWidth: '50%' }} className='sc-cxNHIi bjMxQn' />
      ) : (
        <video autoPlay loop className='sc-cxNHIi bjMxQn'>
          <source src={path} type='video/webm' />
        </video>
      )}
    </Flex>
    <Text mt='8px' color='textSubtle' fontSize='12px' mb='8px' style={{ width: '100%' }}>
      Balance: {nftBalance.toString()}
      {nftBalance.isZero() ? <Text mt='8px' ml='auto' color='tertiary' fontSize='12px' mb='8px'>
        Earn {symbol} NFT from RugZombie Common Grave
      </Text> : <Text bold>IDS in your wallet:</Text>}
    </Text>
    <Flex justifyContent='center'>
      {ids.map(currentId => {
        return <div id={currentId} key={currentId} style={{ padding: '10px' }}><Button onClick={() => {
          setSelected(currentId)
        }} variant={currentId === selected ? 'secondary' : 'primary'}>{currentId}</Button></div>
      })}
    </Flex>
    <Button onClick={() => {
      if (selected) {
        onNftWarningModal()
      }
    }} disabled={!selected} mt='8px' as='a' variant={selected ? 'secondary' : 'primary'}>
      {approved ? "Convert" : "Approve & Convert"} {symbol}
    </Button>
  </Modal>
}

export default ConvertNftModal
