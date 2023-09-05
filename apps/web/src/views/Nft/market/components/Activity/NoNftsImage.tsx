import { styled } from 'styled-components'

const NoNftsImage = styled.div`
  background: url('/images/nfts/no-profile-md.png');
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  position: relative;
  width: 96px;
  height: 96px;

  & > img {
    border-radius: 50%;
  }
`

export default NoNftsImage
