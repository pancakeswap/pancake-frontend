'use client'

const { whenDefined } = customElements

Object.defineProperty(customElements, 'whenDefined', {
  async value(name: string) {
    return whenDefined.call(this, name).then(() => this.get(name))
  },
})
