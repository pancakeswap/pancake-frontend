/* eslint-disable @next/next/no-img-element */
import { getTemplatePath } from 'config'

export function SwapOgImage({
  inputSymbol,
  outputSymbol,
  inputImage,
  outputImage,
}: {
  inputSymbol: string
  outputSymbol: string
  inputImage: string
  outputImage: string
}) {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <img src={getTemplatePath('swap')} width={800} height={450} alt="swap-background" />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          fontWeight: 600,
          fontSize: '42px',
          lineHeight: '42px',
          maxWidth: '300px',
          left: '60px',
          top: '270px',
          wordBreak: 'break-all',
        }}
      >
        {inputSymbol}/{outputSymbol}
      </div>
      {inputImage && (
        <div
          style={{
            background: 'linear-gradient(227.56deg, #FFFFFF 8.85%, rgba(255, 255, 255, 0) 104.08%)',
            width: '141px',
            height: '141px',
            position: 'absolute',
            top: '76px',
            right: '222px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
            transform: 'rotate(15deg)',
          }}
        >
          <img src={inputImage} width={125} height={125} alt={inputSymbol} />
        </div>
      )}
      {outputImage && (
        <div
          style={{
            background: 'linear-gradient(342.5deg, #FFFFFF 3.21%, rgba(255, 255, 255, 0) 112.29%)',
            transform: 'rotate(-12deg)',
            width: '141px',
            height: '141px',
            position: 'absolute',
            top: '145px',
            right: '114px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '50%',
          }}
        >
          <img src={outputImage} width={125} height={125} alt={outputSymbol} />
        </div>
      )}
    </div>
  )
}
