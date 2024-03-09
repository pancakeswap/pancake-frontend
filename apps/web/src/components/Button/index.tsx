// import "./index.style.css";

import { styled } from 'styled-components'

const Wrapper = styled.div`
  &.sensei__button {
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
    border-radius: 8px;
    height: 48px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  &.sensei__button--md {
    height: 42px;
  }
  &.sensei__button--sm {
    height: 32px;
  }

  &.sensei__button--colorful {
    background: linear-gradient(117.43deg, #f98f12 18.55%, #dfc051 104.57%);
  }
  &.sensei__button--black {
    background-color: rgba(18, 18, 18, 1);
    color: #fff;
  }
  &.sensei__button--black:hover {
    background: rgba(74, 74, 76, 1);
  }
  &.sensei__button--gray {
    background: #4a4a4c;
  }
  &.sensei__button--gray:hover {
    color: rgba(26, 26, 26, 1);
    border: 1px solid rgba(255, 255, 255, 0.48);
    background: linear-gradient(0deg, #ffcc47, #ffcc47),
      linear-gradient(0deg, rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0.48));
  }
  &.sensei__button--primary {
    background: rgba(255, 204, 71, 1);
    color: rgba(26, 26, 26, 1);
    font-weight: 500;
  }
  &.sensei__button--primary:hover::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.25);
    pointer-events: none;
  }
  &.sensei__button--transparent {
    background: transparent;
    font-weight: 500;
    border: 1px solid rgba(74, 74, 76, 1);
  }
  &.sensei__button--transparent:hover {
    border: 1px solid rgba(255, 255, 255, 0.48);
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0.48)),
      linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2));
  }
`
type IButtonProps = {
  children: string | JSX.Element
  style?: React.CSSProperties
  size?: 'sm' | 'md'
  type?: 'transparent' | 'colorful' | 'black' | 'primary' | 'gray'
  onClick?: () => void
}
export default function Button({ children, style, size, type = 'primary', onClick = () => {} }: IButtonProps) {
  const sizeClass = size ? `sensei__button--${size}` : ''
  const typeClass = type ? `sensei__button--${type}` : ''
  return (
    <Wrapper onClick={() => onClick()} style={style} className={`sensei__button ${sizeClass} ${typeClass}`}>
      {children}
    </Wrapper>
  )
}
