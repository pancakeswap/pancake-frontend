import React, { useState } from 'react'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { useWeb3React } from '@web3-react/core'
import { Button, Input, Modal, Text } from '@rug-zombie-libs/uikit'
import useToast from 'hooks/useToast'
import { useERC721 } from 'hooks/useContract'
import InfoRow from './InfoRow'
import { nftById } from '../../../redux/get'
import { ToastDescriptionWithTx } from '../../../components/Toast'

interface TransferNftModalProps {
  id: number
  tokenId: number
  onSuccess: () => any
  onDismiss?: () => void
}

const Value = styled(Text)`
  font-weight: 600;
`

const ModalContent = styled.div`
  margin-bottom: 16px;
`

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 8px;
`

const Label = styled.label`
  color: ${({ theme }) => theme.colors.text};
  display: block;
  margin-bottom: 8px;
  margin-top: 24px;
`

const TransferNftModal: React.FC<TransferNftModalProps> = ({ id, tokenId, onSuccess, onDismiss }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [value, setValue] = useState('')
  const [error, setError] = useState(null)
  const { account } = useWeb3React()
  const { address, name} = nftById(id)
  const contract = useERC721(address)
  const { toastSuccess } = useToast()

  const handleConfirm = async () => {
    try {
      const isValidAddress = ethers.utils.isAddress(value)

      if (!isValidAddress) {
        setError('Please enter a valid wallet address')
      } else {
        contract.methods.transferFrom(account, value, tokenId).send({ from: account })
          .then(res => {
            onDismiss()
            onSuccess()
            toastSuccess('NFT successfully transferred!', <ToastDescriptionWithTx txHash={res.transactionHash} />)
          })
          .catch(() => {
            setError('Unable to transfer NFT')
            setIsLoading(false)
          })
        setIsLoading(true)
      }
    } catch (err) {
      console.error('Unable to transfer NFT:', err)
    }
  }

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(inputValue)
  }

  return (
    <Modal title="Transfer NFT" onDismiss={onDismiss}>
      <ModalContent>
        {error && (
          <Text color="failure" mb="8px">
            {error}
          </Text>
        )}
        <InfoRow>
          <Text>Transferring:</Text>
          <Value>1x {name} NFT </Value>
        </InfoRow>
        <Label htmlFor="transferAddress">Receiving address:</Label>
        <Input
          id="transferAddress"
          name="address"
          type="text"
          placeholder="Paste address"
          value={value}
          onChange={handleChange}
          isWarning={error}
          disabled={isLoading}
        />
      </ModalContent>
      <Actions>
        <Button width="100%" variant="secondary" onClick={onDismiss}>
          Cancel
        </Button>
        <Button width="100%" onClick={handleConfirm} disabled={!account || isLoading || !value}>
          Confirm
        </Button>
      </Actions>
    </Modal>
  )
}

export default TransferNftModal
