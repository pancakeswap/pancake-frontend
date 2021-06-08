import React from 'react'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
import {
  Card,
  CardBody,
  CheckmarkCircleIcon,
  Flex,
  Heading,
  Link,
  Tag,
  Text,
  PrizeIcon,
  OpenNewIcon,
  BlockIcon,
  VisibilityOn,
  VisibilityOff,
} from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { useProfile } from 'state/hooks'
import usePersistState from 'hooks/usePersistState'
import { getBscScanAddressUrl } from 'utils/bscscan'
import Menu from './components/Menu'
import CardHeader from './components/CardHeader'
import Collectibles from './components/Collectibles'
import WalletNotConnected from './components/WalletNotConnected'
import StatBox from './components/StatBox'
import EditProfileAvatar from './components/EditProfileAvatar'
import AchievementsList from './components/AchievementsList'

const Content = styled.div`
  flex: 1;
  padding: 16px 0;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0 16px;
  }
`

const Username = styled(Heading)`
  font-size: 16px;
  line-height: 24px;
  margin-bottom: 8px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 40px;
    line-height: 44px;
  }
`

const Status = styled.div`
  position: absolute;
  right: 24px;
  top: 24px;
`

const ResponsiveText = styled(Text)`
  font-size: 12px;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
  }
`

const AddressLink = styled(Link)`
  display: inline-block;
  font-weight: 400;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 80px;
  white-space: nowrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    font-size: 16px;
    width: auto;
  }
`

const Section = styled.div`
  margin-bottom: 40px;
`

const PublicProfile = () => {
  const { account } = useWeb3React()
  const { profile } = useProfile()
  const [usernameVisibilityToggled, setUsernameVisibility] = usePersistState(false, {
    localStorageKey: 'username_visibility_toggled',
  })
  const { t } = useTranslation()

  if (!account) {
    return <WalletNotConnected />
  }

  const toggleUsernameVisibility = () => {
    setUsernameVisibility(!usernameVisibilityToggled)
  }

  const { username, team, isActive, points } = profile

  const Icon = usernameVisibilityToggled ? VisibilityOff : VisibilityOn

  return (
    <>
      <Menu activeIndex={1} />
      <div>
        <Card>
          <CardHeader>
            <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
              <EditProfileAvatar profile={profile} />
              <Content>
                <Flex alignItems="center">
                  <Username>@{usernameVisibilityToggled ? username : username.replace(/./g, '*')}</Username>
                  <Icon ml="4px" onClick={toggleUsernameVisibility} cursor="pointer" />
                </Flex>
                <Flex alignItems="center">
                  <AddressLink href={getBscScanAddressUrl(account)} color="text" external>
                    {account}
                    <OpenNewIcon ml="4px" />
                  </AddressLink>
                </Flex>
                <ResponsiveText bold>{team.name}</ResponsiveText>
              </Content>
            </Flex>
            <Status>
              {isActive ? (
                <Tag startIcon={<CheckmarkCircleIcon width="18px" />} outline>
                  {t('Active')}
                </Tag>
              ) : (
                <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                  {t('Paused')}
                </Tag>
              )}
            </Status>
          </CardHeader>
          <CardBody>
            <StatBox icon={PrizeIcon} title={points} subtitle={t('Points')} mb="24px" />
            <Section>
              <Heading as="h4" scale="md" mb="16px">
                {t('Achievements')}
              </Heading>
              <AchievementsList />
            </Section>
            <Collectibles />
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default PublicProfile
