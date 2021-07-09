import React from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { Tweet } from 'react-twitter-widgets'

const TwitterContainer = () => {
  return (
    <section className='twitterContainer'>
      <div className='twitter-embed' style={{
        maxHeight: '320px',
        overflow: 'scroll',
      }}>
        <Tweet
          options={{
            width: '100%',
            height: '100%',
            theme: 'dark',
          }}
          tweetId='1410229586089156610'
        />
      </div>
    </section>
  )
}

const StyledAnnouncementCard = styled(Card)`
  background-size: 300px 300px;
  background-position-x: 100px;
  background-repeat: no-repeat;
  background-position: top right;
  min-height: 376px;
`

const AnnouncementCard = () => {
  const { t } = useTranslation()

  return (
    <StyledAnnouncementCard>
      <CardBody>
        <Heading size='xl' mb='24px'>
          {t('Announcements')}
        </Heading>
        <TwitterContainer />
      </CardBody>
    </StyledAnnouncementCard>
  )
}

export default AnnouncementCard
