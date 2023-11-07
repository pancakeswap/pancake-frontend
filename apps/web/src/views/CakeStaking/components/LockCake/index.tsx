// import { useTranslation } from '@pancakeswap/localization'
import { Grid } from '@pancakeswap/uikit'
import { stringify } from 'viem'
import { useVeCakeUserInfo } from 'views/CakeStaking/hooks/useVeCakeUserInfo'
import { CakeStakingStatus } from '../../types'
import { LockedVeCakeStatus } from '../LockedVeCakeStatus'
import { Expired } from './Expired'
import { Migrate } from './Migrate'
import { NotStaking } from './NotStaking'
import { Staking } from './Staking'

const customCols = {
  [CakeStakingStatus.NotStaking]: '1fr',
  [CakeStakingStatus.Expired]: 'auto 1fr',
}

export const LockCake = () => {
  // const status = CakeStakingStatus.Expired
  const status = CakeStakingStatus.NotStaking
  // const status = CakeStakingStatus.Staking
  // const status = CakeStakingStatus.Expired
  const veCakeUserInfo = useVeCakeUserInfo()
  return (
    <>
      <pre>{stringify(veCakeUserInfo, null, 2)}</pre>
      <Grid
        gridGap="24px"
        gridTemplateColumns={customCols[status] ?? '1fr 2fr'}
        maxWidth={status === CakeStakingStatus.Expired ? '78%' : '100%'}
        justifyItems={status === CakeStakingStatus.Expired ? 'end' : 'start'}
        mx="auto"
      >
        <LockedVeCakeStatus status={status} />
        {status === CakeStakingStatus.NotStaking ? <NotStaking /> : null}
        {status === CakeStakingStatus.Staking ? <Staking /> : null}
        {status === CakeStakingStatus.Expired ? <Expired /> : null}
        {status === CakeStakingStatus.Migrate ? <Migrate /> : null}
      </Grid>
    </>
  )
}
