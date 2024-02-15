import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, ColumnCenter, Grid, Heading, useMatchBreakpoints } from '@pancakeswap/uikit'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import BN from 'bignumber.js'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useMemo } from 'react'
import { useLockCakeData } from 'state/vecake/hooks'
import { useWriteApproveAndLockCallback } from 'views/CakeStaking/hooks/useContractWrite'
import { useAccount } from 'wagmi'
import { useBSCCakeBalance } from '../../hooks/useBSCCakeBalance'
import { NewStakingDataSet } from '../DataSet'
import { LockCakeForm } from '../LockCakeForm'
import { LockWeeksForm } from '../LockWeeksForm'
import { StyledCard } from './styled'

export const NotLocking = () => {
  return (
    <>
      <Box maxWidth={['100%', '100%', '72%']} mx="auto">
        <NotLockingCard />
      </Box>
    </>
  )
}

interface NotLockingCardProps {
  hideTitle?: boolean
  hideCardPadding?: boolean
  customVeCakeCard?: JSX.Element
  customDataRow?: JSX.Element
  onDismiss?: () => void
}

export const NotLockingCard: React.FC<React.PropsWithChildren<NotLockingCardProps>> = ({
  hideTitle,
  hideCardPadding,
  customVeCakeCard,
  customDataRow,
  onDismiss,
}) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const _cakeBalance = useBSCCakeBalance()
  const { cakeLockAmount, cakeLockWeeks } = useLockCakeData()
  const { isDesktop } = useMatchBreakpoints()

  const disabled = useMemo(
    () =>
      Boolean(
        !Number(cakeLockAmount) ||
          !Number(cakeLockWeeks) ||
          getDecimalAmount(new BN(cakeLockAmount)).gt(_cakeBalance.toString()),
      ),
    [_cakeBalance, cakeLockAmount, cakeLockWeeks],
  )

  const handleModalOpen = useWriteApproveAndLockCallback(onDismiss)

  return (
    <StyledCard innerCardProps={{ padding: hideCardPadding ? 0 : ['24px 16px', '24px 16px', '24px'] }}>
      {!hideTitle && <Heading scale="md">{t('Lock CAKE to get veCAKE')}</Heading>}
      <Grid
        gridTemplateColumns={isDesktop ? '1fr 1fr' : '1fr'}
        gridColumnGap="24px"
        gridRowGap={isDesktop ? '0' : '24px'}
        padding={[0, 0, 12]}
        mt={32}
        mb={32}
      >
        <LockCakeForm fieldOnly />
        <LockWeeksForm fieldOnly />
      </Grid>
      <NewStakingDataSet
        cakeAmount={Number(cakeLockAmount)}
        customVeCakeCard={customVeCakeCard}
        customDataRow={customDataRow}
      />
      <ColumnCenter>
        {account ? (
          <Button disabled={disabled} width={['100%', '100%', '50%']} onClick={handleModalOpen}>
            {t('Lock CAKE')}
          </Button>
        ) : (
          <ConnectWalletButton width={['100%', '100%', '50%']} />
        )}
      </ColumnCenter>
    </StyledCard>
  )
}
