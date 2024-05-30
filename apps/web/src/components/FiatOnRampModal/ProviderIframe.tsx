import { CircleLoader, LoadingDot } from '@pancakeswap/uikit'
import { useTheme } from 'styled-components'
import { ONRAMP_PROVIDERS } from 'views/BuyCrypto/constants'
import { IFrameWrapper, StyledIframe } from 'views/BuyCrypto/styles'

interface IProviderIFrameProps {
  provider: keyof typeof ONRAMP_PROVIDERS
  loading: boolean
  signedIframeUrl: string
}

const LoadingBuffer = ({ loading }: { loading: boolean }) => {
  if (!loading) return <></>
  return (
    <IFrameWrapper justifyContent="center" alignItems="center" style={{ zIndex: 100 }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <LoadingDot />
        <CircleLoader />
      </div>
    </IFrameWrapper>
  )
}

export const ProviderIFrame = ({ provider, loading, signedIframeUrl }: IProviderIFrameProps) => {
  const theme = useTheme()
  const providerIframeId = `${ONRAMP_PROVIDERS[provider].toLowerCase()}_iframe`

  return (
    <>
      <LoadingBuffer loading={loading} />
      <StyledIframe
        id={providerIframeId}
        src={signedIframeUrl}
        title="fiat-onramp-iframe"
        isDark={theme.isDark}
        allow="camera;microphone;fullscreen;payment"
      />
    </>
  )
}
