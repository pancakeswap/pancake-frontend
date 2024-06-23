import { useTranslation } from '@pancakeswap/localization'
import { BoxProps, MultiSelector } from '@pancakeswap/uikit'
import { SHORT_SYMBOL } from 'components/NetworkSwitcher'
import { SUPPORTED_CHAIN } from 'config/supportedChain'
import { useMemo } from 'react'
import { styled } from 'styled-components'

interface MultiSelectorUIProps extends BoxProps {
  pickMultiSelect: Array<number>
  setPickMultiSelect: (chains: Array<number>) => void
}

const MultiSelectorStyled = styled(MultiSelector)<{ $hasOptionsPicked: boolean }>`
  height: 36px !important;

  > div {
    height: 36px;
    background-color: ${({ theme, $hasOptionsPicked }) =>
      $hasOptionsPicked ? theme.colors.primary : theme.colors.backgroundAlt};
    border-color: ${({ theme, $hasOptionsPicked }) =>
      $hasOptionsPicked ? 'transparent' : theme.colors.cardBorder} !important;

    > div {
      color: ${({ theme, $hasOptionsPicked }) => ($hasOptionsPicked ? theme.colors.white : theme.colors.text)};
    }
  }

  > div:nth-child(2) {
    border-color: ${({ theme }) => theme.colors.cardBorder};
    background-color: ${({ theme }) => theme.colors.backgroundAlt};

    input {
      &:checked {
        border: 0;
        background-color: ${({ theme }) => theme.colors.primary};
      }
    }
  }

  svg {
    fill: ${({ theme, $hasOptionsPicked }) => ($hasOptionsPicked ? theme.colors.white : theme.colors.text)};
  }

  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 130px;
    max-width: 160px;
  }
`

export const options = SUPPORTED_CHAIN.map((chain, index) => ({
  id: index + 1,
  label: SHORT_SYMBOL[chain],
  value: chain,
}))

export const MultiSelectorUI: React.FC<MultiSelectorUIProps> = (props) => {
  const { pickMultiSelect, setPickMultiSelect } = props
  const { t } = useTranslation()

  const hasOptionsPicked = useMemo(() => {
    if (pickMultiSelect.length > 0) {
      const hasIndex = options.filter((i) => pickMultiSelect.includes(i.id))
      return hasIndex.length > 0
    }

    return false
  }, [pickMultiSelect])

  const customPlaceHolderText = useMemo(() => {
    return pickMultiSelect.length === 0 || pickMultiSelect.length === options.length ? t('All Network') : ''
  }, [pickMultiSelect.length, t])

  return (
    <MultiSelectorStyled
      {...props}
      options={options}
      placeHolderText={customPlaceHolderText}
      $hasOptionsPicked={hasOptionsPicked}
      pickMultiSelect={pickMultiSelect}
      closeDropdownWhenClickOption={false}
      onOptionChange={setPickMultiSelect}
    />
  )
}
