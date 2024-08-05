import { ChainId } from '@pancakeswap/chains'
import { useTranslation } from '@pancakeswap/localization'
import { AddIcon, Box, Button, ButtonMenu, ButtonMenuItem, Flex, MultiSelector, Text } from '@pancakeswap/uikit'
import { SHORT_SYMBOL } from 'components/NetworkSwitcher'
import { SUPPORTED_CHAIN } from 'config/supportedChain'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { styled } from 'styled-components'

const Container = styled(Box)`
  padding: 24px;
  background: ${({ theme }) =>
    theme.isDark
      ? 'linear-gradient(0deg, #3D2A54 0%, #313D5C 100%)'
      : 'linear-gradient(0deg, #f1eeff 0%, #e9f6ff 100%)'};

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 40px 24px;
  }
`

const IconButton = styled(Button)`
  display: block;
  align-self: center;
  margin-left: auto;

  > svg {
    margin-left: 0;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const StyledButtonMenu = styled(ButtonMenu)`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  > button {
    width: calc(50% - 4px);
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: fit-content;

    > button {
      width: fit-content;
    }
  }
`

const MultiSelectorStyled = styled(MultiSelector)<{ $hasOptionsPicked: boolean }>`
  height: 36px !important;
  margin: 24px 0 0 0;

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
    margin: 0 auto 0 0;
    min-width: 130px;
    max-width: 160px;
  }
`

interface RecordTemplateProps {
  title: string
  createButtonText: string
  createLink: string
  statusButtonIndex: number
  pickMultiSelect: Array<ChainId>
  setPickMultiSelect: (chains: Array<ChainId>) => void
  setStatusButtonIndex: (newIndex: number) => void
  children?: React.ReactNode
}

export const RecordTemplate: React.FC<RecordTemplateProps> = ({
  title,
  createButtonText,
  createLink,
  statusButtonIndex,
  pickMultiSelect,
  setPickMultiSelect,
  setStatusButtonIndex,
  children,
}) => {
  const { t } = useTranslation()
  const router = useRouter()

  const toCreatePage = () => {
    router.push(createLink)
  }

  const options = useMemo(() => {
    return SUPPORTED_CHAIN.map((chain, index) => ({
      id: index + 1,
      label: SHORT_SYMBOL[chain],
      value: chain,
    }))
  }, [])

  const hasOptionsPicked = useMemo(() => {
    if (pickMultiSelect.length > 0) {
      const hasIndex = options.filter((i) => pickMultiSelect.includes(i.id))
      return hasIndex.length > 0
    }

    return false
  }, [options, pickMultiSelect])

  const customPlaceHolderText = useMemo(() => {
    return pickMultiSelect.length === 0 || pickMultiSelect.length === options.length ? t('All Network') : ''
  }, [options.length, pickMultiSelect.length, t])

  return (
    <Flex flexDirection="column">
      <Container>
        <Flex maxWidth={['1200px']} margin="auto" flexDirection={['column', 'column', 'column', 'column', 'row']}>
          <Flex>
            <Text fontSize={['36px']} bold>
              {title}
            </Text>
            <IconButton scale="sm" endIcon={<AddIcon color="invertedContrast" />} onClick={toCreatePage} />
          </Flex>
          <Flex width="100%" alignItems={['flex-start', 'flex-start', 'flex-start', 'flex-start', 'center']}>
            <Flex flexDirection={['column', 'column', 'column', 'row']} m="auto" width="100%">
              <StyledButtonMenu
                scale="sm"
                variant="subtle"
                m={['0', '0', '0 auto 0 0', 'auto 16px auto auto']}
                activeIndex={statusButtonIndex}
                onItemClick={setStatusButtonIndex}
              >
                <ButtonMenuItem>{t('Ongoing')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Scheduled')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Finished')}</ButtonMenuItem>
                <ButtonMenuItem>{t('Drafted')}</ButtonMenuItem>
              </StyledButtonMenu>
              <MultiSelectorStyled
                options={options}
                placeHolderText={customPlaceHolderText}
                $hasOptionsPicked={hasOptionsPicked}
                pickMultiSelect={pickMultiSelect}
                closeDropdownWhenClickOption={false}
                onOptionChange={setPickMultiSelect}
              />
            </Flex>
            <Button
              scale="sm"
              display={['none', 'none', 'none', 'flex']}
              endIcon={<AddIcon color="invertedContrast" />}
              onClick={toCreatePage}
            >
              {createButtonText}
            </Button>
          </Flex>
        </Flex>
      </Container>
      {children}
    </Flex>
  )
}
