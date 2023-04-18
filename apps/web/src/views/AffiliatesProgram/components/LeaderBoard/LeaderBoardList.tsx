import { useEffect, useState } from 'react'
import { Flex, Text, Card, PaginationButton, Table, Td, Th } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

const MAX_PER_PAGE = 20

const LeaderBoardList = () => {
  const { t } = useTranslation()
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)

  return (
    <Flex maxWidth={1120} padding="0 16px" margin="auto auto 100px auto">
      <Card style={{ width: '100%' }}>
        <Table>
          <thead>
            <Th width="5%" />
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                {t('Affilaite')}
              </Text>
            </Th>
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                {t('New Users')}
              </Text>
            </Th>
            <Th>
              <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                {t('Total Volume')}
              </Text>
            </Th>
            <Th width="15%">
              <Text fontSize="12px" bold textTransform="uppercase" color="secondary" textAlign="left">
                {t('Commission')}
              </Text>
            </Th>
          </thead>
          <tbody>
            <tr>
              <Td>
                <Text color="secondary" bold>
                  #2
                </Text>
              </Td>
              <Td>
                <Text color="primary" bold>
                  Chungus
                </Text>
              </Td>
              <Td>
                <Text bold>500</Text>
              </Td>
              <Td>
                <Text bold>~$13,000,000</Text>
              </Td>
              <Td>
                <Flex flexDirection="column">
                  <Text bold>500 CAKE</Text>
                  <Text textAlign="left" fontSize="12px" color="textSubtle">
                    ~$500
                  </Text>
                </Flex>
              </Td>
            </tr>
          </tbody>
        </Table>
        <PaginationButton showMaxPageText currentPage={currentPage} maxPage={maxPage} setCurrentPage={setCurrentPage} />
      </Card>
    </Flex>
  )
}

export default LeaderBoardList
