/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from 'react'
import { Button, Flex, Image, Modal, Text } from '@catacombs-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import tokens from '../../../config/constants/tokens'
import { zombieBalance } from '../../../redux/get'
import { APESWAP_EXCHANGE_URL } from '../../../config'
import { getAddress, getZombieAddress } from '../../../utils/addressHelpers'
import { useCatacombsContract, useZombie } from '../../../hooks/useContract'
import { getBalanceNumber, getDecimalAmount } from '../../../utils/formatBalance'
import addresses from '../../../config/constants/contracts'


interface BurnZombieModalProps {
  onDismiss?: () => void,
}

const BurnZombieConfirmationModal: React.FC<BurnZombieModalProps> = ({ onDismiss }) => {
  const { account } = useWeb3React();
  const [burnAmount, setBurnAmount] = useState(null)
  const catacombs = useCatacombsContract()
  const zombie = useZombie()

  catacombs.methods.burnAmount().call()
    .then(
      res => {
        setBurnAmount(getBalanceNumber(res))
      })

  const handleBurnZombie = () => {
    zombie.methods.approve(getAddress(addresses.catacombs), getDecimalAmount(burnAmount)).send({from: account}).then(_res => {
      if (_res) {
        catacombs.methods.UnlockCatacombs().send().then( res => {
          if (res) {
            window.location.reload(false);
          }
        })
      }
    })
  }

  return <Modal onDismiss={onDismiss} title="Congratulations!. You cracked the code." background="black" color="white">
    <Flex alignItems="center" justifyContent="space-between" mb="8px" background="black">
      <Flex alignItems="center" minWidth="70px">
        <Image src={`/images/tokens/${tokens.zmbe.symbol}.png`} width={24} height={24} alt='ZMBE' />
        <Text ml="4px" bold color="white">
          {tokens.zmbe.symbol}
        </Text>
      </Flex>
    </Flex>
    <Text mt="8px" ml="auto" bold color="white" fontSize="14px" mb="8px">
      Your journey begins here. Burn {burnAmount} zombie to enter the Catacombs.
      <br/>
      Don’t worry, “they won’t feel it because they’re already dead”
    </Text>
    {
      zombieBalance().isZero() ?
      <Button mt="8px" as="a" href={`${APESWAP_EXCHANGE_URL}/swap?outputCurrency=${getZombieAddress()}`} variant="secondary">
        Get ZMBE
      </Button> :
        <Button onClick={handleBurnZombie} mt="8px" as="a" variant="secondary" color="white">
          Burn {burnAmount} ZMBE
        </Button>
      }
  </Modal>
}

export default BurnZombieConfirmationModal

