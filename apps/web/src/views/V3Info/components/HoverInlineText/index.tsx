import { Text, useTooltip } from '@pancakeswap/uikit'
import styled from 'styled-components'

const TextWrapper = styled.div<{
  margin: boolean
  link: boolean
  color?: string
  fontSize?: string
  adjustSize?: boolean
}>`
  position: relative;
  margin-left: ${({ margin }) => margin && '4px'};
  color: ${({ theme, link, color }) => (link ? theme.colors.primary : color ?? theme.colors.text)};
  font-size: ${({ fontSize }) => fontSize ?? 'inherit'};

  :hover {
    cursor: pointer;
  }

  @media screen and (max-width: 600px) {
    font-size: ${({ adjustSize }) => adjustSize && '12px'};
  }
`

const HoverInlineText = ({
  text,
  maxCharacters = 20,
  margin = false,
  adjustSize = false,
  fontSize,
  color,
  link,
  ...rest
}: {
  text: string
  maxCharacters?: number
  margin?: boolean
  adjustSize?: boolean
  fontSize?: string
  color?: string
  link?: boolean
}) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<Text>{text}</Text>, {
    placement: 'right-end',
    trigger: 'click',
  })

  if (!text) {
    return <span />
  }

  if (text.length > maxCharacters) {
    return (
      <>
        <TextWrapper
          margin={margin}
          adjustSize={adjustSize}
          link={!!link}
          color={color}
          fontSize={fontSize}
          {...rest}
          ref={targetRef}
        >
          {` ${text.slice(0, maxCharacters - 1)}...`}
        </TextWrapper>
        {tooltipVisible && tooltip}
      </>
    )
  }

  return (
    <TextWrapper color={color} margin={margin} adjustSize={adjustSize} link={!!link} fontSize={fontSize} {...rest}>
      {text}
    </TextWrapper>
  )
}

export default HoverInlineText
