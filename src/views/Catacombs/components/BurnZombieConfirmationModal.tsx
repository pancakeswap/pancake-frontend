/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'
import { Button, Flex, Image, Modal, Text } from '@catacombs-libs/uikit'
import { BigNumber } from 'bignumber.js'
import tokens from '../../../config/constants/tokens'
import { account, zombieBalance } from '../../../redux/get'
import { APESWAP_EXCHANGE_URL } from '../../../config'
import { getAddress, getCatacombsAddress, getZombieAddress } from '../../../utils/addressHelpers'
import { useCatacombsContract, useZombie } from '../../../hooks/useContract'
import addresses from '../../../config/constants/contracts'
import UnlockButton from '../../../components/UnlockButton'
import { BIG_ZERO } from '../../../utils/bigNumber'
import { getFullDisplayBalance } from '../../../utils/formatBalance'


interface BurnZombieModalProps {
  onDismiss?: () => void,
}

const BurnZombieConfirmationModal: React.FC<BurnZombieModalProps> = ({ onDismiss }) => {
  const [burnAmount, setBurnAmount] = useState(BIG_ZERO)
  const [burned, setBurned] = useState(false)
  const [allowance, setAllowance] = useState(BIG_ZERO)
  const catacombs = useCatacombsContract()
  const zombie = useZombie()

  useEffect(() => {
    catacombs.methods.burnAmount().call()
      .then(
        res => {
          setBurnAmount(new BigNumber(res))
        })
  }, [catacombs.methods])

  useEffect(() => {
    if(account()) {
      zombie.methods.allowance(account(), getCatacombsAddress()).call()
        .then(res => {
          setAllowance(new BigNumber(res))
        })
    }
  }, [zombie.methods])

  const handleBurnZombie = () => {
    if (account()) {
      catacombs.methods.UnlockCatacombs().send({ from: account() }).then(() => {
        setBurned(!burned)
      })
    }
  }

  const handleApproveAndBurnZombie = () => {
    if (account()) {
      zombie.methods.approve(getAddress(addresses.catacombs), burnAmount).send({ from: account() }).then(() => {
        catacombs.methods.UnlockCatacombs().send({ from: account() }).then(() => {
          setBurned(!burned)
        })
      })
    }
  }

  return <Modal onDismiss={onDismiss} title='Congratulations!. You cracked the code.' background='black!important'
                color='white!important'
                border='1px solid white!important'>
    <Flex alignItems='center' justifyContent='space-between' mb='8px' background='black!important'>
      <Flex alignItems='center' minWidth='70px' background='black'>
        <Image src={`/images/tokens/${tokens.zmbe.symbol}.png`} width={24} height={24} alt='ZMBE' />
        <Text ml='4px' bold color='white'>
          {tokens.zmbe.symbol}
        </Text>
      </Flex>
    </Flex>
    <Text mt='8px' ml='auto' bold color='white' fontSize='14px' mb='8px'>
      Your journey begins here. Burn {getFullDisplayBalance(burnAmount).toString()} zombie to enter the Catacombs.
      <br />
      Don’t worry, “they won’t feel it because they’re already dead”
    </Text>
    {
      // eslint-disable-next-line no-nested-ternary
      account() ? zombieBalance().isZero() ?
        <Button mt='8px' as='a' href={`${APESWAP_EXCHANGE_URL}/swap?outputCurrency=${getZombieAddress()}`}
                variant='secondary'>
          <Text color='white'>Get ZMBE</Text>
        </Button> :
          <Button onClick={allowance.gte(burnAmount) ? handleBurnZombie : handleApproveAndBurnZombie} mt='8px' as='a' variant='secondary'>
            <Text color='white'>Burn {getFullDisplayBalance(burnAmount).toString()} ZMBE</Text>
          </Button> :
        <UnlockButton />
    }
  </Modal>
}

export default BurnZombieConfirmationModal

