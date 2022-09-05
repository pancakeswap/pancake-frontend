import { useState, useCallback } from 'react'
import { ChainId } from '@pancakeswap/sdk'
import { useAppDispatch } from 'state'
import { BigNumber } from 'bignumber.js'
import { pickFarmHarvestTx, MsgStatus } from 'state/transactions/actions'
import { fetchFarmUserDataAsync } from 'state/farms'
import { Modal, InjectedModalProps, Flex, Box, Text, Button, AutoRenewIcon, Image } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useTranslation } from '@pancakeswap/localization'
import { useNonBscVault } from 'hooks/useContract'
import { getBalanceAmount, getFullDisplayBalance } from 'utils/formatBalance'
import { useGasPrice } from 'state/user/hooks'
import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'
import { nonBscHarvestFarm } from 'utils/calls'
import Balance from 'components/Balance'
import { LightGreyCard } from 'components/Card'
import { useTransactionAdder } from 'state/transactions/hooks'
import { getCrossFarmingContract } from 'utils/contractHelpers'

interface MultiChainHarvestModalProp extends InjectedModalProps {
  pid: number
  vaultPid: number
  earningsBigNumber: BigNumber
  earningsBusd: number
}

const MultiChainHarvestModal: React.FC<MultiChainHarvestModalProp> = ({
  pid,
  vaultPid,
  earningsBigNumber,
  earningsBusd,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const addTransaction = useTransactionAdder()
  const { account, chainId } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  const oraclePrice = useOraclePrice(chainId)
  const nonBscVaultContract = useNonBscVault()
  const displayBalance = getBalanceAmount(earningsBigNumber)
  const [pendingTx, setPendingTx] = useState(false)
  const crossFarmingAddress = getCrossFarmingContract(null, chainId)

  const handleCancel = () => {
    onDismiss?.()
  }

  const handleHarvest = async () => {
    try {
      setPendingTx(true)
      const [receipt, nonce] = await Promise.all([
        nonBscHarvestFarm(nonBscVaultContract, vaultPid, gasPrice, account, oraclePrice, chainId),
        crossFarmingAddress.nonces(account),
      ])

      const amount = getFullDisplayBalance(displayBalance, 18, 3)
      const summaryText = nonce.eq(0) ? 'Harvest %amount% CAKE with 0.005 BNB' : 'Harvest %amount% CAKE'

      addTransaction(receipt, {
        type: 'non-bsc-farm-harvest',
        translatableSummary: {
          text: summaryText,
          data: { amount },
        },
        farmHarvest: {
          sourceChain: {
            chainId,
            amount,
            status: undefined,
            tx: receipt.hash,
            nonce: nonce.toString(),
          },
          destinationChain: {
            chainId: ChainId.BSC,
            status: undefined,
            tx: '',
            msgStatus: MsgStatus.MS_UNKNOWN,
          },
        },
      })

      onDone(receipt.hash)
      handleCancel()
    } catch (error) {
      console.error('Submit Non Bsc Farm Harvest Error: ', error)
    } finally {
      setPendingTx(false)
    }
  }

  const onDone = useCallback(
    (tx: string) => {
      dispatch(pickFarmHarvestTx({ tx }))
      dispatch(fetchFarmUserDataAsync({ account, pids: [pid], chainId }))
    },
    [pid, account, chainId, dispatch],
  )

  return (
    <Modal title={t('Harvest')} style={{ maxWidth: '340px' }} onDismiss={handleCancel}>
      <Flex flexDirection="column">
        <Text bold mb="16px">
          {t('You have earned CAKE rewards on BNB Chain')}
        </Text>
        <LightGreyCard mb="16px" padding="16px">
          <Box mb="8px">
            <Text fontSize="12px" color="secondary" bold as="span">
              {t('CAKE')}
            </Text>
            <Text fontSize="12px" color="textSubtle" ml="4px" bold as="span">
              {t('Earned')}
            </Text>
          </Box>
          <Box mb="16px">
            <Balance bold decimals={5} fontSize="20px" lineHeight="110%" value={displayBalance?.toNumber()} />
            <Balance prefix="~" unit=" USD" decimals={2} value={earningsBusd} fontSize="12px" color="textSubtle" />
          </Box>
          <Button
            width="100%"
            disabled={pendingTx}
            endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
            onClick={handleHarvest}
          >
            {pendingTx ? t('Harvesting') : t('Harvest to BNB Smart Chain')}
          </Button>
        </LightGreyCard>
        <Image m="auto auto 10px auto" src="/images/farm/multi-chain-modal.png" width={288} height={220} />
        <Button variant="secondary" onClick={handleCancel}>
          {t('Cancel')}
        </Button>
      </Flex>
    </Modal>
  )
}

export default MultiChainHarvestModal
