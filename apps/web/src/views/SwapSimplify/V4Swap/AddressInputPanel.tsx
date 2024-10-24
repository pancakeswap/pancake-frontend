import { ChainId } from '@pancakeswap/chains'
import { useDebounce } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { AutoColumn, BscScanIcon, Button, Link, Text } from '@pancakeswap/uikit'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useGetENSAddressByName } from 'hooks/useGetENSAddressByName'
import { useCallback } from 'react'
import { styled } from 'styled-components'
import { safeGetAddress } from 'utils'
import { AutoRow } from '../../../components/Layout/Row'
import { getBlockExploreLink, getBlockExploreName } from '../../../utils'

const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  border-radius: 1.25rem;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  z-index: 1;
  width: 100%;
`

const ContainerRow = styled.div<{ error: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  border-radius: 1.25rem;
  border: 1px solid ${({ error, theme }) => (error ? theme.colors.failure : theme.colors.background)};
  transition: border-color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')},
    color 500ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

const InputContainer = styled.div`
  flex: 1;
`

const Input = styled.input<{ error?: boolean }>`
  font-size: 1.25rem;
  outline: none;
  border: none;
  flex: 1 1 auto;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
  transition: color 300ms ${({ error }) => (error ? 'step-end' : 'step-start')};
  color: ${({ error, theme }) => (error ? theme.colors.failure : theme.colors.primary)};
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  width: 100%;
  ::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }
  padding: 0px;
  -webkit-appearance: textfield;

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  ::-webkit-outer-spin-button,
  ::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }
`

export default function AddressInputPanel({
  id,
  value,
  onChange,
}: {
  id?: string
  // the typed string value
  value: string
  // triggers whenever the typed value changes
  onChange: (value: string | null) => void
}) {
  const { chainId } = useActiveChainId()

  const { t } = useTranslation()
  const debounceEnsName = useDebounce(value, 500)
  const recipientENSAddress = useGetENSAddressByName(debounceEnsName)

  const address = safeGetAddress(value) ? value : safeGetAddress(recipientENSAddress)

  const handleInput = useCallback(
    (event) => {
      const input = event.target.value
      const withoutSpaces = input.replace(/\s+/g, '')
      onChange(withoutSpaces)
    },
    [onChange],
  )

  const error = Boolean(value.length > 0 && !address)

  return (
    <InputPanel id={id}>
      <InputContainer>
        <AutoColumn gap="md">
          <AutoRow>
            <Text>{t('Recipient')}</Text>
            {address && chainId && (
              <Link external small href={getBlockExploreLink(address, 'address', chainId)}>
                (
                {t('View on %site%', {
                  site: getBlockExploreName(chainId),
                })}
                {chainId === ChainId.BSC && <BscScanIcon color="primary" ml="4px" />})
              </Link>
            )}
            <Button
              variant="text"
              id="remove-recipient-button"
              onClick={() => onChange(null)}
              data-dd-action-name="Swap remove recipient button"
            >
              {t('Remove')}
            </Button>
          </AutoRow>
          <ContainerRow error={error}>
            <Input
              className="recipient-address-input"
              type="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              placeholder={t('Wallet Address')}
              error={error}
              pattern="^(0x[a-fA-F0-9]{40})$"
              onChange={handleInput}
              value={value}
            />
          </ContainerRow>
        </AutoColumn>
      </InputContainer>
    </InputPanel>
  )
}
