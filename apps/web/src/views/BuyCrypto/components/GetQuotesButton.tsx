import ConnectWalletButton from 'components/ConnectWalletButton'

import { AutoColumn, CircleLoader, Flex, Text } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import { Dispatch, ReactNode, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { SetStateAction } from 'jotai'
import { CryptoFormView } from 'views/BuyCrypto/types'
import { useMutation } from '@tanstack/react-query'

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

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  let buttonText: ReactNode | string = t('Get Quotes')
  if (errorText) {
    buttonText = errorText
  }
  if (isLoading) {
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
        disabled={Boolean(errorText)}
        isLoading={isLoading}
        height="55px"
      >
        {buttonText}
      </CommitButton>
    </AutoColumn>
  )
}
