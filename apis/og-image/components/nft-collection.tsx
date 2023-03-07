/* eslint-disable @next/next/no-img-element */
import { getTemplatePath } from 'config'

export function NFTCollectionOgImage({
  title,
  volume,
  collectionId,
}: {
  title: string
  volume: string
  collectionId: string
}) {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <img src={getTemplatePath('nft-collection')} width={800} height={450} alt="nft-background" />
      <img
        width={501}
        height={175.5}
        style={{
          position: 'absolute',
          top: '128.3px',
          left: '139px',
        }}
        alt="nft-collection-banner"
        src={`https://static-nft.pancakeswap.com/mainnet/${collectionId}/banner-lg.png`}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'absolute',
          top: '334px',
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            color: 'white',
            textShadow: '0px 3px 0px rgba(0, 0, 0, 0.5)',
            textTransform: 'uppercase',
            fontSize: '32px',
            fontWeight: 600,
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: 'flex',
            color: 'white',
            textShadow: '0px 3px 0px rgba(0, 0, 0, 0.5)',
            fontSize: '28px',
            fontWeight: 600,
          }}
        >
          Volume {volume}
        </div>
      </div>
    </div>
  )
}
