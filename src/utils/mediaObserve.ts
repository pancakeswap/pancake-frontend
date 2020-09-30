type Media = 'isMobile' | 'isTablet' | 'isPC' | 'isDark'
export type MediaMap = Partial<Record<Media, boolean>>;
export type MediaQueryMap = Partial<Record<Media, string>>;

const mediaMap: MediaQueryMap = {
  isDark: '(prefers-color-scheme: dark)'
}

type SubscribeFunc = (screens: MediaMap) => void;

let medias = {}
const subscribers: SubscribeFunc[] = []

const mediaObserve = {
  matchHandlers: {},
  dispatch(newMedias: MediaMap) {
    medias = newMedias
    subscribers.forEach(sub => {
      sub(medias)
    })
  },
  subscribe(fn: SubscribeFunc) {
    if (subscribers.length === 0) {
      this.register()
    }
    subscribers.push(fn)
    fn(medias)

    return () => {
      const index = subscribers.indexOf(fn)
      if (index > -1) {
        subscribers.splice(index, 1)
      }
      if (subscribers.length === 0) this.unregister()
    }
  },
  register() {
    Object.keys(mediaMap).forEach((m: string) => {
      const media = mediaMap[m as Media]
      const mql = window.matchMedia(media)
      const listener = ({ matches }: { matches: boolean }) => {
        this.dispatch({
          ...medias,
          [m]: matches
        })
      }
      mql.addListener(listener)
      this.matchHandlers[media] = {
        mql,
        listener
      }
      listener(mql)
    })
  },
  unregister() {
    Object.keys(mediaMap).forEach((m: string) => {
      const media = mediaMap[m as Media]
      const handler = this.matchHandlers[media]
      if (handler && handler.mql) {
        handler.mql.removeListener(handler.listener)
      }
    })
  }
}

export default mediaObserve
