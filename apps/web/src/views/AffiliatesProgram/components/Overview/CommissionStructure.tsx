import styled from 'styled-components'
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

  ${CardInner} {
    &:first-child {
      ${StyledContainer} {
        border-right: ${({ theme }) => `solid 1px ${theme.colors.inputSecondary}`};
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
          {t('Commission structure')}
        </Text>
        <Text color="textSubtle" mb={['48px']}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
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
