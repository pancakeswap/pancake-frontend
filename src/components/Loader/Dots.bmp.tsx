import styled, { keyframes } from 'styled-components'

const ellipsis = keyframes`
0% {
    content: '.';
  }
  33% {
    content: '..';
  }
  66% {
    content: '...';
  }
`
const Dots = styled.div`
  &::after {
    display: inline-block;
    animation: ${ellipsis} 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
`

export default Dots
