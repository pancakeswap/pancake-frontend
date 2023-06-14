import { Card, CardBody, Flex, Heading, ProfileAvatar, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import styled, { css } from 'styled-components'

interface CollectionCardProps {
  bgSrc: string
  avatarSrc?: string
  collectionName: string
  url?: string
  disabled?: boolean
}

export const CollectionAvatar = styled(ProfileAvatar)`
  left: 0;
  position: absolute;
  top: -32px;
  border: 4px white solid;
`

const StyledCollectionCard = styled(Card)<{ disabled?: boolean }>`
  border-radius: 8px;
  border-bottom-left-radius: 56px;
  transition: opacity 200ms;

  & > div {
    border-radius: 8px;
    border-bottom-left-radius: 56px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    ${({ disabled }) =>
      disabled
        ? ''
        : css`
            &:hover {
              cursor: pointer;
              opacity: 0.6;
            }
          `}
  }
`

const StyledImage = styled(Flex)<{ backgroundImageUrl: string }>`
  width: 100%;
  height: 125px;
  border-radius: 4px;
  background-size: cover;
  background-repeat: non-repeat;
  background-position: center;
  background-image: ${({ backgroundImageUrl }) => `url('${backgroundImageUrl}')`};
`

const CollectionCard: React.FC<React.PropsWithChildren<CollectionCardProps>> = ({
  bgSrc,
  avatarSrc,
  collectionName,
  url,
  disabled,
  children,
}) => {
  const renderBody = () => (
    <CardBody p="8px">
      <StyledImage backgroundImageUrl={bgSrc} />
      <Flex
        position="relative"
        height="65px"
        justifyContent="center"
        alignItems="flex-end"
        py="8px"
        flexDirection="column"
      >
        <CollectionAvatar src={avatarSrc} width={96} height={96} />
        <Heading color={disabled ? 'textDisabled' : 'body'} as="h3" mb={children ? '8px' : '0'}>
          {collectionName}
        </Heading>
        {children}
      </Flex>
    </CardBody>
  )

  return (
    <StyledCollectionCard disabled={disabled} data-test="hot-collection-card">
      {url ? (
        <NextLinkFromReactRouter to={url}>{renderBody()}</NextLinkFromReactRouter>
      ) : (
        <div style={{ cursor: 'default' }}>{renderBody()}</div>
      )}
    </StyledCollectionCard>
  )
}

export default CollectionCard
