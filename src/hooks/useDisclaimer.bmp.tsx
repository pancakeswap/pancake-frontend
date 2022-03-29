import React, { useEffect } from 'react'
import styled from 'styled-components'
import { ScrollView } from '@binance/mp-components'
import mpService from '@binance/mp-service'
import {
  useModal,
  Button,
  Modal,
  Box,
  Flex,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  Heading,
  Text,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const TextWrap = styled.div`
  .ba {
    font-size: 14px;
    margin-bottom: 4px;
  }
`
function DisclaimerModal(props) {
  console.log('🚀 ~ file: useDisclaimer.bmp.tsx ~ line 19 ~ DisclaimerModal ~ props', props)
  const { t } = useTranslation()
  return (
    <Modal style={{ width: '80vw' }} hideCloseButton title="PancakeSwap Mini-Program User Service Agreement">
      <ScrollView scrollY style={{ maxHeight: '50vh' }}>
        <TextWrap>
          {Array.from({ length: 14 }, (_, index) => index).map((item) => (
            <Text key={item}>{t(`user-service-agreement-${item + 1}`)}</Text>
          ))}
        </TextWrap>
      </ScrollView>
      <Flex paddingTop="16px" justifyContent={'center'}>
        <Button
          onClick={() => {
            if (props.onClick) props.onClick()
            props.onDismiss()
          }}
        >
          I understand
        </Button>
      </Flex>
    </Modal>
  )
}
const MemoModal = React.memo(DisclaimerModal)
const key = 'isShowDisclaimerBefore'
const isShowDisclaimerBefore = mpService.getStorageSync(key) || false
const useDisclaimer = () => {
  const handleModalClick = () => {
    mpService.setStorage({ key, data: true })
  }
  const [handleClick] = useModal(<MemoModal onClick={handleModalClick} />, false)
  useEffect(() => {
    if (!isShowDisclaimerBefore) {
      handleClick()
    }
  }, [])
}

export { useDisclaimer }
