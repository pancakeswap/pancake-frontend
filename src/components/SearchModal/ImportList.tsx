import { useState, useCallback } from 'react'
import styled from 'styled-components'
import { Button, Text, Link, Flex, Checkbox, Message } from '@pancakeswap/uikit'
import Card from 'components/Card'
import { AutoColumn } from 'components/Layout/Column'
import { RowBetween, RowFixed } from 'components/Layout/Row'
import useTheme from 'hooks/useTheme'
import { ListLogo } from 'components/Logo'
import { TokenList } from '@uniswap/token-lists'
import { useAppDispatch } from 'state'
import useFetchListCallback from 'hooks/useFetchListCallback'
import { removeList, enableList } from 'state/lists/actions'
import { useAllLists } from 'state/lists/hooks'
import { useTranslation } from 'contexts/Localization'

interface ImportProps {
  listURL: string
  list: TokenList
  onImport: () => void
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

const TextDot = styled.div`
  height: 3px;
  width: 3px;
  background-color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
`

function ImportList({ listURL, list, onImport }: ImportProps) {
  const { theme } = useTheme()
  const dispatch = useAppDispatch()

  const { t } = useTranslation()

  // user must accept
  const [confirmed, setConfirmed] = useState(false)

  const lists = useAllLists()
  const fetchList = useFetchListCallback()

  // monitor is list is loading
  const adding = Boolean(lists[listURL]?.loadingRequestId)
  const [addError, setAddError] = useState<string | null>(null)

  const handleAddList = useCallback(() => {
    if (adding) return
    setAddError(null)
    fetchList(listURL)
      .then(() => {
        dispatch(enableList(listURL))
        onImport()
      })
      .catch((error) => {
        setAddError(error.message)
        dispatch(removeList(listURL))
      })
  }, [adding, dispatch, fetchList, listURL, onImport])

  return (
    <Wrapper>
      <AutoColumn gap="md">
        <AutoColumn gap="md">
          <Card padding="12px 20px">
            <RowBetween>
              <RowFixed>
                {list.logoURI && <ListLogo logoURI={list.logoURI} size="40px" />}
                <AutoColumn gap="sm" style={{ marginLeft: '20px' }}>
                  <RowFixed>
                    <Text bold mr="6px">
                      {list.name}
                    </Text>
                    <TextDot />
                    <Text small color="textSubtle" ml="6px">
                      {list.tokens.length} tokens
                    </Text>
                  </RowFixed>
                  <Link
                    small
                    external
                    ellipsis
                    maxWidth="90%"
                    href={`https://tokenlists.org/token-list?url=${listURL}`}
                  >
                    {listURL}
                  </Link>
                </AutoColumn>
              </RowFixed>
            </RowBetween>
          </Card>

          <Message variant="danger">
            <Flex flexDirection="column">
              <Text fontSize="20px" textAlign="center" color={theme.colors.failure} mb="16px">
                {t('Import at your own risk')}
              </Text>
              <Text color={theme.colors.failure} mb="8px">
                {t(
                  'By adding this list you are implicitly trusting that the data is correct. Anyone can create a list, including creating fake versions of existing lists and lists that claim to represent projects that do not have one.',
                )}
              </Text>
              <Text bold color={theme.colors.failure} mb="16px">
                {t('If you purchase a token from this list, you may not be able to sell it back.')}
              </Text>
              <Flex alignItems="center">
                <Checkbox
                  name="confirmed"
                  type="checkbox"
                  checked={confirmed}
                  onChange={() => setConfirmed(!confirmed)}
                  scale="sm"
                />
                <Text ml="10px" style={{ userSelect: 'none' }}>
                  {t('I understand')}
                </Text>
              </Flex>
            </Flex>
          </Message>

          <Button disabled={!confirmed} onClick={handleAddList}>
            {t('Import')}
          </Button>
          {addError ? (
            <Text color="failure" style={{ textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {addError}
            </Text>
          ) : null}
        </AutoColumn>
      </AutoColumn>
    </Wrapper>
  )
}

export default ImportList
