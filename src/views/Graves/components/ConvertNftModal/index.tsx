/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import styled from 'styled-components'
import { BalanceInput, Button, Flex, Image, LinkExternal, Modal, Slider, Text, useModal } from '@rug-zombie-libs/uikit'
import useTheme from 'hooks/useTheme'
import { useDrFrankenstein } from 'hooks/useContract'
import { BASE_BSC_SCAN_URL, BASE_EXCHANGE_URL, BASE_V1_EXCHANGE_URL } from 'config'
import { getAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { BIG_ZERO } from 'utils/bigNumber'
import { getDecimalAmount, getFullDisplayBalance } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import WarningModal from '../WarningModal'
import WarningDepositRugModal from '../WarningDepositRugModal'
import { Grave } from '../../../../redux/types'
import { grave, nftByName } from '../../../../redux/get'
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
  const nft = nftByName(grave(pid).nft)
  let nftBalance = BIG_ZERO;
  const { toastSuccess } = useToast()
  const { t } = useTranslation()

    nftBalance = useTokenBalance(nft.address);

  const drFrankenstein = useDrFrankenstein();
  const { account } = useWeb3React();

  const { theme } = useTheme();
  const [stakeAmount, setStakeAmount] = useState('0');
  const [percent, setPercent] = useState(0)

  const handleStakeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value || '0'
    setStakeAmount(inputValue);
  }


  const handleDepositRug = () => {
    const convertedStakeAmount = getDecimalAmount(new BigNumber(stakeAmount));
    drFrankenstein.methods.depositRug(pid, convertedStakeAmount)
      .send({ from: account }).then(()=>{
        updateResult(pid);
        toastSuccess(t(`Deposited ${nft.symbol}`))
        onDismiss();
      })
  }

  const [onNftWarningModal] = useModal(
    <NftWarningModal onClick={handleDepositRug} />
  )

  return <Modal  onDismiss={onDismiss} title={`Deposit ${nft.symbol}`} headerBackground={theme.colors.gradients.cardHeader}>
    <Flex alignItems="center" justifyContent="space-between" mb="8px">
      <Text bold>Enter ID of NFT:</Text>
      <Flex alignItems="center" minWidth="70px">
        <Image src={nft.path} width={24} height={24} alt='ZMBE' />
        <Text ml="4px" bold>
          {nft.symbol}
        </Text>
      </Flex>
    </Flex>
    <BalanceInput
      value={stakeAmount}
      onChange={handleStakeInputChange}
    />
    <Text mt="8px" ml="auto" color="textSubtle" fontSize="12px" mb="8px">
      Balance: {nftBalance.toString()}
      {nftBalance.isZero() ? <Text mt="8px" ml="auto" color="tertiary" fontSize="12px" mb="8px">
        Earn {nft.symbol} NFT from RugZombie Common Grave
      </Text> : null}
      <LinkExternal href={`${BASE_BSC_SCAN_URL}/token/${nft.address}?a=${account}`}>
        Check IDS in Wallet
      </LinkExternal>
    </Text>

      <Button onClick={() => { if(!nftBalance.isZero()){ onNftWarningModal() } }} disabled={nftBalance.isZero()} mt="8px" as="a" variant="secondary">
        Deposit {nft.symbol}
      </Button>
  </Modal>
}

export default ConvertNftModal
