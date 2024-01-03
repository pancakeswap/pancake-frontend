import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { Box, Flex, FlexProps, Link, ProfileAvatar, SubMenu, SubMenuItem, Text, useModal } from '@pancakeswap/uikit'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useDomainNameForAddress } from 'hooks/useDomain'
import { useStatModalProps } from 'state/predictions/hooks'
import { useProfileForAddress } from 'state/profile/hooks'
import { PredictionUser } from 'state/types'
import { styled } from 'styled-components'
import { getBlockExploreLink } from 'utils'
import WalletStatsModal from '../WalletStatsModal'

interface ResultAvatarProps extends FlexProps {
  user: PredictionUser
  token: Token | undefined
  api: string
}

const AvatarWrapper = styled(Box)`
  order: 2;
  margin-left: 8px;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 1;
    margin-left: 0;
    margin-right: 8px;
  }
`

const UsernameWrapper = styled(Box)`
  order: 1;

  ${({ theme }) => theme.mediaQueries.lg} {
    order: 2;
  }
`

const ResultAvatar: React.FC<React.PropsWithChildren<ResultAvatarProps>> = ({ user, token, api, ...props }) => {
  const { t } = useTranslation()
  const { profile, isLoading: isProfileLoading } = useProfileForAddress(user.id)
  const { domainName, avatar } = useDomainNameForAddress(user.id, !profile && !isProfileLoading)
  const { address, leaderboardLoadingState } = useStatModalProps({
    account: user.id,
    api,
    tokenSymbol: token?.symbol ?? '',
  })

  const [onPresentWalletStatsModal] = useModal(
    <WalletStatsModal
      api={api}
      token={token}
      result={user}
      address={address}
      leaderboardLoadingState={leaderboardLoadingState}
    />,
    true,
    false,
    'ResultAvatarWalletStatsModal',
  )

  return (
    <SubMenu
      component={
        <Flex alignItems="center" {...props}>
          <UsernameWrapper>
            <Text color="primary" fontWeight="bold">
              {profile?.username || domainName || truncateHash(user.id)}
            </Text>{' '}
          </UsernameWrapper>
          <AvatarWrapper
            width={['32px', null, null, null, null, '40px']}
            height={['32px', null, null, null, null, '40px']}
          >
            <ProfileAvatar src={profile?.nft?.image?.thumbnail ?? avatar} height={40} width={40} />
          </AvatarWrapper>
        </Flex>
      }
      options={{ placement: 'bottom-start' }}
    >
      <SubMenuItem onClick={onPresentWalletStatsModal}>{t('View Stats')}</SubMenuItem>
      <SubMenuItem
        as={Link}
        href={getBlockExploreLink(user.id, 'address', token?.chainId)}
        bold={false}
        color="text"
        external
      >
        {t('View on %site%', { site: t('Explorer') })}
      </SubMenuItem>
    </SubMenu>
  )
}

export default ResultAvatar
