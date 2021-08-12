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
import { useDrFrankenstein, useERC721, useMultiCall, useNftConverter } from 'hooks/useContract'
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
import { graveByPid, nftByName } from '../../../../redux/get'
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
  const nft = nftByName(graveByPid(pid).nft)
  const grave = graveByPid(pid)
  const { toastSuccess } = useToast()
  const { t } = useTranslation()
  const nftContract = useERC721(nft.address)
  const nftConverterContract = useNftConverter()
  const [nftBalance, setNftBalance] = useState(BIG_ZERO);
  const { account } = useWeb3React();

  const { theme } = useTheme();
  const [stakeAmount, setStakeAmount] = useState('');

  const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value

    setStakeAmount(inputValue);
  }

  console.log("test")
  useEffect(() => {
    nftContract.methods.balanceOf(account).call()
      .then(res => {
        setNftBalance(new BigNumber(res))
      })
  },[account, nftContract.methods])

  const handleConvertNft = () => {
    if(stakeAmount !== '') {
      nftContract.methods.approve(getNftConverterAddress(), stakeAmount)
        .send({ from: account }).then(() => {
        nftConverterContract.methods.deposit(grave.nftConverterPid, stakeAmount)
          .send({ from: account }).then(() => {
          updateResult(pid)
          toastSuccess(t(`Converted ${nft.symbol}`))
          onDismiss()
        })
      })
    }
  }

  const [onNftWarningModal] = useModal(
    <NftWarningModal onClick={handleConvertNft} />
  )

  // console.log(owner)
  return <Modal  onDismiss={onDismiss} title={`Convert ${nft.symbol}`} headerBackground={theme.colors.gradients.cardHeader}>
    <Flex alignItems="center" justifyContent="space-between" mb="8px">
      <Text bold>Enter ID of NFT:</Text>
      <Flex alignItems="center" minWidth="70px">
        <Image src={nft.path} width={24} height={24} alt='ZMBE' />
        <Text ml="4px" bold>
          {nft.symbol}
        </Text>
      </Flex>
    </Flex>
    <Input
      value={stakeAmount}
      onChange={handleStakeInputChange}
      inputMode="numeric"
    />
    <Text mt="8px" color="textSubtle" fontSize="12px" mb="8px" style={{width: "100%"}}>
      Balance: {nftBalance.toString()}
      {nftBalance.isZero() ? <Text mt="8px" ml="auto" color="tertiary" fontSize="12px" mb="8px">
        Earn {nft.symbol} NFT from RugZombie Common Grave
      </Text> : null}

      <Text mt='8px' ml='auto' color='tertiary' fontSize='12px' mb='8px'>
        Only enter ID of NFTs you own.
      </Text>
      <LinkExternal href={`${BASE_BSC_SCAN_URL}/token/${nft.address}?a=${account}`}>
        Check IDS in Wallet
      </LinkExternal>
    </Text>
      <Button onClick={() => { if(!nftBalance.isZero()){ onNftWarningModal() } }} disabled={nftBalance.isZero()} mt="8px" as="a" variant="secondary">
        {/* eslint-disable-next-line no-nested-ternary */}
        Approve & Convert {nft.symbol}
      </Button>
  </Modal>
}

export default ConvertNftModal
