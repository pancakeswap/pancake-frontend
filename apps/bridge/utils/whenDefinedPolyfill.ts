'use client'

if (typeof window !== 'undefined') {
  const { whenDefined } = window.customElements

  Object.defineProperty(window.customElements, 'whenDefined', {
    async value(name: string) {
      return whenDefined.call(this, name).then(() => this.get(name))
    },
  })
}
