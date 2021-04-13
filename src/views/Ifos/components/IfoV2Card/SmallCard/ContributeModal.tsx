import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { Modal, ModalBody, LinkExternal, Box, Text, Image, Button, Link, OpenNewIcon } from '@pancakeswap-libs/uikit'
import { Token } from 'config/constants/types'
import { BASE_ADD_LIQUIDITY_URL } from 'config'
import BalanceInput from 'components/BalanceInput'
import useTokenBalance from 'hooks/useTokenBalance'
import { PoolIds } from 'hooks/ifo/v2/types'
import useI18n from 'hooks/useI18n'
import { getBalanceNumber } from 'utils/formatBalance'
import { getAddress } from 'utils/addressHelpers'
import ApproveConfirmButtons from 'views/Profile/components/ApproveConfirmButtons'
import useApproveConfirmTransaction from 'hooks/useApproveConfirmTransaction'
import { useERC20 } from 'hooks/useContract'

interface Props {
  poolId: PoolIds
  currency: Token
  contract: any
  maxValue?: BigNumber
  onSuccess: (amount: BigNumber) => void
  onDismiss?: () => void
}

const ContributeModal: React.FC<Props> = ({ currency, poolId, contract, onDismiss, onSuccess, maxValue }) => {
  const [value, setValue] = useState('')
  const { account } = useWeb3React()
  const raisingTokenContract = useERC20(getAddress(currency.address))
  const balance = useTokenBalance(getAddress(currency.address))
  const TranslateString = useI18n()
  const valueWithTokenDecimals = new BigNumber(value).times(new BigNumber(10).pow(18))
  const max = maxValue && maxValue.isLessThanOrEqualTo(balance) ? getBalanceNumber(maxValue) : getBalanceNumber(balance)
  const {
    isApproving,
    isApproved,
    isConfirmed,
    isConfirming,
    handleApprove,
    handleConfirm,
  } = useApproveConfirmTransaction({
    onRequiresApproval: async () => {
      try {
        const response = await raisingTokenContract.methods.allowance(account, contract.options.address).call()
        const currentAllowance = new BigNumber(response)
        return currentAllowance.gt(0)
      } catch (error) {
        return false
      }
    },
    onApprove: () => {
      return raisingTokenContract.methods
        .approve(contract.options.address, ethers.constants.MaxUint256)
        .send({ from: account })
    },
    onConfirm: () => {
      return contract.methods
        .depositPool(valueWithTokenDecimals.toString(), poolId === PoolIds.poolBasic ? 0 : 1)
        .send({ from: account })
    },
    onSuccess: async () => {
      onDismiss()
      onSuccess(valueWithTokenDecimals)
    },
  })

  if (balance.isEqualTo(0)) {
    return (
      <Modal title="LP Tokens required" onDismiss={onDismiss}>
        <ModalBody maxWidth="288px">
          <Image
            src={`/images/farms/${currency.symbol.split(' ')[0].toLocaleLowerCase()}.svg`}
            width={72}
            height={72}
            margin="auto"
            mb="24px"
          />
          <Text mb="16px">
            You’ll need{' '}
            <Text as="span" bold>
              CAKE-BNB LP
            </Text>{' '}
            tokens to participate in the IFO!
          </Text>
          <Text mb="24px">Get LP tokens, or make sure your tokens aren’t staked somewhere else.</Text>
          <Button
            as={Link}
            external
            href={`${BASE_ADD_LIQUIDITY_URL}/BNB/0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82`}
            endIcon={<OpenNewIcon color="white" />}
            minWidth="100%" // Bypass the width="fit-content" on Links
          >
            Get LP tokens
          </Button>
        </ModalBody>
      </Modal>
    )
  }

  return (
    <Modal title={`Contribute ${currency.symbol}`} onDismiss={onDismiss}>
      <Box maxWidth="400px">
        <BalanceInput
          title={TranslateString(999, 'Contribute')}
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          symbol={currency.symbol}
          max={max}
          onSelectMax={() => setValue(max.toString())}
          mb="24px"
        />
        <Text as="p" mb="24px">
          {TranslateString(
            999,
            "If you don't contribute enough LP tokens, you may not receive any IFO tokens at all and will only receive a full refund of your LP tokens.",
          )}
        </Text>
        <ApproveConfirmButtons
          isApproveDisabled={isConfirmed || isConfirming || isApproved}
          isApproving={isApproving}
          isConfirmDisabled={
            !isApproved || isConfirmed || valueWithTokenDecimals.isNaN() || valueWithTokenDecimals.eq(0)
          }
          isConfirming={isConfirming}
          onApprove={handleApprove}
          onConfirm={handleConfirm}
        />
        <LinkExternal
          href="https://exchange.pancakeswap.finance/#/add/BNB/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
          style={{ margin: '16px auto 0' }}
        >
          {`Get ${currency.symbol}`}
        </LinkExternal>
      </Box>
    </Modal>
  )
}

export default ContributeModal
