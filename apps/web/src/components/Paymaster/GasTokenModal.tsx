import {
  ArrowDropDownIcon,
  ArrowForwardIcon,
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
  useModalV2,
  useTooltip,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { feeTokenAtom } from 'state/paymaster/atoms'
import memoize from 'lodash/memoize'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { CurrencyLogo, NumberDisplay } from '@pancakeswap/widgets-internal'
import { useAtom } from 'jotai'
import { useNativeBalances, useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { useAccount } from 'wagmi'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import { ASSET_CDN } from 'config/constants/endpoints'
import { Address } from 'viem'
import Image from 'next/image'

import { DEFAULT_PAYMASTER_TOKEN, PaymasterToken } from 'config/paymaster'
import { usePaymaster } from 'hooks/usePaymaster'

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
  max-width: 8rem;
  text-overflow: ellipsis;
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
  const { address: account } = useAccount()

  const [feeToken, setFeeToken] = useAtom(feeTokenAtom)

  const [tokenList, setTokenList] = useState<PaymasterToken[]>([])

  const nativeBalances = useNativeBalances([account])
  const [balances, balancesLoading] = useTokenBalancesWithLoadingIndicator(
    account,
    tokenList.filter((token) => token.isToken) as any[],
  )

  const getTokenBalance = memoize((address: Address) => balances[address])

  const onSelectorButtonClick = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onTokenSelected = useCallback(
    (token: PaymasterToken) => {
      setFeeToken(token)
      setIsOpen(false)
    },
    [setFeeToken, setIsOpen],
  )

  const fetchTokenList = useCallback(async () => {
    const tempTokenList = await getPaymasterTokenlist()

    // Set Native ETH as the first token, followed by the supported ERC20 tokens
    setTokenList([DEFAULT_PAYMASTER_TOKEN, ...tempTokenList])
  }, [getPaymasterTokenlist])

  /**
   * Sort tokens based on balances
   * Keeps the Native Token in the first position
   */
  const tokenListSortComparator = (tokenA: PaymasterToken, tokenB: PaymasterToken) => {
    const balanceA = getTokenBalance(tokenA.address)
    const balanceB = getTokenBalance(tokenB.address)

    if (!balanceA || !balanceB) return 0

    if (balanceA.greaterThan(balanceB)) return -1
    if (balanceA.lessThan(balanceB)) return 1

    return 0
  }

  useEffect(() => {
    fetchTokenList()
  }, [])

  // Item Key for FixedSizeList
  const itemKey = useCallback((index: number, data: any) => `${data[index]}-${index}`, [])

  const Row = ({ data, index, style }) => {
    const item = data[index] as PaymasterToken

    const disabled = useMemo(
      () =>
        account
          ? (Boolean(item.isNative) && (!nativeBalances[account] || formatAmount(nativeBalances[account]) === '0')) ||
            (Boolean(item.isToken) &&
              (!getTokenBalance(item.address) || formatAmount(getTokenBalance(item.address)) === '0'))
          : false,
      [item],
    )

    const {
      targetRef: innerTargetRef,
      tooltip: innerTooltip,
      tooltipVisible: innerTooltipVisible,
    } = useTooltip(<>{item.discount && item.discount.replace('-', '')} discount on this gas fee token</>)

    return (
      <FixedHeightRow style={style} onClick={() => !disabled && onTokenSelected(item)} $disabled={disabled}>
        <Flex alignItems="center" justifyContent="space-between" width="100%">
          <Flex alignItems="center">
            <CurrencyLogo currency={item} />
            <Column marginLeft="12px">
              <Text bold>
                {item.symbol} &nbsp;
                {item.discount && <Badge ref={!disabled ? innerTargetRef : null}>⛽️ {item.discount}</Badge>}
              </Text>
              <Text color="textSubtle" maxWidth="200px" ellipsis small>
                {item.name}
              </Text>
            </Column>
          </Flex>

          {balancesLoading ? (
            <CircleLoader />
          ) : (account && nativeBalances[account]) || getTokenBalance(item.address) ? (
            <StyledBalanceText>
              <NumberDisplay
                value={
                  item.isNative && account
                    ? formatAmount(nativeBalances[account])
                    : formatAmount(getTokenBalance(item.address))
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
        </RowFixed>

        <GasTokenSelectButton
          selected={!!feeToken}
          onClick={onSelectorButtonClick}
          data-dd-action-name="Zyfi Gas Token Select Button"
        >
          <Flex alignItems="center">
            <div style={{ position: 'relative' }}>
              <CurrencyLogo currency={feeToken} size="20px" />
              <p style={{ position: 'absolute', bottom: '-2px', right: '-6px', fontSize: '14px' }}>⛽️</p>
            </div>

            <Text marginLeft={2} fontSize={14} bold>
              {(feeToken && feeToken.symbol && feeToken.symbol.length > 10
                ? `${feeToken.symbol.slice(0, 4)}...${feeToken.symbol.slice(
                    feeToken.symbol.length - 5,
                    feeToken.symbol.length,
                  )}`
                : feeToken?.symbol) || ''}
            </Text>
            <ArrowDropDownIcon marginLeft={1} />
          </Flex>
        </GasTokenSelectButton>
      </RowBetween>

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
              itemData={tokenList.toSorted(tokenListSortComparator)}
              itemCount={tokenList.length}
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
                <Image
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

export default GasTokenModal
