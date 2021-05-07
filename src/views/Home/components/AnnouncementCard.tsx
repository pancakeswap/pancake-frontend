import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from '@rug-zombie-libs/uikit'
import { useTranslation } from 'contexts/Localization'
import { Tweet } from 'react-twitter-widgets'

const TwitterContainer = () => {
  return (
    <section className='twitterContainer'>
      <div className='twitter-embed' style={{
        maxHeight: '300px',
        overflow: 'scroll',
      }}>
        <Tweet
          options={{
            height: '50px',
            theme: 'dark',
          }}
          tweetId='1384305958373892103'

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
