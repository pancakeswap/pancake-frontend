import styled from 'styled-components'
import { Flex, Text, Skeleton } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledIfoVestingFooter = styled(Flex)`
  padding: 16px;
  margin: 0 -12px -12px;
  background-color: ${({ theme }) => theme.colors.background};
`

export interface FooterEntryProps {
  label: string
  value: string
}

const FooterEntry: React.FC<FooterEntryProps> = ({ label, value }) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text bold fontSize="12px" color="textSubtle" textTransform="uppercase">
        {label}
      </Text>
      {value ? (
        <Text bold small textAlign="right">
          {value}
        </Text>
      ) : (
        <Skeleton height={21} width={80} />
      )}
    </Flex>
  )
}

const IfoVestingFooter: React.FC = () => {
  const { t } = useTranslation()
  return (
    <StyledIfoVestingFooter flexDirection="column">
      <FooterEntry label="Release rate" value="0.123 per second" />
      <FooterEntry label="fully released date" value="Apr 29 2022 13:54:12" />
    </StyledIfoVestingFooter>
  )
}

export default IfoVestingFooter
