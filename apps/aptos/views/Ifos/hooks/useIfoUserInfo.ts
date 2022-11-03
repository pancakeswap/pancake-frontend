import { useAccount, useAccountResources } from '@pancakeswap/awgmi'
import { ifos } from 'config/constants/ifo'
import { IFO_MODULE_NAME, IFO_ADDRESS } from 'views/Ifos/constants'
import { RootObject as UserInfo } from 'views/Ifos/generated/UserInfo'

const RAISING_COIN = ifos[0].currency.address
const OFFERING_COIN = ifos[0].token.address
const POOL_TYPE = `${IFO_ADDRESS}::${IFO_MODULE_NAME}::Pool0`

export const useIfoUserInfo = () => {
  const { account } = useAccount()

  return useAccountResources({
    enabled: !!account && !!ifos[0],
    address: account?.address,
    watch: true,
    select: (data) => {
      return data.find((it) => {
        return (
          it.type === `${IFO_ADDRESS}::${IFO_MODULE_NAME}::UserInfo<${RAISING_COIN}, ${OFFERING_COIN}, ${POOL_TYPE}>`
        )
      }) as UserInfo | undefined
    },
  })
}
