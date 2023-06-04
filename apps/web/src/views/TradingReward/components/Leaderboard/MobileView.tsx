import styled from 'styled-components'
import { PaginationButton, Box, Text, Flex, ProfileAvatar } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const StyledMobileRow = styled(Box)`
  background-color: ${({ theme }) => theme.card.background};
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};

  &:first-child {
    border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  }
`

interface MobileViewProps {
  currentPage: number
  maxPage: number
  setCurrentPage: (value: number) => void
}

const MobileView: React.FC<React.PropsWithChildren<MobileViewProps>> = ({ currentPage, maxPage, setCurrentPage }) => {
  const { t } = useTranslation()

  return (
    <Box>
      <StyledMobileRow p="16px">
        <Flex justifyContent="space-between" mb="16px">
          <Text fontWeight="bold" color="secondary" mr="auto">
            #12
          </Text>
          <Flex width="100%" justifyContent="flex-end">
            <Text color="primary" fontWeight="bold" style={{ alignSelf: 'center' }} mr="8px">
              0x123...223
              {/* {profile?.username || domainName || truncateHash(user.id)} */}
            </Text>
            <ProfileAvatar
              src="https://static-nft.pancakeswap.com/mainnet/0xDf7952B35f24aCF7fC0487D01c8d5690a60DBa07/twinkle-1000.png"
              height={32}
              width={32}
            />
          </Flex>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center" mb="16px">
          <Text fontSize="12px" color="textSubtle" mr="auto">
            {t('Total Reward')}
          </Text>
          <Box>
            <Text bold textAlign="right">
              $2,534.23
            </Text>
            <Text fontSize="12px" color="textSubtle" textAlign="right" lineHeight="110%">
              ~1123 CAKE
            </Text>
          </Box>
        </Flex>
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="12px" color="textSubtle" mr="auto">
            {t('Trading Volume')}
          </Text>
          <Text fontWeight="bold" textAlign="right">
            $2,534.23
          </Text>
        </Flex>
      </StyledMobileRow>
      <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
    </Box>
  )
}

export default MobileView
