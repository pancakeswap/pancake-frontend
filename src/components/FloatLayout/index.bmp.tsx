import React from 'react'
import { AtFloatLayout } from 'taro-ui'
import 'taro-ui/dist/style/components/float-layout.scss'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'
import styled, { useTheme } from 'styled-components'
import { Box, ModalHeader, ModalBackButton, ModalTitle, Heading, ModalCloseButton } from '@pancakeswap/uikit'

const {
  safeArea: { bottom },
  windowHeight,
} = getSystemInfoSync()

export const DefaultPaddingBottom = windowHeight - bottom > 0 ? windowHeight - bottom : 0
// console.log('???', DefaultPaddingBottom)
export const FloatContainer = styled(Box)`
  background: ${({ theme }) => theme.modal.background};
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
`

// padding:${({ customPadding }) => (customPadding ? customPadding : `0px 15px ${DefaultPaddingBottom}px 15px`)};
interface FloatLayoutProps {
  onDismiss: () => void
  onBack?: () => void
  title?: string
}
export const FloatLayout: React.FC<FloatLayoutProps> = ({ children, onBack, onDismiss, title }) => {
  const theme = useTheme()
  return (
    <AtFloatLayout isOpened={true} onClose={onDismiss}>
      <style
        dangerouslySetInnerHTML={{
          __html: `.at-float-layout__container{background-color: ${theme.modal.background}; border-top-left-radius: 32px; border-top-right-radius: 32px; min-height: 100px;  }`,
        }}
      />
      <FloatContainer>
        {title && (
          <FloatHeader>
            <ModalTitle>
              {onBack && <ModalBackButton onBack={onBack} />}
              <Heading>{title}</Heading>
            </ModalTitle>
            <ModalCloseButton onDismiss={onDismiss} />
          </FloatHeader>
        )}
        {children}
        <Box style={{ paddingBottom: DefaultPaddingBottom }} />
      </FloatContainer>
    </AtFloatLayout>
  )
}

export const FloatHeader: React.FC<{}> = ({ children }) => {
  return <ModalHeader style={{ padding: '10px 10px 0px 20px', borderBottom: 'unset' }}>{children}</ModalHeader>
}
