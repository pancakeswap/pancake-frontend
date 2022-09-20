import { QRCodeSVG } from 'qrcode.react'

const QRCode = ({ url, image }: { url: string; image: string }) => (
  <QRCodeSVG
    value={url}
    size={288}
    level="H"
    includeMargin
    imageSettings={{
      src: image,
      x: undefined,
      y: undefined,
      height: 72,
      width: 72,
      excavate: true,
    }}
  />
)

export default QRCode
