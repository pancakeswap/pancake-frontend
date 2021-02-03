import React from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Link as RouterLink } from 'react-router-dom'
import {
  Card,
  CardBody,
  CheckmarkCircleIcon,
  ChevronLeftIcon,
  Flex,
  Heading,
  Link,
  Tag,
  Text,
  PrizeIcon,
  OpenNewIcon,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useProfile } from 'state/hooks'
import Menu from './components/Menu'
import CardHeader from './components/CardHeader'
import Collectibles from './components/Collectibles'
import ComingSoon from './components/ComingSoon'
import WalletNotConnected from './components/WalletNotConnected'
import StatBox from './components/StatBox'
import ProfileAvatar from './components/ProfileAvatar'

const Content = styled.div`
  flex: 1;
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

const PublicProfile = () => {
  const { account } = useWallet()
  const { profile } = useProfile()
  const TranslateString = useI18n()

  if (!account) {
    return <WalletNotConnected />
  }

  return (
    <>
      <Flex mb="24px">
        <RouterLink to="/teams">
          <Flex alignItems="center">
            <ChevronLeftIcon color="primary" />
            <Text color="primary">{TranslateString(999, 'Teams Overview')}</Text>
          </Flex>
        </RouterLink>
      </Flex>
      <Menu />
      <div>
        <Card>
          <CardHeader>
            <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
              <ProfileAvatar profile={profile} />
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
            {profile.isActive && (
              <Status>
                <Tag startIcon={<CheckmarkCircleIcon width="18px" />} outline>
                  {TranslateString(999, 'Active')}
                </Tag>
              </Status>
            )}
          </CardHeader>
          <CardBody>
            <StatBox icon={PrizeIcon} title={profile.points} subtitle={TranslateString(999, 'Points')} mb="24px" />
            <Heading as="h4" size="md">
              {TranslateString(999, 'Achievements')}
            </Heading>
            <ComingSoon />
            <Collectibles />
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default PublicProfile
