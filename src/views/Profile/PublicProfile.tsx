import React from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
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
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useProfile } from 'state/hooks'
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
  const { account } = useWallet()
  const { profile } = useProfile()
  const TranslateString = useI18n()

  if (!account) {
    return <WalletNotConnected />
  }

  return (
    <>
      <Menu activeIndex={1} />
      <div>
        <Card>
          <CardHeader>
            <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
              <EditProfileAvatar profile={profile} />
              <Content>
                <Username>{`@${profile.username}`}</Username>
                <Flex alignItems="center">
                  <AddressLink href={`https://bscscan.com/address/${account}`} color="text" external>
                    {account}
                  </AddressLink>
                  <OpenNewIcon ml="4px" />
                </Flex>
                <ResponsiveText bold>{profile.team.name}</ResponsiveText>
              </Content>
            </Flex>
            <Status>
              {profile.isActive ? (
                <Tag startIcon={<CheckmarkCircleIcon width="18px" />} outline>
                  {TranslateString(698, 'Active')}
                </Tag>
              ) : (
                <Tag variant="failure" startIcon={<BlockIcon width="18px" />} outline>
                  {TranslateString(999, 'Paused')}
                </Tag>
              )}
            </Status>
          </CardHeader>
          <CardBody>
            <StatBox icon={PrizeIcon} title={profile.points} subtitle={TranslateString(999, 'Points')} mb="24px" />
            <Section>
              <Heading as="h4" size="md" mb="16px">
                {TranslateString(1092, 'Achievements')}
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
