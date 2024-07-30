import { memo } from 'react'
import {
  Table,
  Th,
  Text,
  Button,
  BscScanIcon,
  Link,
  Flex,
  Box,
  Td,
  useToast,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { getBlockExploreLink } from 'utils'
import { ChainId } from '@pancakeswap/chains'
import { styled } from 'styled-components'
import useGelatoLimitOrdersLib from 'hooks/limitOrders/useGelatoLimitOrdersLib'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { gelatoLimitABI } from 'config/abi/gelatoLimit'
import { ToastDescriptionWithTx } from 'components/Toast'
import useCatchTxError from 'hooks/useCatchTxError'
import truncateHash from '@pancakeswap/utils/truncateHash'

const RowStyle = styled.tr`
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.backgroundDisabled};
  }
`

const ExistingLimitOrderTable = ({ orders }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { address } = useAccount()
  const { chainId } = useActiveChainId()
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient()
  const gelatoLimitOrders = useGelatoLimitOrdersLib()
  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError } = useCatchTxError()

  return (
    <Table>
      <>
        <thead>
          <tr>
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                Hash
              </Text>
            </Th>
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="textSubtle" textAlign="left">
                {t('Actions')}
              </Text>
            </Th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <RowStyle key={order[0]}>
              <Td>
                <Flex width="100%" justifyContent="center" alignItems="center">
                  <Box width="100%">
                    <Flex justifyContent="space-between">
                      <Link external small href={getBlockExploreLink(order[0], 'transaction', ChainId.BSC)}>
                        {isMobile ? truncateHash(order[0]) : order[0]}
                        <BscScanIcon color="invertedContrast" ml="4px" />
                      </Link>
                    </Flex>
                  </Box>
                </Flex>
              </Td>
              <Td>
                <Button
                  onClick={async () => {
                    if (publicClient && gelatoLimitOrders?.contract.address && walletClient) {
                      const { request } = await publicClient.simulateContract({
                        address: gelatoLimitOrders?.contract.address as `0x${string}`,
                        abi: gelatoLimitABI,
                        functionName: 'cancelOrder',
                        account: address,
                        args: [order[1], order[2], order[3], order[4], order[5]],
                      })
                      const receipt = await fetchWithCatchTxError(() => {
                        return walletClient.writeContract({
                          ...request,
                          gas: 5000000n,
                        })
                      })
                      if (receipt?.status) {
                        toastSuccess(
                          t('Transaction receipt'),
                          <ToastDescriptionWithTx txHash={receipt.transactionHash} />,
                        )
                      }
                    }
                  }}
                >
                  {t('Cancel Order')}
                </Button>
              </Td>
            </RowStyle>
          ))}
        </tbody>
      </>
    </Table>
  )
}

export default memo(ExistingLimitOrderTable)
