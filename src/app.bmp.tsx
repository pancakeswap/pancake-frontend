import React, { Component } from 'react'
import Provider from './Providers'
import './style.scss'

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    const { children } = this.props
    return <Provider>{children}</Provider>
  }
}

export default App
