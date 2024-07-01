import { useTranslation } from '@pancakeswap/localization'
import { Box } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { Banner } from 'views/Quests/components/Banner'
import { Quests } from 'views/Quests/components/Quests'

export const QuestsView = () => {
  const { t } = useTranslation()

  // useEffect(() => {
  //   const fetchAPI = async () => {
  //     try {
  //       const token = 'token'
  //       const tokenSecret = 'token-secret'
  //       const userId = 'userId'
  //       const queryString = new URLSearchParams({ token, tokenSecret, userId }).toString()
  //       const requestUrl = `/api/twitter?${queryString}`
  //       await fetch(requestUrl)
  //         .then((response) => {
  //           if (!response.ok) {
  //             throw new Error('Network response was not ok')
  //           }
  //           return response.json()
  //         })
  //         .then((data) => {
  //           console.info(data) // Process the JSON response here
  //         })
  //         .catch((error) => {
  //           console.error('There was a problem with the fetch operation:', error)
  //         })
  //     } catch (error) {
  //       console.error('Error fetching followers:', error)
  //     }
  //   }

  //   fetchAPI()
  // }, [])

  return (
    <Box pb="200px">
      <Banner
        title={t('Explore Quests')}
        subTitle={t('Earn by contributing to the community')}
        bannerImageUrl={`${ASSET_CDN}/web/game/developers/game-banner-bunny.png`}
      />
      <Quests />
    </Box>
  )
}
