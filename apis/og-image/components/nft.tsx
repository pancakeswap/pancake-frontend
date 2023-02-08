/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import { getTemplatePath } from 'config'

export function NFTOgImage({
  title,
  price,
  image,
  nativePrice,
}: {
  title: string
  price: string
  image: string
  nativePrice: string
}) {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <img src={getTemplatePath('nft')} width={800} height={450} alt="nft-background" />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          fontWeight: 600,
          fontSize: '42px',
          lineHeight: '42px',
          left: '88px',
          top: '126px',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            maxWidth: '300px',
            color: 'white',
            textShadow: '0px 3px 0px rgba(0, 0, 0, 0.5)',
            textTransform: 'uppercase',
            marginBottom: '42px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: '300px',
            color: 'white',
            textShadow: '0px 3px 0px rgba(0, 0, 0, 0.5)',
          }}
        >
          {nativePrice}
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: '300px',
            color: 'white',
            textShadow: '0px 3px 0px rgba(0, 0, 0, 0.5)',
          }}
        >
          (~{price})
        </div>
      </div>
      <img
        width={264}
        height={264}
        style={{
          position: 'absolute',
          top: '80px',
          left: '470px',
        }}
        src={image}
      />
    </div>
  )
}
