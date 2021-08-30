/* eslint-disable react-hooks/rules-of-hooks */
import React from 'react'
import styled from 'styled-components'
import { Button, Flex, Image, Modal, Text } from '@rug-zombie-libs/uikit'
import { useDrFrankenstein } from 'hooks/useContract'
import { APESWAP_EXCHANGE_URL, BASE_EXCHANGE_URL, BASE_V1_EXCHANGE_URL } from 'config'
import { getAddress, getZombieAddress } from 'utils/addressHelpers'
import useTokenBalance from 'hooks/useTokenBalance'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { useWeb3React } from '@web3-react/core'
import useToast from 'hooks/useToast'
import { useTranslation } from 'contexts/Localization'
import { grave, zombieBalance } from '../../../../redux/get'
import tokens from '../../../../config/constants/tokens'

interface BurnZombieModalProps {
  pid: number,
  updateResult: any,
  onDismiss?: () => void,
  updateAllowance: any,
}

const BurnZombieModal: React.FC<BurnZombieModalProps> = ({ pid, updateResult, onDismiss }) => {
  const { toastSuccess } = useToast()
  const { t } = useTranslation()

  const drFrankenstein = useDrFrankenstein();
  const { account } = useWeb3React();

  const handleBurnZombie = () => {
    drFrankenstein.methods.depositRug(pid, BIG_TEN.pow(18))
      .send({ from: account }).then(()=>{
        updateResult(pid);
        toastSuccess(t("1 ZMBE Burned"))
        onDismiss();
      })
  }

  return <Modal  onDismiss={onDismiss} title="Sacrifice ZMBE" >
    <Flex alignItems="center" justifyContent="space-between" mb="8px">
      <Flex alignItems="center" minWidth="70px">
        <Image src={`/images/tokens/${tokens.zmbe.symbol}.png`} width={24} height={24} alt='ZMBE' />
        <Text ml="4px" bold>
          {tokens.zmbe.symbol}
        </Text>
      </Flex>
    </Flex>
    <Text mt="8px" ml="auto" bold color="tertiary" fontSize="14px" mb="8px">
      Your journey begins here. Burn a zombie to receive it as an NFT in 7 days.
      <br/>
      Don&apos;t worry, he&apos;s already dead so he won&apos;t feel it.
    </Text>
    {zombieBalance().isZero() ?
       <Button mt="8px" as="a" href={`${APESWAP_EXCHANGE_URL}/swap?outputCurrency=${getZombieAddress()}`} variant="secondary">
       Get ZMBE
     </Button> :
      <Button onClick={handleBurnZombie} mt="8px" as="a" variant="secondary">
        Burn 1 ZMBE
      </Button>}
  </Modal>
}

export default BurnZombieModal
