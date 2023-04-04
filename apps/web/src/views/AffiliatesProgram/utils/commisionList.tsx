import { Trans } from '@pancakeswap/localization'

interface CommissionType {
  id: string
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
    id: 'swap',
    title: <Trans>Swap & StableSwap</Trans>,
    percentage: '3%',
    image: {
      width: 128,
      height: 148,
      url: '/images/affiliates-program/stableSwap.png',
    },
  },
  {
    id: 'perpetual',
    title: <Trans>Perpetual</Trans>,
    percentage: '20%',
    image: {
      width: 100,
      height: 148,
      url: '/images/affiliates-program/perpetual.png',
    },
  },
  {
    id: 'comingSoon',
    title: <Trans>coming soon!</Trans>,
    percentage: '?',
    image: {
      width: 110,
      height: 148,
      url: '/images/affiliates-program/comming-soon.png',
    },
  },
]

export default commissionList
