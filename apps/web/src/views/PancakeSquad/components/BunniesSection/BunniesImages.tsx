/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react'
import { StyledBunnyImage, StyledImageContainer } from './styles'

type BunniesImages = {
  basePath: string
  altText: string
}

const BUNNIES_CYCLING_TIME = 2500

const BunniesImages: React.FC<React.PropsWithChildren<BunniesImages>> = ({ basePath, altText }) => {
  const bunnies = new Array(11).fill({})
  const [selectedBunny, setSelectedBunny] = useState(0)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSelectedBunny((selectedBunny + 1) % 11)
    }, BUNNIES_CYCLING_TIME)

    return () => clearTimeout(timeoutId)
  }, [selectedBunny])

  return (
    <StyledImageContainer
      mb={['24px', null, null, '-3px']}
      mr={['0', null, null, '64px']}
      width={['192px', null, '250px', '400px', '512px']}
      height={['192px', null, '250px', '400px', '512px']}
    >
      {bunnies.map((_, index) => (
        <StyledBunnyImage
          $isSelected={index === selectedBunny}
          key={index}
          src={`${basePath}${index}.png`}
          alt={`${altText} example ${index}`}
        />
      ))}
    </StyledImageContainer>
  )
}

export default BunniesImages
