import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Heading, Card, CardBody, Button } from '@rug-zombie-libs/uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import UnlockButton from 'components/UnlockButton'
import CakeHarvestBalance from './CakeHarvestBalance'
import CakeWalletBalance from './CakeWalletBalance'

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
        <Heading size="xl" mb="24px">
          {t('Announcements')}
        </Heading>
      </CardBody>
    </StyledAnnouncementCard>
  )
}

export default AnnouncementCard
