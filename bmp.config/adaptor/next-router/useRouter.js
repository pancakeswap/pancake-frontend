import { useRouter as useTaroRouter } from '@tarojs/taro'

export const useRouter = () => {
  const router = useTaroRouter()
  router.query = router.params
  return router
}
