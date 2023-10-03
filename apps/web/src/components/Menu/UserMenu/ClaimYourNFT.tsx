import { useTranslation } from '@pancakeswap/localization'
import { styled } from 'styled-components'
import { Flex, UserMenuItem } from '@pancakeswap/uikit'
import { useShowOnceAirdropModal } from 'hooks/useShowOnceAirdropModal'

const Dot = styled.div`
  background-color: ${({ theme }) => theme.colors.success};
  border-radius: 50%;
  height: 8px;
  width: 8px;
`

const ClaimYourNFT = () => {
  const { t } = useTranslation()
  const [_, setShowOnceAirdropModal] = useShowOnceAirdropModal()

  return (
    <UserMenuItem as="button" onClick={() => setShowOnceAirdropModal(true)}>
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        {t('Claim Your NFT')}
        <Dot />
      </Flex>
    </UserMenuItem>
  )
}

export default ClaimYourNFT
