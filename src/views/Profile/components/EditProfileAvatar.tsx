import styled from 'styled-components'
import { useModal } from '@pancakeswap/uikit'
import AvatarImage from 'views/Nft/market/components/BannerHeader/AvatarImage'
import EditProfileModal from './EditProfileModal'

const EditOverlay = styled.div`
  background: rgba(0, 0, 0, 0.6) url('/images/camera.svg') no-repeat center center;
  border-radius: 50%;
  left: 0;
  height: 100%;
  opacity: 0;
  position: absolute;
  top: 0;
  transition: opacity 300ms;
  width: 100%;
  z-index: 1;
`

const StyledEditProfileAvatar = styled.div`
  position: relative;

  &:hover {
    cursor: pointer;

    ${EditOverlay} {
      opacity: 1;
    }
  }
`

const EditProfileAvatar: React.FC<React.PropsWithChildren<{ src: string; alt?: string; onSuccess: () => void }>> = ({
  src,
  alt,
  onSuccess,
}) => {
  const [onEditProfileModal] = useModal(<EditProfileModal onSuccess={onSuccess} />, false)

  return (
    <StyledEditProfileAvatar onClick={onEditProfileModal}>
      <AvatarImage src={src} alt={alt} />
      <EditOverlay />
    </StyledEditProfileAvatar>
  )
}

export default EditProfileAvatar
