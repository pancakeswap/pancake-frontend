import ConnectWalletButton from 'components/ConnectWalletButton'

import { AutoColumn, CircleLoader, Flex, Text } from '@pancakeswap/uikit'
import { CommitButton } from 'components/CommitButton'
import { Dispatch, ReactNode, useCallback, useState } from 'react'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { SetStateAction } from 'jotai'
// eslint-disable-next-line import/no-cycle
import { CryptoFormView } from '..'

interface GetQuotesButtonProps {
  modalView: CryptoFormView
  errorText: string | undefined
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
}

export default function GetQuotesButton({ modalView, errorText, setModalView }: GetQuotesButtonProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { address: account } = useAccount()
  const { t } = useTranslation()

  const Next = useCallback(() => {
    if (modalView === CryptoFormView.Input) {
      setLoading(true)
      setTimeout(() => {
        setLoading(false)
        setModalView(CryptoFormView.Quote)
      }, 2000)
    } else {
      // to-do
    }
  }, [modalView, setModalView])

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
      >
        {buttonText}
      </CommitButton>
    </AutoColumn>
  )
}
