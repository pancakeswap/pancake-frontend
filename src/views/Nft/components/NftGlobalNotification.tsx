import React, { useEffect, useRef } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button, Heading, Modal, useModal } from '@pancakeswap-libs/uikit'
import { getRabbitMintingFarmAddress } from 'utils/addressHelpers'
import useI18n from 'hooks/useI18n'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import rabbitmintingfarm from 'config/abi/rabbitmintingfarm.json'
import multicall from 'utils/multicall'

interface NftYouWonModalProps {
  onDismiss?: () => void
}

const rabbitMintingFarmAddress = getRabbitMintingFarmAddress()

const ModalContent = styled.div`
  padding: 24px;
  text-align: center;
`

const Actions = styled.div`
  text-align: center;
`

const NftYouWonModal: React.FC<NftYouWonModalProps> = ({ onDismiss }) => {
  const TranslateString = useI18n()
  return (
    <Modal title={TranslateString(999, 'Congratulations!')} onDismiss={onDismiss}>
      <ModalContent>
        <img src="/images/present.svg" alt="You won present" style={{ height: '64px', marginBottom: '24px' }} />
        <Heading size="lg" color="secondary">
          {TranslateString(999, 'You won an NFT!')}
        </Heading>
      </ModalContent>
      <Actions>
        <Button as="a" href="/nft">
          {TranslateString(999, 'Go to claim NFT')}
        </Button>
      </Actions>
    </Modal>
  )
}

/**
 * 1. Checks if nft supply available
 * 2. If supply is available check if the user can claim
 * 3. If the user can claim show a modal
 */
const NftGlobalNotification = () => {
  const { account } = useWallet()
  const [onPresentBurnModal] = useModal(<NftYouWonModal />)
  const showModal = useRef(() => onPresentBurnModal())

  useEffect(() => {
    const checkNftStatus = async () => {
      const [totalSupplyDistributedArr, currentDistributedSupplyArr, canClaimArr, hasClaimedArr] = await multicall(
        rabbitmintingfarm,
        [
          { address: rabbitMintingFarmAddress, name: 'totalSupplyDistributed' },
          { address: rabbitMintingFarmAddress, name: 'currentDistributedSupply' },
          { address: rabbitMintingFarmAddress, name: 'canClaim', params: [account] },
          { address: rabbitMintingFarmAddress, name: 'hasClaimed', params: [account] },
        ],
      )

      // TODO: Figure out why these values are coming back as an array
      const [totalSupplyDistributed]: [BigNumber] = totalSupplyDistributedArr
      const [currentDistributedSupply]: [BigNumber] = currentDistributedSupplyArr
      const [canClaim]: [boolean] = canClaimArr
      const [hasClaimed]: [boolean] = hasClaimedArr

      if (currentDistributedSupply.lt(totalSupplyDistributed) && canClaim && !hasClaimed) {
        showModal.current()
      }
    }

    if (account && !document.location.href.includes('/nft')) {
      checkNftStatus()
    }
  }, [account, showModal])

  return <div />
}

export default NftGlobalNotification
