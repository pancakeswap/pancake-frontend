import { useTranslation } from '@pancakeswap/localization'
import { Pair, Percent } from '@pancakeswap/sdk'
import {
  AutoColumn,
  Box,
  BunnyKnownPlaceholder,
  Button,
  DynamicSection,
  Flex,
  LinkExternal,
  Message,
  MessageText,
  ScanLink,
  Text,
} from '@pancakeswap/uikit'
import { useIsExpertMode } from '@pancakeswap/utils/user'
import { ReactNode, useCallback, useMemo } from 'react'
import { ChainLinkSupportChains } from 'state/info/constant'

import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { CommonBasesType } from 'components/SearchModal/types'
import { Bound } from 'config/constants/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { Field } from 'state/mint/actions'
import { getBlockExploreLink } from 'utils'
import { logGTMClickAddLiquidityEvent } from 'utils/customGTMEventTracking'
import { LP2ChildrenProps } from 'views/AddLiquidity'

import { InfoBox } from '@pancakeswap/widgets-internal'
import ApproveLiquidityTokens from 'views/AddLiquidityV3/components/ApproveLiquidityTokens'
import { HideMedium, MediumOnly, RightContainer } from './V3FormView'
import RangeSelector from './V3FormView/components/RangeSelector'

export default function V2FormView({
  formattedAmounts,
  addIsUnsupported,
  addIsWarning,
  shouldShowApprovalGroup,
  approveACallback,
  revokeACallback,
  currentAllowanceA,
  approvalA,
  approvalB,
  approveBCallback,
  revokeBCallback,
  currentAllowanceB,
  showFieldBApproval,
  showFieldAApproval,
  currencies,
  buttonDisabled,
  onAdd,
  onPresentAddLiquidityModal,
  errorText,
  onFieldAInput,
  onFieldBInput,
  maxAmounts,
  isOneWeiAttack,
  pair,
}: LP2ChildrenProps) {
  const mockFn = useCallback(() => undefined, [])

  const { chainId } = useActiveChainId()
  const { account, isWrongNetwork } = useActiveWeb3React()
  const { t } = useTranslation()
  const expertMode = useIsExpertMode()
  const pairExplorerLink = useMemo(
    () => (pair && getBlockExploreLink(Pair.getAddress(pair.token0, pair.token1), 'address', chainId)) || undefined,
    [pair, chainId],
  )

  let buttons: ReactNode = null
  if (addIsUnsupported || addIsWarning) {
    buttons = (
      <Button disabled mb="4px">
        {t('Unsupported Asset')}
      </Button>
    )
  } else if (!account) {
    buttons = <ConnectWalletButton width="100%" />
  } else if (isWrongNetwork) {
    buttons = <CommitButton />
  } else {
    buttons = (
      <AutoColumn gap="md">
        <ApproveLiquidityTokens
          approvalA={approvalA}
          approvalB={approvalB}
          showFieldAApproval={showFieldAApproval}
          showFieldBApproval={showFieldBApproval}
          approveACallback={approveACallback}
          approveBCallback={approveBCallback}
          revokeACallback={revokeACallback}
          revokeBCallback={revokeBCallback}
          currencies={currencies}
          currentAllowanceA={currentAllowanceA}
          currentAllowanceB={currentAllowanceB}
          shouldShowApprovalGroup={shouldShowApprovalGroup}
        />
        {isOneWeiAttack ? (
          <Message variant="warning">
            <Flex flexDirection="column">
              <MessageText>
                {t(
                  'Adding liquidity to this V2 pair is currently not available on PancakeSwap UI. Please follow the instructions to resolve it using blockchain explorer.',
                )}
              </MessageText>
              <LinkExternal
                href="https://docs.pancakeswap.finance/products/pancakeswap-exchange/faq#why-cant-i-add-liquidity-to-a-pair-i-just-created"
                mt="0.25rem"
              >
                {t('Learn more how to fix')}
              </LinkExternal>
              <ScanLink
                useBscCoinFallback={chainId ? ChainLinkSupportChains.includes(chainId) : undefined}
                href={pairExplorerLink}
                mt="0.25rem"
              >
                {t('View pool on explorer')}
              </ScanLink>
            </Flex>
          </Message>
        ) : null}
        <CommitButton
          variant={buttonDisabled ? 'danger' : 'primary'}
          onClick={() => {
            // eslint-disable-next-line no-unused-expressions
            expertMode ? onAdd() : onPresentAddLiquidityModal()
            logGTMClickAddLiquidityEvent()
          }}
          disabled={buttonDisabled}
        >
          {errorText || t('Add')}
        </CommitButton>
      </AutoColumn>
    )
  }

  return (
    <>
      <AutoColumn>
        <Text mb="8px" bold fontSize="12px" textTransform="uppercase" color="secondary">
          {t('Deposit Amount')}
        </Text>

        <Box mb="8px">
          <CurrencyInputPanel
            maxAmount={maxAmounts[Field.CURRENCY_A]}
            showUSDPrice
            onMax={() => {
              onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
            }}
            onPercentInput={(percent) => {
              if (maxAmounts[Field.CURRENCY_A]) {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.multiply(new Percent(percent, 100)).toExact() ?? '')
              }
            }}
            disableCurrencySelect
            value={formattedAmounts[Field.CURRENCY_A] ?? '0'}
            onUserInput={onFieldAInput}
            showQuickInputButton
            showMaxButton
            currency={currencies[Field.CURRENCY_A]}
            id="add-liquidity-input-tokena"
            showCommonBases
            commonBasesType={CommonBasesType.LIQUIDITY}
          />
        </Box>

        <CurrencyInputPanel
          showUSDPrice
          onPercentInput={(percent) => {
            if (maxAmounts[Field.CURRENCY_B]) {
              onFieldBInput(maxAmounts[Field.CURRENCY_B]?.multiply(new Percent(percent, 100)).toExact() ?? '')
            }
          }}
          onMax={() => {
            onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
          }}
          maxAmount={maxAmounts[Field.CURRENCY_B]}
          disableCurrencySelect
          value={formattedAmounts[Field.CURRENCY_B] ?? '0'}
          onUserInput={onFieldBInput}
          showQuickInputButton
          showMaxButton
          currency={currencies[Field.CURRENCY_B]}
          id="add-liquidity-input-tokenb"
          showCommonBases
          commonBasesType={CommonBasesType.LIQUIDITY}
        />
      </AutoColumn>
      <HideMedium>{buttons}</HideMedium>

      <RightContainer>
        <AutoColumn pt="12px" gap="24px">
          <DynamicSection disabled gap="12px">
            <InfoBox message={t('Your position will appear here.')} icon={<BunnyKnownPlaceholder />} />
            <RangeSelector
              getDecrementLower={mockFn}
              getIncrementLower={mockFn}
              getDecrementUpper={mockFn}
              getIncrementUpper={mockFn}
              onLeftRangeInput={mockFn}
              onRightRangeInput={mockFn}
              currencyA={currencies[Field.CURRENCY_A]}
              currencyB={currencies[Field.CURRENCY_B]}
              feeAmount={0}
              ticksAtLimit={{
                [Bound.LOWER]: false,
                [Bound.UPPER]: false,
              }}
            />
          </DynamicSection>
          <MediumOnly>{buttons}</MediumOnly>
        </AutoColumn>
      </RightContainer>
    </>
  )
}
