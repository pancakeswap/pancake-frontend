import styled from 'styled-components'

interface StyledBannerImageProps {
  src: string
  alt?: string
}

const StyledBannerImage = styled.div.attrs<StyledBannerImageProps>(({ alt }) => ({
  alt,
}))<StyledBannerImageProps>`
  ${({ src, theme }) => (src ? `background-image: url('${src}')` : `background-color: ${theme.colors.cardBorder}`)};
  background-image: url('${({ src }) => src}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  flex: none;
  width: 100%;
  border-radius: 32px;
  height: 123px;

  ${({ theme }) => theme.mediaQueries.sm} {
    height: 192px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 256px;
  }
`

export default StyledBannerImage
