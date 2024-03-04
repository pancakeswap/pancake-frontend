import { styled } from 'styled-components'

const Wrapper = styled.div`
  padding: 0 8px;
  height: 24px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 16px;
  line-height: 24px;
`

export default function Tag({
  bgColor,
  color,
  children,
  style = {},
}: {
  bgColor: string
  color: string
  children: React.ReactNode
  style?: React.CSSProperties
}) {
  return (
    <Wrapper
      // className=" px-2 h-6 rounded-xl font-bold text-base leading-6"
      style={{
        ...style,
        backgroundColor: bgColor,
        color,
      }}
    >
      {children}
    </Wrapper>
  )
}
