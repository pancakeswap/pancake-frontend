import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import {
  BunnyFillIcon,
  Button,
  ChevronDownIcon,
  DeleteOutlineIcon,
  ErrorFillIcon,
  Flex,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import { NetworkSelectorModal } from 'components/NetworkSelectorModal'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useState } from 'react'
import { styled } from 'styled-components'
import { InputErrorText, StyledInput, StyledInputGroup } from 'views/DashboardQuestEdit/components/InputStyle'
import { ConfirmDeleteModal } from 'views/DashboardQuestEdit/components/Tasks/ConfirmDeleteModal'

const StyleSelector = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 0 8px 0 28px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
`

const StyleNetwork = styled(Flex)`
  position: relative;
  z-index: 2;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-size: contain;
`

export const AddLpAddress = () => {
  const { t } = useTranslation()
  const [pickedChainId, setPickedChainId] = useState(ChainId.BSC)
  const [total, setTotal] = useState('')
  const [lpAddress, setLpAddress] = useState('')

  const [onPresentNetworkSelectorModal] = useModal(
    <NetworkSelectorModal pickedChainId={pickedChainId} setPickedChainId={setPickedChainId} />,
  )

  const [onPresentDeleteModal] = useModal(<ConfirmDeleteModal />)

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotal(e.target.value)
  }

  const handleLpAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLpAddress(e.target.value)
  }

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center">
          <BunnyFillIcon color="#7A6EAA" width="20px" height="20px" />
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {t('Add liquidity')}
        </Text>
        <DeleteOutlineIcon
          ml="auto"
          width="20px"
          height="20px"
          color="primary"
          style={{ cursor: 'pointer' }}
          onClick={onPresentDeleteModal}
        />
      </Flex>
      <Flex flexDirection={['column']} width="100%" mt="12px">
        <Flex flex="6" flexDirection="column">
          <Flex style={{ cursor: 'pointer' }} onClick={onPresentNetworkSelectorModal}>
            <Flex position="relative" paddingRight="45px">
              <StyleNetwork style={{ backgroundImage: `url(${ASSET_CDN}/web/chains/${pickedChainId}.png)` }} />
              <StyleSelector variant="light" scale="sm" endIcon={<ChevronDownIcon />} />
            </Flex>
            <StyledInputGroup endIcon={<ErrorFillIcon color="failure" width={16} height={16} />}>
              <StyledInput
                isError
                value={lpAddress}
                placeholder={t('LP address link')}
                onChange={handleLpAddressChange}
              />
            </StyledInputGroup>
          </Flex>
          <InputErrorText errorText={t('This is not an LP address link')} />
        </Flex>
        <Flex flex="4" m={['8px 0 0 0']} flexDirection="column">
          <StyledInputGroup endIcon={<ErrorFillIcon color="failure" width={16} height={16} />}>
            <StyledInput isError placeholder={t('Min. amount in $')} value={total} onChange={handleTotalChange} />
          </StyledInputGroup>
          <InputErrorText errorText={t('Cannot be 0')} />
        </Flex>
      </Flex>
    </Flex>
  )
}
