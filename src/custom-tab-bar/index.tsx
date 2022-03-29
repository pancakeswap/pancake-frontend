import React, { Component } from 'react'
import Taro from '@binance/mp-service'
import { View, Image } from '@binance/mp-components'
import './index.scss'
import { getSystemInfoSync } from 'utils/getBmpSystemInfo'

const defaultState = {
  selected: 0,
  color: '#7A6EAA',
  selectedColor: '#7645D9',
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
}
const { safeArea, screenHeight } = getSystemInfoSync()
const blackHeight = screenHeight - safeArea.bottom
class customTabBar extends Component<{}, typeof defaultState> {
  constructor() {
    super({})
    this.state = { ...defaultState, selected: globalThis.tabbarSelected || 0 }
  }

  // eslint-disable-next-line class-methods-use-this
  switchTab(
    item: {
      pagePath: string
      text: string
      iconPath: string
      selectedIconPath: string
    },
    index: number,
  ) {
    const url = `/${item.pagePath}`
    Taro.switchTab({
      url,
    })
    globalThis.tabbarSelected = index
  }

  render() {
    return (
      <View className="bottom-tab" style={{ paddingBottom: `${blackHeight}px` }}>
        {this.state.list.map((item, index) => {
          return (
            <View
              className="bottom-tab-item"
              onClick={this.switchTab.bind(this, item, index)}
              data-path={item.pagePath}
              key={item.text}
            >
              <Image
                className="bottom-tab-item-img"
                src={this.state.selected === index ? item.selectedIconPath : item.iconPath}
              />
              <View
                className="bottom-tab-item-text"
                style={{
                  color: this.state.selected === index ? this.state.selectedColor : this.state.color,
                }}
              >
                {item.text}
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}
export default customTabBar
