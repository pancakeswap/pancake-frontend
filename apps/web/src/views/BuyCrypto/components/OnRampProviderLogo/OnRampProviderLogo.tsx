import Image from 'next/image'
import { useTheme } from 'styled-components'
import { ProviderIcon } from 'views/BuyCrypto/Icons'
import { ONRAMP_PROVIDERS } from 'views/BuyCrypto/constants'
import MercuryoAltSvg from '../../../../../public/images/on-ramp-providers/mercuryo_new_logo_black.png'
import MercuryoAltSvgLight from '../../../../../public/images/on-ramp-providers/mercuryo_new_logo_white.png'

const OnRampProviderLogo = ({ provider }: { provider: string }) => {
  const theme = useTheme()
  return (
    <>
      {provider === ONRAMP_PROVIDERS.Mercuryo ? (
        <Image src={theme.isDark ? MercuryoAltSvgLight : MercuryoAltSvg} alt="#" width={80} />
      ) : (
        <ProviderIcon provider={provider} width="80px" isDisabled={false} />
      )}
    </>
  )
}

export default OnRampProviderLogo
