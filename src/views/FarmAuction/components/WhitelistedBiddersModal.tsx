import { useState } from 'react'
import styled from 'styled-components'
import { Modal, Box, Text, Flex, Input, OpenNewIcon, Spinner, useMatchBreakpointsContext } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import { FarmAuctionBidderConfig } from 'config/constants/types'
import truncateHash from 'utils/truncateHash'
import useWhitelistedAddresses from '../hooks/useWhitelistedAddresses'

interface WhitelistedBiddersModalProps {
  onDismiss?: () => void
}

const StyledModal = styled(Modal)`
  & > div:nth-child(2) {
    padding: 0;
  }
`

const InputContainer = styled(Flex)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
`

const AddressRowContainer = styled.div`
  display: grid;
  grid-template-columns: 3fr 5fr 0.5fr;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  padding: 8px 24px;
  &:hover {
    cursor: pointer;
    opacity: 0.5;
  }
`

const AddressRow: React.FC<{ bidder: FarmAuctionBidderConfig; isMobile: boolean }> = ({ bidder, isMobile }) => {
  const { farmName, tokenName, account, projectSite } = bidder
  return (
    <a href={projectSite} target="_blank" rel="noopener noreferrer">
      <AddressRowContainer>
        <Flex flexDirection="column" flex="3">
          <Text>{farmName}</Text>
          <Text fontSize="12px" color="textSubtle">
            {tokenName}
          </Text>
        </Flex>
        <Flex justifyContent={['center', null, 'flex-start']} alignItems="center" flex="6">
          <Text mr="8px">{isMobile ? truncateHash(account) : account}</Text>
        </Flex>
        <OpenNewIcon color="primary" />
      </AddressRowContainer>
    </a>
  )
}

const WhitelistedBiddersModal: React.FC<WhitelistedBiddersModalProps> = ({ onDismiss }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { isMobile } = useMatchBreakpointsContext()
  const bidders = useWhitelistedAddresses()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredBidders = bidders
    ? bidders.filter(
        ({ farmName, tokenName, account }) =>
          farmName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tokenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          account.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const modalContent = bidders ? (
    filteredBidders.map((bidder) => <AddressRow key={bidder.account} bidder={bidder} isMobile={isMobile} />)
  ) : (
    <Flex justifyContent="center" alignItems="center" py="24px">
      <Spinner />
    </Flex>
  )

  return (
    <StyledModal
      p="0"
      title={t('All Whitelisted Project Wallets')}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <InputContainer py="16px" px="24px">
        <Input placeholder={t('Search address or token')} value={searchTerm} onChange={handleSearchChange} />
      </InputContainer>

      <Box pb="24px" overflow="scroll" maxHeight="245px">
        {modalContent}
      </Box>
    </StyledModal>
  )
}

export default WhitelistedBiddersModal
