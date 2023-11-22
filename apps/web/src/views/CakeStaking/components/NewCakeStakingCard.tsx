import { useTranslation } from '@pancakeswap/localization'
import { AtomBox, Box, Button, HelpIcon, Link, Svg, SvgProps } from '@pancakeswap/uikit'
import styled from 'styled-components'

const SPEECH_BUBBLE_ID = 'cake-staking__speech-bubble'

const SpeechBubble: React.FC<SvgProps> = (props) => {
  return (
    <Svg id={SPEECH_BUBBLE_ID} viewBox="0 0 16 16" {...props}>
      <g id=".base speechbubble">
        <path
          id="Vector 772"
          d="M0.000488281 16V0C0.000488281 0 3.00049 1 6.00049 1C9.00049 1 16.0005 -2 16.0005 3.5C16.0005 10.5 7.50049 16 0.000488281 16Z"
          fill="#7A6EAA"
        />
      </g>
    </Svg>
  )
}

const SpeechBubbleBox = styled(Box)`
  #${SPEECH_BUBBLE_ID} {
    transition: background-color 0.2s, opacity 0.2s;
  }
  &:hover #${SPEECH_BUBBLE_ID} {
    opacity: 0.65;
  }
`

export const NewCakeStakingCard: React.FC = () => {
  const { t } = useTranslation()
  return (
    <AtomBox display="flex" alignItems="center">
      <Link href="https://docs.pancakeswap.finance/products/vecake/how-to-get-vecake">
        <SpeechBubbleBox>
          <Button variant="subtle" endIcon={<HelpIcon color="white" width="24px" />}>
            {t('New to CAKE Staking')}
          </Button>
          <SpeechBubble width="16px" height="16px" />
        </SpeechBubbleBox>
      </Link>
      <img src="/images/cake-staking/new-staking-bunny.png" alt="new-staking-bunny" width="138px" />
    </AtomBox>
  )
}
