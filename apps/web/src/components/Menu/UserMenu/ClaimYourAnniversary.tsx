import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'
import { Flex, UserMenuItem } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useShowOnceAnniversaryModal } from 'hooks/useShowOnceAnniversaryModal'

const Dot = styled.div`
  background-color: ${({ theme }) => theme.colors.success};
  border-radius: 50%;
  height: 8px;
  width: 8px;
`

const ClaimYourAnniversary = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const [showOnceAnniversaryModal, setShowOnceAnniversaryModal] = useShowOnceAnniversaryModal()

  return (
    <UserMenuItem
      as="button"
      onClick={() => setShowOnceAnniversaryModal({ ...showOnceAnniversaryModal, [account]: true })}
    >
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        {t('Claim Your NFT')}
        <Dot />
      </Flex>
    </UserMenuItem>
  )
}

export default ClaimYourAnniversary
