type PropTypes = {
  left?: string
  bottom?: string
  height?: number
  width?: number
  display?: 'none'
  top?: string
}
export type CnyBannerConfig = {
  imageSrc: string
  alt: string
  desktopProps: PropTypes
  mobileProps: PropTypes
}

enum CnyBannerAssets {
  Bunny = 'Bunny',
  GoldenHat = 'GoldenHat',
  GoldenCoin = 'GoldenCoin',
  GoldenFruit = 'GoldenFruit',
  BannerBeak = 'BannerBeak',
}

export const CNY_BANNER_CONFIG: { [asset in CnyBannerAssets]: CnyBannerConfig } = {
  Bunny: {
    imageSrc: '/images/lottery/cny-bunny.png',
    alt: 'cny-bunny',
    desktopProps: {
      height: 159,
      width: 149,
      left: '-30%',
      bottom: '-30px',
    },
    mobileProps: {
      height: 159,
      width: 149,
      left: '-63%',
      bottom: '-15px',
    },
  },
  GoldenHat: {
    imageSrc: '/images/lottery/cny-golden-hat.png',
    alt: 'cny-golden-hat',
    desktopProps: {
      height: 100,
      width: 105,
      left: '94%',
      bottom: '-5px',
    },
    mobileProps: {
      height: 40,
      width: 76,
      left: '-70%',
      bottom: '-40px',
    },
  },
  GoldenCoin: {
    imageSrc: '/images/lottery/cny-banner-coin.png',
    alt: 'cny-golden-coin',
    desktopProps: {
      height: 108,
      width: 125,
      left: '-37%',
      bottom: '-30px',
    },
    mobileProps: {
      height: 108,
      width: 125,
      display: 'none',
    },
  },
  GoldenFruit: {
    imageSrc: '/images/lottery/cny-banner-fruit.png',
    alt: 'cny-golden-fruit',
    desktopProps: {
      height: 76,
      width: 137,
      left: '108%',
      bottom: '-25px',
    },
    mobileProps: {
      height: 76,
      width: 137,
      display: 'none',
    },
  },
  BannerBeak: {
    imageSrc: '/images/lottery/cny-banner-left-beak.png',
    alt: 'cny-banner-break',
    desktopProps: {
      height: 34,
      width: 10,
      left: '-1.9%',
      top: '20px',
    },
    mobileProps: {
      height: 34,
      width: 10,
      left: '-3%',
    },
  },
}
export const CnyBannerImage: {
  desktopProps: PropTypes & { imageSrc: string }
  mobileProps: PropTypes & { imageSrc: string }
} = {
  desktopProps: {
    imageSrc: '/images/lottery/cny-banner.png',
    height: 106,
    width: 628,
  },
  mobileProps: {
    imageSrc: '/images/lottery/cny-mobile-banner.png',
    height: 146,
    width: 219,
  },
}
