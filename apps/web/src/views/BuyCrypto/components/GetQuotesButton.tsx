import ConnectWalletButton from 'components/ConnectWalletButton'

import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, CircleLoader, Flex, Text } from '@pancakeswap/uikit'
import { useMutation } from '@tanstack/react-query'
import { CommitButton } from 'components/CommitButton'
import { SetStateAction } from 'jotai'
import { Dispatch, ReactNode, useCallback } from 'react'
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
