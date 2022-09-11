import React, { useState } from 'react'
import styled from 'styled-components'
import { Mint } from 'peronio-sdk'
import { Button, Text, AutoRenewIcon } from 'peronio-uikit'
import { useTranslation } from 'contexts/Localization'
import { formatExecutionPrice } from 'utils/prices'
import { AutoColumn } from 'components/Layout/Column'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow, RowBetween, RowFixed } from 'components/Layout/Row'
import { StyledBalanceMaxMini, MintCallbackError } from './styleds'

const MintModalFooterContainer = styled(AutoColumn)`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  background-color: ${({ theme }) => theme.colors.background};
`

export default function MintModalFooter({
  mint,
  onConfirm,
  mintErrorMessage,
  disabledConfirm = false,
}: {
  mint: Mint
  onConfirm: () => void
  mintErrorMessage: string | undefined
  disabledConfirm?: boolean
}) {
  const { t } = useTranslation()
  const [showInverted, setShowInverted] = useState<boolean>(false)

  return (
    <>
      <AutoRow>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={disabledConfirm}
          mt="12px"
          id="confirm-swap-or-send"
          width="100%"
        >
          {t('Confirm Migrate')}
        </Button>

        {mintErrorMessage ? <MintCallbackError error={mintErrorMessage} /> : null}
      </AutoRow>
    </>
  )
}
