import type { NextApiRequest, NextApiResponse } from 'next'
import { ImageResponse } from '@vercel/og'
// import { SwapOgImage } from 'components/swap'
// import { NFTOgImage } from 'components/nft'
import { VotingOgImage } from 'components/voting'
import { z } from 'zod'
import { FONT_BOLD, zTemplate } from '../../../config'

export const config = {
  runtime: 'edge',
}

const kanit600_ = fetch(new URL(FONT_BOLD, import.meta.url)).then((res) => res.arrayBuffer())

const zString = z.string()

// async function checkImages(images: string[]) {
//   if (images.length < 2) return false
//   const promises = images.map((image) => fetch(image).then((res) => res.status))
//   const statuses = await Promise.all(promises)
//   return statuses.every((status) => status === 200)
// }

// eslint-disable-next-line consistent-return
export default async function handler(req: NextApiRequest, res: NextApiResponse<ImageResponse>) {
  const kanit600 = await kanit600_

  const url = zString.parse(req?.url)
  const { searchParams } = new URL(url)
  const template_ = searchParams.get('template')
  const template = zTemplate.parse(template_)

  if (template === 'voting') {
    const title_ = searchParams.get('title')
    const title = zString.parse(title_)
    return new ImageResponse(<VotingOgImage title={title} />, {
      width: 800,
      fonts: [
        {
          data: kanit600,
          name: 'Kanit',
          weight: 600,
        },
      ],
      // debug: true,
      height: 450,
    })
  }

  res.redirect(301, 'https://assets.pancakeswap.finance/web/og/hero.jpg')
}
