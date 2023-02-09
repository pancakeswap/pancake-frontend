import { Trans } from '@pancakeswap/localization'

interface CommissionType {
  title: JSX.Element
  percentage: string
  image: {
    width: number
    height: number
    url: string
  }
}

const commissionList: CommissionType[] = [
  {
    title: <Trans>V2/V3 Swap & StableSwap</Trans>,
    percentage: '3%',
    image: {
      width: 128,
      height: 148,
      url: '/images/affiliates-program/stableSwap.png',
    },
  },
  {
    title: <Trans>Perpetual</Trans>,
    percentage: '20%',
    image: {
      width: 100,
      height: 148,
      url: '/images/affiliates-program/perpetual.png',
    },
  },
]

export default commissionList
