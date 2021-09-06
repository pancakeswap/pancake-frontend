import styled from 'styled-components'

const AvatarImage = styled.div<{ src: string; borderColor?: string }>`
  background: url('${({ src }) => src}');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  width: 104px;
  height: 104px;
  border: 4px ${({ borderColor }) => borderColor || '#f2ecf2'} solid;

  & > img {
    border-radius: 50%;
  }
`

export default AvatarImage
