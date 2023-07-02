import ConnectWalletButton from 'components/ConnectWalletButton'

import { AutoColumn, CircleLoader, Flex, Text } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import { Dispatch, ReactNode, useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { SetStateAction } from 'jotai'
import { CryptoFormView } from 'views/BuyCrypto/types'

interface GetQuotesButtonProps {
  errorText: string | undefined
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  fetchQuotes: () => Promise<void>
}

export default function GetQuotesButton({ errorText, setModalView, fetchQuotes }: GetQuotesButtonProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { address: account } = useAccount()
  const { t } = useTranslation()

  const Next = useCallback(async () => {
    setLoading(true)
    await fetchQuotes()
    // await new Promise((resolve) => setTimeout(resolve, 1500))
    setLoading(false)
    setModalView(CryptoFormView.Quote)
  }, [setModalView, fetchQuotes])

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  let buttonText: ReactNode | string = t('Get Quotes')
  if (errorText) {
    buttonText = errorText
  }
  if (loading) {
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
        onClick={Next}
        disabled={Boolean(errorText)}
        isLoading={loading}
        height="55px"
      >
        {buttonText}
      </CommitButton>
    </AutoColumn>
  )
}
