import { useTranslation } from '@pancakeswap/localization'
import { ArrowFirstIcon, Box, Button, Flex, Text } from '@pancakeswap/uikit'
import { useState } from 'react'
import ImageUploading, { ImageListType } from 'react-images-uploading'
import { styled } from 'styled-components'

const StyledThumbnail = styled('div')`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`

const EmptyContainer = styled(Flex)`
  flex-direction: column;
  border-radius: 16px;
  justify-content: center;
  padding: 60px 30px;
  border: dashed 2px ${({ theme }) => theme.colors.cardBorder};

  ${({ theme }) => theme.mediaQueries.xxl} {
    flex-direction: row;
  }
`

export const ImageUpload = () => {
  const { t } = useTranslation()
  const [images, setImages] = useState<ImageListType>([])

  const onChange = (imageList: ImageListType) => {
    setImages(imageList)
  }

  return (
    <Box>
      <ImageUploading value={images} onChange={onChange} dataURLKey="data_url">
        {({ imageList, onImageUpload, onImageUpdate }) => {
          return imageList[0] ? (
            <>
              <Flex justifyContent="space-between" mb="8px">
                <Text color="textSubtle" style={{ alignSelf: 'center' }}>
                  {images?.[0]?.file?.name}
                </Text>
                <Button
                  paddingRight={0}
                  variant="text"
                  endIcon={
                    <ArrowFirstIcon style={{ transform: 'rotate(-90deg)' }} color="primary" width={20} height={20} />
                  }
                  onClick={() => onImageUpdate(0)}
                >
                  {t('Upload New')}
                </Button>
              </Flex>
              <Box overflow="hidden" borderRadius="16px" height={['162px', '261px', '261px', '261px', '378px']}>
                <StyledThumbnail
                  className="thumbnail"
                  style={{
                    backgroundImage: `url(${images?.[0]?.data_url})`,
                  }}
                />
              </Box>
            </>
          ) : (
            <EmptyContainer>
              <Button
                variant="text"
                endIcon={
                  <ArrowFirstIcon style={{ transform: 'rotate(-90deg)' }} color="primary" width={20} height={20} />
                }
                onClick={onImageUpload}
              >
                {t('Upload New')}
              </Button>
              <Text style={{ alignSelf: 'center' }} color="textSubtle">
                {t('JPEG or PNG smaller than 2mb')}
              </Text>
            </EmptyContainer>
          )
        }}
      </ImageUploading>
    </Box>
  )
}
