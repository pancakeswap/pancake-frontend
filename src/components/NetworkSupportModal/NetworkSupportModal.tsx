import { Button, Modal, Text, Grid, InjectedModalProps, Box } from '@pancakeswap/uikit'
import { ChainId } from '@pancakeswap/sdk'
import Image from 'next/future/image'
import { useSwitchNetwork } from 'hooks/useSwitchNetwork'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { chains } from 'utils/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { useMemo } from 'react'
import { useHistory } from 'contexts/HistoryContext'
import NextLink from 'next/link'

export function NetworkSupportModal({
  title,
  onDismiss,
  image,
}: InjectedModalProps & { title?: React.ReactNode; image?: string }) {
  const { t } = useTranslation()
  const { switchNetwork, isLoading } = useSwitchNetwork()
  const { chainId } = useActiveWeb3React()

  const foundChain = useMemo(() => chains.find((c) => c.id === chainId), [chainId])
  const historyManager = useHistory()

  const lastValidPath = historyManager?.history?.find((h) => ['/swap', 'liquidity', '/'].includes(h))

  return (
    <Modal title={title} hideCloseButton headerBackground="gradients.cardHeader">
      <Grid style={{ gap: '16px' }} maxWidth="360px">
        <Text bold>{t('It’s a BNB Smart Chain only feature')}</Text>
        <Text small>{t('Currently only Swap is supported in BNB Smart Chain')}</Text>

        {image && (
          <Box mx="auto" my="8px" position="relative" width="100%" minHeight="250px">
            <Image src={image} alt="feature" fill style={{ objectFit: 'contain' }} unoptimized />
          </Box>
        )}
        <Text small>
          {t(
            'Our Trading Competition, Prediction and Lottery features are currently available only on BNB Chain! Come over and join the community in the fun!',
          )}
        </Text>
        <Button
          variant="secondary"
          isLoading={isLoading}
          onClick={() => switchNetwork(ChainId.BSC).then(() => onDismiss?.())}
        >
          {t('Switch to %chain%', { chain: 'BNB Smart Chain' })}
        </Button>
        {foundChain && lastValidPath && (
          <NextLink href={lastValidPath} passHref>
            <Button as="a">{t('Stay on %chain%', { chain: foundChain.name })}</Button>
          </NextLink>
        )}
      </Grid>
    </Modal>
  )
}
