import { useTranslation } from '@pancakeswap/localization'
import {
  BarChartIcon,
  Box,
  Card,
  Flex,
  Link,
  LogoRoundIcon,
  OpenNewIcon,
  Table,
  Td,
  Text,
  Th,
  useMatchBreakpoints,
} from '@pancakeswap/uikit'
import { useMemo } from 'react'

export const Record = () => {
  const { t } = useTranslation()
  const { isXxl, isXl, isDesktop, isTablet } = useMatchBreakpoints()

  const colSpanNumber = useMemo(() => {
    if (isXxl) {
      return 5
    }

    if (isTablet || isXl) {
      return 3
    }

    return 2
  }, [isTablet, isXl, isXxl])

  return (
    <Box
      m="auto"
      width={['100%', '100%', '100%', '100%', '100%', '100%', '1200px']}
      padding={['24px', '24px', '24px', '24px', '40px 24px 0 24px', '40px 24px 0 24px', '40px 0 0 0']}
    >
      <Card style={{ width: '100%' }}>
        <Table width="100%">
          {(isTablet || isDesktop) && (
            <thead>
              <tr>
                <Th>
                  <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                    {t('quest title')}
                  </Text>
                </Th>
                {isXxl && (
                  <>
                    <Th>
                      <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                        {t('total reward pool')}
                      </Text>
                    </Th>
                    <Th>
                      <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="right">
                        {t('questers')}
                      </Text>
                    </Th>
                  </>
                )}
                <Th>
                  <Text textAlign="right" fontSize="12px" bold textTransform="uppercase" color="secondary">
                    {t('Timeline')}
                  </Text>
                </Th>
                <Th />
              </tr>
            </thead>
          )}
          <tbody>
            {/* <tr>
              <Td colSpan={colSpanNumber} textAlign="center">
                {t('Loading...')}
              </Td>
            </tr>
            <tr>
              <Td colSpan={colSpanNumber} textAlign="center">
                {t('No results')}
              </Td>
            </tr> */}
            <>
              <tr>
                <Td>
                  <Text bold>PancakeSwap Multichain Celebration - zkSync Era</Text>
                </Td>
                {isXxl && (
                  <>
                    <Td>
                      <Flex>
                        <LogoRoundIcon width="20px" />
                        <Text ml="8px">400 CAKE</Text>
                      </Flex>
                    </Td>
                    <Td>
                      <Text textAlign="right">2400</Text>
                    </Td>
                  </>
                )}
                {(isTablet || isDesktop) && (
                  <Td>
                    <Text textAlign="right">12/12/2024 03:30 - 12/12/2024 03:30</Text>
                  </Td>
                )}
                <Td>
                  <Flex>
                    <Link href="/">
                      <BarChartIcon color="primary" width="20px" height="20px" />
                    </Link>
                    <Link ml="8px" href="/">
                      <OpenNewIcon color="primary" width="20px" height="20px" />
                    </Link>
                  </Flex>
                </Td>
              </tr>
            </>
          </tbody>
        </Table>
      </Card>
    </Box>
  )
}
