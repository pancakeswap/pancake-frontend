/* eslint-disable @next/next/no-img-element */
import { getTemplatePath } from 'config'

export function VotingOgImage({ title }: { title: string }) {
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <img src={getTemplatePath('voting')} width={800} height={450} alt="voting-background" />
      <div
        style={{
          display: 'flex',
          position: 'absolute',
          fontWeight: 600,
          fontSize: '40px',
          left: '47px',
          top: '126px',
          maxWidth: '448px',
          color: 'white',
          textShadow: '0px 3px 0px rgba(0, 0, 0, 0.5)',
          textTransform: 'uppercase',
          wordBreak: 'break-word',
        }}
      >
        {title}
      </div>
    </div>
  )
}
