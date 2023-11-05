// import { useTranslation } from '@pancakeswap/localization'
import { Grid } from '@pancakeswap/uikit'
import { MyVeCakeCard } from './MyVeCakeCard'
import { Migrate } from './Migrate'

export const LockCake = () => {
  return (
    <Grid gridGap="24px" gridTemplateColumns="1fr 2fr">
      <MyVeCakeCard />
      <Migrate />
    </Grid>
  )
}
