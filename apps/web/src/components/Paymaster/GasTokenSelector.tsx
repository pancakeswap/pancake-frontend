import { useTranslation } from '@pancakeswap/localization'
import {
  ArrowDropDownIcon,
  ArrowForwardIcon,
  Box,
  Button,
  CircleLoader,
  Column,
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalV2,
  QuestionHelper,
  RowBetween,
  RowFixed,
  Text,
  WarningIcon,
  useModalV2,
  useTooltip,
} from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { CurrencyLogo, NumberDisplay } from '@pancakeswap/widgets-internal'
import { ASSET_CDN } from 'config/constants/endpoints'
import memoize from 'lodash/memoize'
import { useCallback, useEffect, useMemo } from 'react'
import { FixedSizeList } from 'react-window'
import { useNativeBalances, useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import styled from 'styled-components'
import { Address } from 'viem'
import { useAccount, useConfig } from 'wagmi'

import { Currency } from '@pancakeswap/swap-sdk-core'
import { watchAccount } from '@wagmi/core'
import { DEFAULT_PAYMASTER_TOKEN, paymasterInfo, paymasterTokens } from 'config/paymaster'
import { useGasToken } from 'hooks/useGasToken'

// Selector Styles
const GasTokenSelectButton = styled(Button).attrs({ variant: 'text', scale: 'xs' })`
  padding: 18px 0 18px 6px;
`

// Modal Styles
const StyledModalContainer = styled(ModalContainer)`
  width: 100%;
  min-height: calc(var(--vh, 1vh) * 60);
  ${({ theme }) => theme.mediaQueries.md} {
    min-height: auto;
    min-width: 320px;
    max-width: 420px !important;
  }
`

const StyledModalBody = styled(ModalBody)`
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledFooterText = styled(Text)`
  padding: 10px 0 20px 0;
`

const FixedHeightRow = styled.div<{ $disabled: boolean }>`
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;

  cursor: ${({ $disabled }) => !$disabled && 'pointer'};

  &:hover {
    background-color: ${({ theme, $disabled }) => !$disabled && theme.colors.background};
  }

  ${({ $disabled }) =>
    $disabled &&
    `
    opacity: 0.5;
    user-select: none;
`}
`

const StyledBalanceText = styled(Text).attrs({ small: true })`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Badge = styled.span`
  font-size: 14px;
  padding: 1px 6px;
  user-select: none;
  border-radius: ${({ theme }) => theme.radii['32px']};
  color: ${({ theme }) => theme.colors.invertedContrast};
  background-color: ${({ theme }) => theme.colors.success};
`

const SameTokenWarningBox = styled(Box)`
  font-size: 13px;
  background-color: #ffb2371a;
  padding: 10px;
  margin: 5px 0 8px;
  color: ${({ theme }) => theme.colors.yellow};
  border: 1px solid ${({ theme }) => theme.colors.yellow};
  border-radius: ${({ theme }) => theme.radii['12px']};
`

const StyledWarningIcon = styled(WarningIcon)`
  fill: ${({ theme }) => theme.colors.yellow};
`

interface GasTokenSelectorProps {
  currency?: Currency
}

export const GasTokenSelector = ({ currency: inputCurrency }: GasTokenSelectorProps) => {
  const { t } = useTranslation()
  const { isOpen, setIsOpen, onDismiss } = useModalV2()
  const { address: account } = useAccount()

  const config = useConfig()

  const [gasToken, setGasToken] = useGasToken()
  const gasTokenInfo = paymasterInfo[gasToken.isToken ? gasToken?.wrapped.address : '']

  const nativeBalances = useNativeBalances([account])
  const [balances, balancesLoading] = useTokenBalancesWithLoadingIndicator(
    account,
    paymasterTokens.filter((token) => token.isToken) as any[],
  )

  const showSameTokenWarning = useMemo(
    () =>
      gasTokenInfo?.discount !== 'FREE' &&
      inputCurrency?.wrapped.address &&
      // Check if input token is native ETH to avoid conflicts when WETH is selected as gas token
      !inputCurrency.isNative &&
      gasToken.isToken &&
      inputCurrency.wrapped.address === gasToken.wrapped.address,
    [inputCurrency, gasToken, gasTokenInfo],
  )

  // Reset fee token if account changes, connects or disconnects
  useEffect(() => {
    return watchAccount(config as any, {
      onChange() {
        setGasToken(DEFAULT_PAYMASTER_TOKEN)
      },
    })
  }, [config, setGasToken])

  const getTokenBalance = memoize((address: Address) => balances[address])

  const onSelectorButtonClick = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onTokenSelected = useCallback(
    (token: Currency) => {
      setGasToken(token)
      setIsOpen(false)
    },
    [setGasToken, setIsOpen],
  )

  /**
   * Sort tokens based on balances
   * Keeps the Native Token in the first position
   */
  const tokenListSortComparator = (tokenA: Currency, tokenB: Currency) => {
    if (tokenA.isNative || tokenB.isNative) return 1

    const balanceA = getTokenBalance(tokenA.wrapped.address)
    const balanceB = getTokenBalance(tokenB.wrapped.address)

    if (!balanceA || !balanceB) return 0

    if (balanceA.greaterThan(balanceB)) return -1
    if (balanceA.lessThan(balanceB)) return 1

    return 0
  }

  // Item Key for FixedSizeList
  const itemKey = useCallback((index: number, data: any) => `${data[index]}-${index}`, [])

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    gasTokenInfo?.discount &&
      (gasTokenInfo.discount === 'FREE'
        ? t('Gas fees is fully sponsored')
        : t('%discount% discount on this gas fee token', { discount: gasTokenInfo.discount })),
  )

  const Row = ({ data, index, style }) => {
    const item = data[index] as Currency

    // Extra info for the token
    const itemInfo = paymasterInfo[item.isToken ? item.wrapped.address : '']

    const disabled = useMemo(
      () =>
        account && itemInfo?.discount !== 'FREE'
          ? Boolean(item.isToken) &&
            (!getTokenBalance(item.wrapped.address) || formatAmount(getTokenBalance(item.wrapped.address)) === '0')
          : false,
      [item, itemInfo],
    )

    const {
      targetRef: innerTargetRef,
      tooltip: innerTooltip,
      tooltipVisible: innerTooltipVisible,
    } = useTooltip(
      itemInfo?.discount &&
        (itemInfo.discount === 'FREE'
          ? t('Gas fees is fully sponsored')
          : t('%discount% discount on this gas fee token', { discount: itemInfo.discount })),
    )

    return (
      <FixedHeightRow style={style} onClick={() => !disabled && onTokenSelected(item)} $disabled={disabled}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          <Flex alignItems="center">
            <CurrencyLogo currency={item} useTrustWalletUrl={false} />
            <Column marginLeft="12px">
              <Text bold>
                {item.symbol} &nbsp;
                {itemInfo && itemInfo.discount && (
                  <Badge ref={!disabled ? innerTargetRef : null}>⛽️ {itemInfo.discount}</Badge>
                )}
              </Text>
              <Text color="textSubtle" maxWidth="200px" ellipsis small>
                {item.name}
              </Text>
            </Column>
          </Flex>

          {balancesLoading ? (
            <CircleLoader />
          ) : (account && nativeBalances[account]) || getTokenBalance(item.wrapped.address) ? (
            <StyledBalanceText>
              <NumberDisplay
                value={
                  item.isNative && account
                    ? formatAmount(nativeBalances[account])
                    : formatAmount(getTokenBalance(item.wrapped.address))
                }
              />
            </StyledBalanceText>
          ) : (
            <ArrowForwardIcon />
          )}
        </Flex>
        {innerTooltipVisible && innerTooltip}
      </FixedHeightRow>
    )
  }

  return (
    <>
      <RowBetween style={{ padding: '4px 0 0 0' }}>
        <RowFixed>
          <Text fontSize="14px" color="textSubtle">
            {t('Gas Token')}
          </Text>
          <QuestionHelper
            text={
              <>
                <Text mb="12px">
                  <Text bold display="inline-block">
                    {t('Gas Token')}
                  </Text>
                  <br />
                  <br />
                  {t('Select a token to pay gas fees.')}
                  <br /> <br />
                  {t('Please refer to the transaction confirmation on your wallet for the final gas fee.')}
                </Text>
              </>
            }
            ml="4px"
            placement="top"
          />
          {gasTokenInfo && gasTokenInfo.discount && (
            <Badge ref={targetRef} style={{ fontSize: '12px', fontWeight: 600, padding: '3px 5px', marginLeft: '4px' }}>
              ⛽️ {gasTokenInfo.discountLabel ?? gasTokenInfo.discount}
            </Badge>
          )}
          {tooltipVisible && tooltip}
        </RowFixed>

        <GasTokenSelectButton
          selected={!!gasToken}
          onClick={onSelectorButtonClick}
          data-dd-action-name="Zyfi Gas Token Select Button"
        >
          <Flex alignItems="center">
            <div style={{ position: 'relative' }}>
              <CurrencyLogo currency={gasToken} useTrustWalletUrl={false} size="20px" />
              <p style={{ position: 'absolute', bottom: '-2px', right: '-6px', fontSize: '14px' }}>⛽️</p>
            </div>

            <Text marginLeft={2} fontSize={14} bold>
              {(gasToken && gasToken.symbol && gasToken.symbol.length > 10
                ? `${gasToken.symbol.slice(0, 4)}...${gasToken.symbol.slice(
                    gasToken.symbol.length - 5,
                    gasToken.symbol.length,
                  )}`
                : gasToken?.symbol) || ''}
            </Text>
            <ArrowDropDownIcon marginLeft={1} />
          </Flex>
        </GasTokenSelectButton>
      </RowBetween>

      {showSameTokenWarning && (
        <SameTokenWarningBox>
          <Flex>
            <StyledWarningIcon marginRight={2} />
            <span>
              {t(
                'Please ensure you leave enough tokens for gas fees when selecting the same token for gas as the input token',
              )}
            </span>
          </Flex>
        </SameTokenWarningBox>
      )}

      <ModalV2 onDismiss={onDismiss} isOpen={isOpen} closeOnOverlayClick>
        <StyledModalContainer>
          <ModalHeader style={{ border: 'none' }}>
            <ModalTitle>
              <Heading padding={2}>
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
              </Heading>
            </ModalTitle>
            <ModalCloseButton onDismiss={onDismiss} />
          </ModalHeader>
          <StyledModalBody>
            <FixedSizeList
              height={450}
              itemData={paymasterTokens.toSorted(tokenListSortComparator)}
              itemCount={paymasterTokens.length}
              itemSize={56}
              width="100%"
              itemKey={itemKey}
              style={{ marginTop: '1px' }}
            >
              {Row}
            </FixedSizeList>
            <StyledFooterText>
              <Flex justifyContent="center" alignItems="center">
                <span>{t('Powered by Zyfi Paymaster')}</span>
                <img
                  src={`${ASSET_CDN}/web/paymasters/zyfi-logo.png`}
                  alt="Zyfi Logo"
                  width={18}
                  height={18}
                  style={{ marginLeft: '5px' }}
                />
              </Flex>
            </StyledFooterText>
          </StyledModalBody>
        </StyledModalContainer>
      </ModalV2>
    </>
  )
}
