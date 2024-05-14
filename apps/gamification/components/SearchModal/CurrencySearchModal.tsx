import { useTranslation } from '@pancakeswap/localization'
import { Currency } from '@pancakeswap/swap-sdk-core'
import {
  Heading,
  InjectedModalProps,
  MODAL_SWIPE_TO_CLOSE_VELOCITY,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { CurrencySearch } from 'components/SearchModal/CurrencySearch'
import { useCallback, useEffect, useRef, useState } from 'react'
import { styled } from 'styled-components'

const StyledModalContainer = styled(ModalContainer)`
  width: 100%;
  min-width: 320px;
  max-width: 420px !important;
  min-height: calc(var(--vh, 1vh) * 90);
  ${({ theme }) => theme.mediaQueries.md} {
    min-height: auto;
  }
`

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

interface CurrencySearchModalProps extends InjectedModalProps {
  selectedCurrency: Currency
  onCurrencySelect: (value: Currency) => void
}

export const CurrencySearchModal: React.FC<CurrencySearchModalProps> = ({
  selectedCurrency,
  onCurrencySelect,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (!wrapperRef.current) return
    setHeight(wrapperRef.current.offsetHeight - 330)
  }, [])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onDismiss?.()
      onCurrencySelect?.(currency)
    },
    [onCurrencySelect, onDismiss],
  )

  return (
    <StyledModalContainer
      drag={isMobile ? 'y' : false}
      dragConstraints={{ top: 0, bottom: 600 }}
      dragElastic={{ top: 0 }}
      dragSnapToOrigin
      onDragStart={() => {
        if (wrapperRef.current) wrapperRef.current.style.animation = 'none'
      }}
      // @ts-ignore
      onDragEnd={(e, info) => {
        if (info.velocity.y > MODAL_SWIPE_TO_CLOSE_VELOCITY && onDismiss) onDismiss()
      }}
      ref={wrapperRef}
    >
      <ModalHeader>
        <ModalTitle>
          <Heading>{t('Select a Token')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </ModalHeader>
      <StyledModalBody>
        <CurrencySearch height={height} selectedCurrency={selectedCurrency} onCurrencySelect={handleCurrencySelect} />
      </StyledModalBody>
    </StyledModalContainer>
  )
}
