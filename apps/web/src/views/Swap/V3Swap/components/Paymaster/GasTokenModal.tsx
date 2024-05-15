import {
  ArrowDropDownIcon,
  Box,
  Button,
  CircleLoader,
  Column,
  Flex,
  Modal,
  ModalV2,
  QuestionHelper,
  Text,
  TokenLogo,
  useModalV2,
  useTooltip,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { useCallback, useEffect, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { NumberDisplay } from '@pancakeswap/widgets-internal'
import { useAtom } from 'jotai'
import { useNativeBalances, useTokenBalances } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { PaymasterToken, ZyfiResponse } from './types'
import { feeTokenAtom } from './state/atoms'
import { usePaymaster } from './hooks/usePaymaster'
import { DEFAULT_PAYMASTER_TOKEN } from './config/config'

/// Styles

// Selector Styles
const SelectorContainer = styled(Box)`
  margin: 6px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: ${({ theme }) => theme.radii.default};
`

const BalanceText = styled.p`
  font-size: 12px;
  padding: 10px 14px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  border-radius: 50%;
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`
const GasTokenSelectButton = styled(Button).attrs({ variant: 'text', scale: 'xs' })`
  padding: 20px 10px;
`

// Modal Styles
const FixedHeightRow = styled.div`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  cursor: pointer;

  border-radius: ${({ theme }) => theme.radii.default};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`

const StyledBalanceText = styled(Text).attrs({ small: true })`
  white-space: nowrap;
  overflow: hidden;
  max-width: 8rem;
  text-overflow: ellipsis;
`

const USDValueText = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSubtle};
`

const Badge = styled.span`
  font-size: 14px;
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.radii['32px']};
  color: ${({ theme }) => theme.colors.invertedContrast};
  background-color: ${({ theme }) => theme.colors.success};
`

function GasTokenModal() {
  const { t } = useTranslation()
  const { getPaymasterTokenlist } = usePaymaster()
  const { isOpen, setIsOpen, onDismiss } = useModalV2()
  const { address } = useAccount()

  const [feeToken, setFeeToken] = useAtom(feeTokenAtom)
  const [tokenList, setTokenList] = useState<PaymasterToken[]>([])

  const nativeBalances = useNativeBalances([address])
  const balances = useTokenBalances(address, tokenList as any[])

  const onSelectorButtonClick = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onTokenSelected = useCallback(
    (token: PaymasterToken & ZyfiResponse) => {
      setFeeToken(token)
      setIsOpen(false)
    },
    [setFeeToken, setIsOpen],
  )

  const fetchTokenList = useCallback(async () => {
    const tempTokenList = await getPaymasterTokenlist()
    setTokenList([DEFAULT_PAYMASTER_TOKEN, ...tempTokenList])
  }, [getPaymasterTokenlist])

  useEffect(() => {
    fetchTokenList()
  }, [])

  const itemKey = useCallback((index: number, data: any) => `${data[index]}-${index}`, [])

  const Row = ({ data, index, style }) => {
    const item = data[index] as PaymasterToken & ZyfiResponse

    const { targetRef, tooltip, tooltipVisible } = useTooltip(
      <>{item.markup && item.markup.replace('-', '')} discount on this gas fee token</>,
    )

    return (
      <FixedHeightRow style={style} onClick={() => onTokenSelected(item)}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          <Flex alignItems="center">
            <StyledLogo
              size="24px"
              srcs={[
                item
                  ? item.logoURI
                  : `https://pancakeswap.finance/images/tokens/0x2170Ed0880ac9A755fd29B2688956BD959F933F8.png`,
              ]}
              alt={`${item ? item?.symbol : 'ETH'}`}
            />
            <Column marginLeft="12px">
              <Text bold>
                {item.symbol} &nbsp;
                {item.markup && <Badge ref={targetRef}>⛽️ {item.markup}</Badge>}
              </Text>
              <Text color="textSubtle" maxWidth="200px" ellipsis small>
                {item.name}
              </Text>
            </Column>
          </Flex>

          <StyledBalanceText>
            <NumberDisplay
              value={
                item.isNative && address ? formatAmount(nativeBalances[address]) : formatAmount(balances[item.address])
              }
            />
            {/* <USDValueText>~0.0001 USD</USDValueText> */}
          </StyledBalanceText>
        </Flex>
        {tooltipVisible && tooltip}
      </FixedHeightRow>
    )
  }

  return (
    <>
      <SelectorContainer>
        <GasTokenSelectButton
          className="open-gas-token-select-button"
          data-dd-action-name="Select token for gas"
          selected={!!feeToken}
          onClick={onSelectorButtonClick}
        >
          <Flex alignItems="center">
            <div style={{ position: 'relative' }}>
              <StyledLogo
                size="20px"
                srcs={[
                  feeToken
                    ? feeToken.logoURI
                    : `https://pancakeswap.finance/images/tokens/0x2170Ed0880ac9A755fd29B2688956BD959F933F8.png`,
                ]}
                alt={`${feeToken ? feeToken?.symbol : 'ETH'}`}
                width="20px"
              />
              <p style={{ position: 'absolute', bottom: '-2px', right: '-6px', fontSize: '14px' }}>⛽️</p>
            </div>

            <Text marginLeft={2} fontSize={14} bold>
              {(feeToken && feeToken.symbol && feeToken.symbol.length > 10
                ? `${feeToken.symbol.slice(0, 4)}...${feeToken.symbol.slice(
                    feeToken.symbol.length - 5,
                    feeToken.symbol.length,
                  )}`
                : feeToken?.symbol) || 'ETH'}
            </Text>
            <ArrowDropDownIcon marginLeft={1} />
          </Flex>
        </GasTokenSelectButton>

        <BalanceText>
          {balances[feeToken?.address ?? '0x0'] || (address && nativeBalances[address]) ? (
            t('Balance: %balance%', {
              balance:
                feeToken?.isNative && address
                  ? formatAmount(nativeBalances[address])
                  : formatAmount(balances[feeToken?.address ?? '0x0']),
            })
          ) : (
            <CircleLoader />
          )}
        </BalanceText>
      </SelectorContainer>

      <ModalV2 onDismiss={onDismiss} isOpen={isOpen} closeOnOverlayClick>
        <Modal
          title={
            <Flex>
              <span>{t('Select token for gas')}</span>
              <QuestionHelper
                text={
                  <>
                    <Text mb="12px">
                      <Text bold display="inline-block">
                        {t('Select any ERC20 token to pay for the gas fee.')}
                      </Text>
                      <br />
                      <br />
                      {t('Pay for network fees with any asset from the list below.')}
                      <br />
                      {t('Make sure you have at least $1 worth of the token.')}
                    </Text>
                  </>
                }
                ml="6px"
                mt="1px"
                placement="top"
              />
            </Flex>
          }
          minWidth={400}
        >
          <FixedSizeList
            height={400}
            itemData={tokenList}
            itemCount={tokenList.length}
            itemSize={56}
            width="100%"
            itemKey={itemKey}
            style={{ marginTop: '14px' }}
          >
            {Row}
          </FixedSizeList>
        </Modal>
      </ModalV2>
    </>
  )
}

export default GasTokenModal
