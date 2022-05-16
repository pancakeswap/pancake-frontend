import { ContextApi } from 'contexts/Localization/types'

const bunniesConfig = (t: ContextApi['t']) => {
  return {
    headingText: t('10,000 bunnies.'),
    subHeadingText: t('ZERO duplicates.'),
    bodyText: [
      t('Every Pancake Squad bunny is different.'),
      t(
        'They’re all randomly generated from over 200 different features, with over eight BILLION possible combinations, so that no bunny is ever exactly alike.',
      ),
      t('On top of that, there are a very small number of ultra-rare special unique bunnies as well...!'),
    ],
    primaryButton: {
      to: '/nfts',
      text: t('View in Market'),
    },
    images: { basePath: '/images/pancakeSquad/bunnies/bunny', alt: 'bunny nft' },
  }
}

export default bunniesConfig
