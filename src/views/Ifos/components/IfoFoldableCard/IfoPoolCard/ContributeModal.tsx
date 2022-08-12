import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { MaxUint256 } from '@ethersproject/constants'
import { parseUnits } from '@ethersproject/units'
import {
  Modal,
  ModalBody,
  Text,
  Image,
  Button,
  BalanceInput,
  Flex,
  useTooltip,
  TooltipText,
  Box,
  Link,
  Message,
} from '@pancakeswap/uikit'
import { PoolIds, Ifo } from 'config/constants/types'
import { WalletIfoData, PublicIfoData } from 'views/Ifos/types'
import { useTranslation } from '@pancakeswap/localization'
import { formatNumber, getBalanceAmount } from 'utils/formatBalance'
import ApproveConfirmButtons from 'components/ApproveConfirmButtons'
import { ToastDescriptionWithTx } from 'components/Toast'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useToast from 'hooks/useToast'
import { DEFAULT_TOKEN_DECIMAL } from 'config'
import { useERC20 } from 'hooks/useContract'
import { bscTokens } from 'config/constants/tokens'
import { requiresApproval } from 'utils/requiresApproval'

const MessageTextLink = styled(Link)`
  display: inline;
  text-decoration: underline;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
`
interface Props {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  userCurrencyBalance: BigNumber
  creditLeft: BigNumber
  onSuccess: (amount: BigNumber, txHash: string) => void
  onDismiss?: () => void
}

const multiplierValues = [0.1, 0.25, 0.5, 0.75, 1]

// Default value for transaction setting, tweak based on BSC network congestion.
const gasPrice = parseUnits('10', 'gwei').toString()

const SmallAmountNotice: React.FC<React.PropsWithChildren<{ url: string }>> = ({ url }) => {
  const { t } = useTranslation()

  return (
    <Box maxWidth="350px">
      <Message variant="warning" mb="16px">
        <Box>
          <Text fontSize="14px" color="#D67E0A">
            {t('This IFO has token vesting. Purchased tokens are released over a period of time.')}
          </Text>
          <MessageTextLink external href={url} color="#D67E0A" display="inline">
            {t('Learn more in the vote proposal')}
          </MessageTextLink>
        </Box>
      </Message>
    </Box>
  )
}

