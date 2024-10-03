import { ChevronDownIcon } from '@pancakeswap/uikit'
import { useLayoutEffect, useRef } from 'react'
import { styled } from 'styled-components'

const PADDING = 0

const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const ContentWrapper = styled.div``
const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transform: rotate(0deg);
  transition: transform 0.25s ease;
  cursor: pointer;
  &.open {
    transform: rotate(180deg);
  }
`

const Container = styled.div`
  overflow: hidden;
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: ${PADDING}px;
  will-change: height;
  transition: height 0.25s ease-in-out;
`
interface CollapseProps {
  title?: React.ReactNode
  content?: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
}

export const Collapse: React.FC<CollapseProps> = ({ title, content, isOpen, onToggle }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  useLayoutEffect(() => {
    if (!contentRef.current || !titleRef.current || !wrapperRef.current) return
    const titleElement = titleRef.current
    const contentElement = contentRef.current
    const wrapperElement = wrapperRef.current
    const contentHeight = contentElement.scrollHeight
    const titleHeight = titleElement.scrollHeight
    if (!isOpen) {
      wrapperElement.style.height = `${titleHeight + PADDING * 2}px`
    } else {
      wrapperElement.style.height = `${titleHeight + contentHeight + PADDING * 2}px`
    }
  }, [isOpen])
  return (
    <Container ref={wrapperRef}>
      <TitleWrapper
        ref={titleRef}
        onClick={() => {
          onToggle?.()
        }}
      >
        {title}
        <IconWrapper className={isOpen ? 'open' : undefined}>
          <ChevronDownIcon />
        </IconWrapper>
      </TitleWrapper>
      <ContentWrapper ref={contentRef}>{content}</ContentWrapper>
    </Container>
  )
}
