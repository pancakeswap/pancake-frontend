import { useTranslation } from '@pancakeswap/localization'
import {
  Box,
  Button,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalV2,
  Text,
} from '@pancakeswap/uikit'
import NextLink from 'next/link'
import { styled, useTheme } from 'styled-components'

const BCakeInfoWrapper = styled.div`
  position: relative;
  display: flex;
  max-width: 191px;
  background: ${({ theme }) => (theme.isDark ? 'white' : '#27262c')};
  flex-direction: column;
  margin-top: 16px;
  margin-bottom: 16px;
  border-radius: 16px;
  padding: 16px;
`

const GradientModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradientBubblegum};
`

export const SwitchToBnbChainModal: React.FC<{
  onDismiss?: () => void
  isOpen?: boolean
  setIsOpen?: (isOpen: boolean) => void
}> = ({ isOpen, onDismiss }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <ModalV2
      isOpen={isOpen}
      onDismiss={() => {
        onDismiss?.()
      }}
      closeOnOverlayClick
    >
      <ModalContainer style={{ minHeight: 350 }}>
        <GradientModalHeader>
          <ModalTitle>
            <Heading scale="lg">{t('Stake %symbol%', { symbol: 'CAKE' })}</Heading>
          </ModalTitle>
          <ModalCloseButton onDismiss={onDismiss} />
        </GradientModalHeader>
        <ModalBody p="24px" width="338px">
          <Text bold>{t('It’s a BNB smart chain only feature')}</Text>
          <Text mt="16px">{t('Lock CAKE on BNB smart chain to activate yield booster.')}</Text>
          <BCakeInfoWrapper>
            <Box width="60px" height="60px" style={{ transform: 'rotate(-25deg)' }} mt="-20px">
              <img width="100%" srcSet="/images/cake-staking/benefit-farm-boost.png 2x" alt="ve-cake" />
            </Box>
            <Text mt="30px" color={theme.isDark ? '#280D5F' : 'white'}>
              {t('Stake CAKE to obtain bCAKE – to boost farm yields.')}
            </Text>
            <Box position="absolute" width="120px" right="-90px">
              <img width="100%" srcSet="/images/cake-staking/boost-bsc.png 2x" alt="b-cake" />
            </Box>
          </BCakeInfoWrapper>
          <NextLink href="/cake-staking" passHref>
            <Button width="100%">{t('Switch chain to continue')}</Button>
          </NextLink>
        </ModalBody>
      </ModalContainer>
    </ModalV2>
  )
}
