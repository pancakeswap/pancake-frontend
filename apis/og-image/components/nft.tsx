/* eslint-disable @next/next/no-img-element */
import { getTemplatePath } from 'config'

export function NFTOgImage({ title, image, price }: { title: string; price: string; image: string }) {
  return (
    <div
      style={{
        display: 'flex',
        // getTemplatePath('swap')
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
            backgroundImage: 'linear-gradient(180deg, #7645D9 0%, #612AD0 100%)',
            backgroundClip: 'text',
            // @ts-ignore
            '-webkit-background-clip': 'text',
            color: 'transparent',
            textTransform: 'uppercase',
          }}
        >
          Super Long Name of the NFT #112345
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: '300px',
            backgroundImage: 'linear-gradient(166.02deg, #FFB237 -5.1%, #FFEB37 75.24%)',
            backgroundClip: 'text',
            // @ts-ignore
            '-webkit-background-clip': 'text',
            color: 'transparent',
          }}
        >
          8.5 BNB
        </div>
        <div
          style={{
            display: 'flex',
            maxWidth: '300px',
            backgroundImage: 'linear-gradient(166.02deg, #FFB237 -5.1%, #FFEB37 75.24%)',
            backgroundClip: 'text',
            // @ts-ignore
            '-webkit-background-clip': 'text',
            color: 'transparent',
          }}
        >
          (~2,165.13 USD)
        </div>
      </div>
      <img
        width={266}
        height={266}
        style={{
          position: 'absolute',
          top: '86px',
          left: '469px',
        }}
        src="https://static-nft.pancakeswap.com/mainnet/0x0a8901b0E25DEb55A87524f0cC164E9644020EBA/pancake-squad-5219-1000.png"
      />
    </div>
  )
}
