type Handler = (...evts: any[]) => void

export type EventEmitter = {
  on(type: string, handler: Handler): void
  once(type: string, handler: Handler): void
  off(type: string, handler?: Handler): void
  emit(type: string, ...evts: any[]): void
}

export default function emitter(): EventEmitter {
  const all: { [s: string]: Handler[] } = Object.create(null)

  return {
    on(type: string, handler: Handler) {
      (all[type] || (all[type] = [])).push(handler)
    },

    once(type: string, handler: Handler) {
      const onceHandler = () => {
        this.off(type, onceHandler)
        handler()
      }
      this.on(type, handler)
    },

    off(type: string, handler?: Handler) {
      if (all[type]) {
        if (handler) {
          const index = all[type].indexOf(handler)
          if (index >= 0) {
            all[type].splice(index, 1)
          }
        } else {
          all[type].length = 0
        }
      }
    },

    emit(type: string, ...evts: any[]) {
      (all[type] || []).slice().forEach((handler: Handler) => {
        handler(...evts)
      })
    },
  }
}
