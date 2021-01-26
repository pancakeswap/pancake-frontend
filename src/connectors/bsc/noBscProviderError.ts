class NoBscProviderError extends Error {
  public constructor() {
    super()
    this.name = this.constructor.name
    this.message = 'No BSC provider was found on window.BinanceChain.'
  }
}

export default NoBscProviderError