const ContributeModal: React.FC<React.PropsWithChildren<Props>> = ({
  poolId,
  ifo,
  publicIfoData,
  walletIfoData,
  userCurrencyBalance,
  creditLeft,
  onDismiss,
  onSuccess,
}) => {
  const publicPoolCharacteristics = publicIfoData[poolId]
  const userPoolCharacteristics = walletIfoData[poolId]

  const { currency, articleUrl } = ifo
  const { toastSuccess } = useToast()
  const { limitPerUserInLP, vestingInformation } = publicPoolCharacteristics
  const { amountTokenCommittedInLP } = userPoolCharacteristics
  const { contract } = walletIfoData
  const [value, setValue] = useState('')
  const { account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const raisingTokenContractReader = useERC20(currency.address, false)
  const raisingTokenContractApprover = useERC20(currency.address)
  const { t } = useTranslation()
  const valueWithTokenDecimals = new BigNumber(value).times(DEFAULT_TOKEN_DECIMAL)
  const label = currency === bscTokens.cake ? t('Max. CAKE entry') : t('Max. token entry')

  const { isApproving, isApproved, isConfirmed, isConfirming, handleApprove, handleConfirm } =
    useApproveConfirmTransaction({
      onRequiresApproval: async () => {
        return requiresApproval(raisingTokenContractReader, account, contract.address)
      },
      onApprove: () => {
        return callWithGasPrice(raisingTokenContractApprover, 'approve', [contract.address, MaxUint256], {
          gasPrice,
        })
      },
      onApproveSuccess: ({ receipt }) => {
        toastSuccess(
          t('Successfully Enabled!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('You can now participate in the %symbol% IFO.', { symbol: ifo.token.symbol })}
          </ToastDescriptionWithTx>,
        )
      },
      onConfirm: () => {
        return callWithGasPrice(
          contract,
          'depositPool',
          [valueWithTokenDecimals.toString(), poolId === PoolIds.poolBasic ? 0 : 1],
          {
            gasPrice,
          },
        )
      },
      onSuccess: async ({ receipt }) => {
        await onSuccess(valueWithTokenDecimals, receipt.transactionHash)
        onDismiss?.()
      },
    })

  // in v3 max token entry is based on ifo credit and hard cap limit per user minus amount already committed
  const maximumTokenEntry = useMemo(() => {
    if (!creditLeft || (ifo.version >= 3.1 && poolId === PoolIds.poolBasic)) {
      return limitPerUserInLP.minus(amountTokenCommittedInLP)
    }
    if (limitPerUserInLP.isGreaterThan(0)) {
      if (limitPerUserInLP.isGreaterThan(0)) {
        return limitPerUserInLP.minus(amountTokenCommittedInLP).isLessThanOrEqualTo(creditLeft)
          ? limitPerUserInLP.minus(amountTokenCommittedInLP)
          : creditLeft
      }
    }
    return creditLeft
  }, [creditLeft, limitPerUserInLP, amountTokenCommittedInLP, ifo.version, poolId])

  // include user balance for input
  const maximumTokenCommittable = useMemo(() => {
    return maximumTokenEntry.isLessThanOrEqualTo(userCurrencyBalance) ? maximumTokenEntry : userCurrencyBalance
  }, [maximumTokenEntry, userCurrencyBalance])

  const basicTooltipContent = t(
    'For the private sale, each eligible participant will be able to commit any amount of CAKE up to the maximum commit limit, which is published along with the IFO voting proposal.',
  )

  const unlimitedToolipContent = (
    <Box>
      <Text display="inline">{t('For the public sale, Max CAKE entry is capped by')} </Text>
      <Text bold display="inline">
        {t('the number of iCAKE.')}{' '}
      </Text>
      <Text display="inline">
        {t('Lock more CAKE for longer durations to increase the maximum number of CAKE you can commit to the sale.')}
      </Text>
    </Box>
  )

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    poolId === PoolIds.poolBasic ? basicTooltipContent : unlimitedToolipContent,
    {},
  )

  const isWarning =
    valueWithTokenDecimals.isGreaterThan(userCurrencyBalance) || valueWithTokenDecimals.isGreaterThan(maximumTokenEntry)

  return (
    <Modal title={t('Contribute %symbol%', { symbol: currency.symbol })} onDismiss={onDismiss}>
      <ModalBody maxWidth="360px">
        <Box p="2px">
          <Flex justifyContent="space-between" mb="16px">
            {tooltipVisible && tooltip}
            <TooltipText ref={targetRef}>{label}:</TooltipText>
            <Text>{`${formatNumber(getBalanceAmount(maximumTokenEntry, currency.decimals).toNumber(), 3, 3)} ${
              ifo.currency.symbol
            }`}</Text>
          </Flex>
          <Flex justifyContent="space-between" mb="8px">
            <Text>{t('Commit')}:</Text>
            <Flex flexGrow={1} justifyContent="flex-end">
              <Image
                src={
                  ifo.currency.symbol === 'CAKE'
                    ? '/images/cake.svg'
                    : `/images/farms/${currency.symbol.split(' ')[0].toLocaleLowerCase()}.svg`
                }
                width={24}
                height={24}
              />
              <Text ml="4px">{currency.symbol}</Text>
            </Flex>
          </Flex>
          <BalanceInput
            value={value}
            currencyValue={`${publicIfoData.currencyPriceInUSD.times(value || 0).toFixed(2)} USD`}
            onUserInput={setValue}
            isWarning={isWarning}
            decimals={currency.decimals}
            onBlur={() => {
              if (isWarning) {
                // auto adjust to max value
                setValue(getBalanceAmount(maximumTokenCommittable).toString())
              }
            }}
            mb="8px"
          />
          {isWarning && (
            <Text
              color={valueWithTokenDecimals.isGreaterThan(userCurrencyBalance) ? 'failure' : 'warning'}
              textAlign="right"
              fontSize="12px"
              mb="8px"
            >
              {valueWithTokenDecimals.isGreaterThan(userCurrencyBalance)
                ? t('Insufficient Balance')
                : t('Exceeded max CAKE entry')}
            </Text>
          )}
          <Text color="textSubtle" textAlign="right" fontSize="12px" mb="16px">
            {t('Balance: %balance%', {
              balance: getBalanceAmount(userCurrencyBalance, currency.decimals).toString(),
            })}
          </Text>
          <Flex justifyContent="space-between" mb="16px">
            {multiplierValues.map((multiplierValue, index) => (
              <Button
                key={multiplierValue}
                scale="xs"
                variant="tertiary"
                onClick={() => setValue(getBalanceAmount(maximumTokenCommittable.times(multiplierValue)).toString())}
                mr={index < multiplierValues.length - 1 ? '8px' : 0}
              >
                {multiplierValue * 100}%
              </Button>
            ))}
          </Flex>
          {vestingInformation.percentage > 0 && <SmallAmountNotice url={articleUrl} />}
          <Text color="textSubtle" fontSize="12px" mb="24px">
            {t(
              'If you don’t commit enough CAKE, you may not receive a meaningful amount of IFO tokens, or you may not receive any IFO tokens at all.',
            )}
            <Link
              fontSize="12px"
              display="inline"
              href="https://docs.pancakeswap.finance/products/ifo-initial-farm-offering"
              external
            >
              {t('Read more')}
            </Link>
          </Text>
          <ApproveConfirmButtons
            isApproveDisabled={isConfirmed || isConfirming || isApproved}
            isApproving={isApproving}
            isConfirmDisabled={
              !isApproved || isConfirmed || valueWithTokenDecimals.isNaN() || valueWithTokenDecimals.eq(0) || isWarning
            }
            isConfirming={isConfirming}
            onApprove={handleApprove}
            onConfirm={handleConfirm}
          />
        </Box>
      </ModalBody>
    </Modal>
  )
}

export default ContributeModal
