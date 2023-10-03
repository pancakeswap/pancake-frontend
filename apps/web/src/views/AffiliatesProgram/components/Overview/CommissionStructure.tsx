import { styled } from 'styled-components'
import { Flex, Text, Box, Image } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import commissionList from 'views/AffiliatesProgram/utils/commisionList'

const CardInner = styled(Flex)`
  width: 200px;
  flex-direction: column;
`

const StyledContainer = styled(Flex)`
  flex-direction: column;
  align-items: center;
`

const StyledCommission = styled(Flex)`
  justify-content: center;
  flex-direction: column;
  align-items: center;

  ${CardInner} {
    margin-bottom: 25px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    align-items: flex-start;

    ${CardInner} {
      margin-bottom: 0px;
      ${StyledContainer} {
        border-right: ${({ theme }) => `solid 1px ${theme.colors.inputSecondary}`};
      }

      &:last-child {
        ${StyledContainer} {
          border: 0;
        }
      }
    }
  }
`

const CommissionStructure = () => {
  const { t } = useTranslation()

  return (
    <Box mt={['92px']}>
      <Flex flexDirection="column" alignItems={['center']}>
        <Text fontSize={['20px']} mb={['16px']} bold color="secondary">
          {t('Commission Structure')}
        </Text>
        <Text color="textSubtle" mb={['24px', '24px', '48px']} textAlign="center">
          {t('Invite and earn commission for every successful referral')}
        </Text>
      </Flex>
      <StyledCommission>
        {commissionList.map((list) => (
          <CardInner key={list.image.url}>
            <Image m="auto auto 20px auto" width={list.image.width} height={list.image.height} src={list.image.url} />
            <StyledContainer>
              <Text fontSize="12px" bold color="secondary" textTransform="uppercase">
                {list.title}
              </Text>
              <Text fontSize={['32px']} bold>
                {list.percentage}
              </Text>
            </StyledContainer>
          </CardInner>
        ))}
      </StyledCommission>
    </Box>
  )
}

export default CommissionStructure
