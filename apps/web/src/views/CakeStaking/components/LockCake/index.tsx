import { Grid, useMatchBreakpoints } from '@pancakeswap/uikit'
import { useLockModal } from 'views/CakeStaking/hooks/useLockModal'
import { useCakeLockStatus } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { CakeLockStatus } from '../../types'
import { ApproveAndLockModal } from '../ApproveAndLockModal'
import { CakePoolLockStatus } from '../CakePoolLockStatus'
import { LockedVeCakeStatus } from '../LockedVeCakeStatus'
import { Expired } from './Expired'
import { Migrate } from './Migrate'
import { NotLocking } from './NotLocking'
import { Staking } from './Staking'

const customCols = {
  [CakeLockStatus.NotLocked]: '1fr',
  [CakeLockStatus.Expired]: 'auto 1fr',
}

export const LockCake = () => {
  const { status } = useCakeLockStatus()
  const { isMobile } = useMatchBreakpoints()

  const { modal, modalData } = useLockModal()
  console.log('status', status)
  return (
    <>
      <ApproveAndLockModal {...modal} {...modalData} />
      <Grid
        mt="22px"
        gridGap="24px"
        gridTemplateColumns={isMobile ? '1fr' : customCols[status] ?? '1fr 2fr'}
        justifyItems={status === CakeLockStatus.Expired ? 'end' : 'start'}
        mx="auto"
      >
        {status === CakeLockStatus.Migrate ? <CakePoolLockStatus /> : <LockedVeCakeStatus status={status} />}
        {status === CakeLockStatus.NotLocked ? <NotLocking /> : null}
        {status === CakeLockStatus.Locking ? <Staking /> : null}
        {status === CakeLockStatus.Expired ? <Expired /> : null}
        {status === CakeLockStatus.Migrate ? <Migrate /> : null}
      </Grid>
    </>
  )
}
