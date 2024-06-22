import { useTranslation } from '@pancakeswap/localization'
import { Box, Card, Text, useMatchBreakpoints } from '@pancakeswap/uikit'
import { styled } from 'styled-components'
import { CompletionStatusIndex } from 'views/DashboardQuestEdit/type'
import { Row } from 'views/DashboardQuests/components/Row'
import { TableHeader } from 'views/DashboardQuests/components/TableHeader'
import { AllSingleQuestData } from 'views/DashboardQuests/type'

const StyledRows = styled(Box)`
  > div {
    border-bottom: solid 1px ${({ theme }) => theme.colors.cardBorder};

    &:last-child {
      border-bottom: 0;

      .dropdown {
        border-radius: ${({ theme }) => `0 0 ${theme.radii.card} ${theme.radii.card}`};
      }
    }
  }
`

interface RecordsProps {
  isFetching: boolean
  questsData: AllSingleQuestData[]
  statusButtonIndex: CompletionStatusIndex
}

export const Records: React.FC<RecordsProps> = ({ isFetching, questsData, statusButtonIndex }) => {
  const { isDesktop } = useMatchBreakpoints()
  const { t } = useTranslation()

  return (
    <Box
      m="auto"
      width={['100%', '100%', '100%', '100%', '100%', '100%', '1200px']}
      padding={['24px', '24px', '24px', '24px', '40px 24px 0 24px', '40px 24px 0 24px', '40px 0 0 0']}
    >
      <Card style={{ width: '100%', overflow: 'inherit' }}>
        {isDesktop && <TableHeader />}
        {!isFetching && (
          <StyledRows>
            {isFetching ? (
              <Text padding="8px" textAlign="center">
                {t('Loading...')}
              </Text>
            ) : (
              <>
                {questsData.length === 0 ? (
                  <Text padding="8px" textAlign="center">
                    {t('No results')}
                  </Text>
                ) : (
                  <>
                    {questsData?.map((quest) => (
                      <Row key={quest.id} quest={quest} statusButtonIndex={statusButtonIndex} />
                    ))}
                  </>
                )}
              </>
            )}
          </StyledRows>
        )}
      </Card>
    </Box>
  )
}
