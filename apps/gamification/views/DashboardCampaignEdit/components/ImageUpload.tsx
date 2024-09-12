import { useTranslation } from '@pancakeswap/localization'
import { ArrowFirstIcon, Box, Button, Flex, Text } from '@pancakeswap/uikit'
// import { GAMIFICATION_API } from 'config/constants/endpoints'
import { useMemo, useState } from 'react'
import ImageUploading, { ImageListType, ImageType } from 'react-images-uploading'
import { styled } from 'styled-components'
import { useCampaignEdit } from 'views/DashboardCampaignEdit/context/useCampaignEdit'
// import { UploadImageType, ImageResponseDto } from 'views/DashboardCampaignEdit/type'

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

const ACCEPT_TYPE = ['jpeg', 'jpg', 'png']
const MAX_FILE_SIZE = 2000000 // 2000000 Bytes = 2 MB

export const ImageUpload = () => {
  const { t } = useTranslation()
  const { state } = useCampaignEdit()
  const [images, setImages] = useState<ImageListType>([])
  const base64Image = state.thumbnail.url
  const imageUrlDisplay = useMemo(() => images?.[0]?.data_url ?? base64Image ?? '', [base64Image, images])

  const onChange = async (imageList: ImageListType) => {
    const singleImage: ImageType = imageList[0]
    const imageType = singleImage?.file?.type?.split?.('/')?.[1] ?? ''
    const imageSize = singleImage?.file?.size ?? 0

    if (singleImage?.file && ACCEPT_TYPE.includes(imageType) && imageSize <= MAX_FILE_SIZE) {
      // const response = await fetch(`${GAMIFICATION_API}/images/upload`, {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     type: UploadImageType.CAMPAIGN,
      //     contentData: singleImage?.data_url,
      //   }),
      // })

      // const result: ImageResponseDto = await response.json()

      // updateValue('thumbnail', {
      //   id: result.id,
      //   url: singleImage?.data_url,
      // })
      setImages(imageList)
    }
  }

  return (
    <Box>
      <ImageUploading
        value={images}
        onChange={onChange}
        dataURLKey="data_url"
        acceptType={ACCEPT_TYPE}
        maxFileSize={MAX_FILE_SIZE}
      >
        {({ imageList, errors, onImageUpload, onImageUpdate }) => {
          return (
            <Flex flexDirection="column">
              {imageList[0] || imageUrlDisplay ? (
                <>
                  <Box>
                    <Flex justifyContent="space-between" mb="8px">
                      <Text ellipsis color="textSubtle" style={{ alignSelf: 'center' }}>
                        {images?.[0]?.file?.name}
                      </Text>
                      <Button
                        minWidth="145px"
                        paddingRight={0}
                        variant="text"
                        endIcon={
                          <ArrowFirstIcon
                            style={{ transform: 'rotate(-90deg)' }}
                            color="primary"
                            width={20}
                            height={20}
                          />
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
                          backgroundImage: `url(${imageUrlDisplay})`,
                        }}
                      />
                    </Box>
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
              )}
              <Text color="failure" mt="4px">
                {errors?.maxFileSize && <span>{t('Maximum upload file size 2 MB')}</span>}
                {errors?.acceptType && <span>{t('File type no supported. We accept JPG, JPEG, PNG.')}</span>}
              </Text>
            </Flex>
          )
        }}
      </ImageUploading>
    </Box>
  )
}
