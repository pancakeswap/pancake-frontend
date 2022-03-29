export default {
  entryPagePath: 'views/Swap/bmp/index',
  pages: ['views/Swap/bmp/index', 'views/bmp/liquidity/index', 'views/webview'],
  darkmode: true,
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '@navBgColor',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: 'PancakeSwap',
  },
  themeLocation: './theme.json',
  tabBar: {
    custom: true,
    color: '#7A6EAA',
    selectedColor: '#7645D9',
    backgroundColor: '@navBgColor',
    borderStyle: '@tabBorder',
    list: [
      {
        iconPath: 'images/trade.png',
        selectedIconPath: 'images/trade-select.png',
        pagePath: 'views/Swap/bmp/index',
        text: 'Exchange',
      },
      {
        iconPath: 'images/earn.png',
        selectedIconPath: 'images/earn-select.png',
        pagePath: 'views/bmp/liquidity/index',
        text: 'Liquidity',
      },
    ],
  },
}
