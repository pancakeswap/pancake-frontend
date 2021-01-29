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
  HelpIcon,
  OpenNewIcon,
} from '@pancakeswap-libs/uikit'
import useI18n from 'hooks/useI18n'
import { useProfile } from 'state/hooks'
import Menu from './components/Menu'
import CardHeader from './components/CardHeader'
import SecondaryCard from './components/SecondaryCard'
import Collectibles from './components/Collectibles'

const Avatar = styled.div`
  margin-right: 16px;
  width: 64px;

  & > img {
    border-radius: 50%;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 128px;
  }
`

const Content = styled.div`
  flex: 1;
`

const ComingSoon = styled(Flex)`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 192px;
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

  return (
    <>
      <Menu activeIndex={1} />
      <div>
        <Card>
          <CardHeader>
            <Flex alignItems={['start', null, 'center']} flexDirection={['column', null, 'row']}>
              <Avatar>
                <img src={`/images/nfts/${profile.nft.previewImage}`} alt={profile.username} />
              </Avatar>
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
            <SecondaryCard mb="24px">
              <Flex alignItems="start">
                <HelpIcon width="44px" mr="32px" />
                <div>
                  <Heading as="h3" size="xl">
                    {profile.numberPoints}
                  </Heading>
                  <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
                    {TranslateString(999, 'Points')}
                  </Text>
                </div>
              </Flex>
            </SecondaryCard>
            <Heading as="h4" size="md">
              {TranslateString(999, 'Achievements')}
            </Heading>
            <ComingSoon>
              <img src="/images/bunny-placeholder.svg" alt="Bunny Placeholder" />
              <Heading as="h5" size="md" color="textDisabled">
                {TranslateString(999, 'Coming Soon!')}
              </Heading>
            </ComingSoon>
            <Collectibles />
          </CardBody>
        </Card>
      </div>
    </>
  )
}

export default PublicProfile
