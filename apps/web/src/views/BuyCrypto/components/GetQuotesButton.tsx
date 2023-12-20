import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, CircleLoader, Flex, InfoIcon, Text, useTooltip } from '@pancakeswap/uikit'
import { useMutation } from '@tanstack/react-query'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { SetStateAction } from 'jotai'
import { Dispatch, ReactNode, useCallback } from 'react'
import { isMobile } from 'react-device-detect'
import { CryptoFormView } from 'views/BuyCrypto/types'
import { useAccount } from 'wagmi'

interface GetQuotesButtonProps {
  errorText: string | undefined
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  fetchQuotes: () => Promise<void>
}

export default function GetQuotesButton({ errorText, setModalView, fetchQuotes }: GetQuotesButtonProps) {
  const { address: account } = useAccount()
  const { t } = useTranslation()

  const { mutate, isLoading } = useMutation(fetchQuotes, {
    onSuccess: () => {
      setModalView(CryptoFormView.Quote)
    },
  })
  const next = useCallback(() => mutate(), [mutate])

  const {
    tooltip: buyCryptoTooltip,
    tooltipVisible: buyCryptoTooltipVisible,
    targetRef: buyCryptoTargetRef,
  } = useTooltip(
    <Text as="p">
      {t(
        'The buy crypto feature is disabled for the time being but should be back running soon. Sorry for any inconvenience',
      )}
    </Text>,
    {
      isInPortal: false,
      placement: isMobile ? 'top' : 'bottom',
      trigger: isMobile ? 'focus' : 'hover',
      ...(isMobile && { manualVisible: true }),
    },
  )

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  let buttonText: ReactNode | string = t('Get Quotes')
  if (errorText) {
    buttonText = errorText
  }
  if (isLoading) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    buttonText = (
      <>
        <Flex alignItems="center">
          <Text px="4px" fontWeight="bold" color="white">
            {t('Fetching Quotes')}
          </Text>
          <CircleLoader stroke="white" />
        </Flex>
      </>
    )
  }
  return (
    <AutoColumn gap="md">
      <CommitButton
        variant={errorText ? 'danger' : 'primary'}
        onClick={next}
        disabled
        isLoading={isLoading}
        height="55px"
      >
        <Flex ref={buyCryptoTargetRef}>
          <Text color="White" fontWeight="bold">
            {t('Disabled')}
          </Text>
          <InfoIcon color="white" paddingX="4px" width="25px" />
        </Flex>
        {buyCryptoTooltipVisible && !isMobile && buyCryptoTooltip}
      </CommitButton>
    </AutoColumn>
  )
}
