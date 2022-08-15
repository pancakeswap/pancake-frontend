import { Svg, SvgProps } from '@pancakeswap/uikit'

const TicketCard: React.FC<React.PropsWithChildren<SvgProps>> = (props) => {
  return (
    <Svg viewBox="0 0 296 121" {...props}>
      <g filter="url(#filter0_dd_ticket_purchase_card)">
        <path d="M4 16C4 7.16344 11.1634 0 20 0H66V113H20C11.1634 113 4 105.837 4 97V16Z" fill="#A881FC" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M69.4931 2.94568C68.9511 1.38001 67.6569 0 66 0V10H90V0C88.3431 0 87.0489 1.38001 86.5069 2.94568C85.2868 6.4696 81.9389 9 78 9C74.0611 9 70.7132 6.4696 69.4931 2.94568Z"
          fill="#A881FC"
        />
        <rect x="66" y="10" width="10" height="93" fill="#A881FC" />
        <path d="M78 103V10" stroke="#A881FC" strokeWidth="4" strokeDasharray="4 4" />
        <rect x="80" y="10" width="10" height="93" fill="#A881FC" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M69.4931 110.054C68.9511 111.62 67.6569 113 66 113V103H90V113C88.3431 113 87.0489 111.62 86.5069 110.054C85.2868 106.53 81.9389 104 78 104C74.0611 104 70.7132 106.53 69.4931 110.054Z"
          fill="#A881FC"
        />
        <path d="M90 0H276C284.837 0 292 7.16344 292 16V97C292 105.837 284.837 113 276 113H90V0Z" fill="#A881FC" />
      </g>
      <defs>
        <filter
          id="filter0_dd_ticket_purchase_card"
          x="0"
          y="0"
          width="296"
          height="121"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="2" dy="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.637669 0 0 0 0 0.458333 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_ticket_purchase_card" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_ticket_purchase_card"
            result="effect2_dropShadow_ticket_purchase_card"
          />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_ticket_purchase_card" result="shape" />
        </filter>
      </defs>
    </Svg>
  )
}

export default TicketCard
