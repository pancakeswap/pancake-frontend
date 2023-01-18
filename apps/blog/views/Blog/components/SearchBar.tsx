import { useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Box, Text, SearchInput, InputGroup, SearchIcon } from '@pancakeswap/uikit'
import { useRouter } from 'next/router'
import useSearchBarArticle from 'views/Blog/hooks/useSearchBarArticle'

const SubMenu = styled.div<{ isOpen: boolean }>`
  align-items: center;
  background: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  border-radius: 0 0 ${({ theme }) => theme.radii.default} ${({ theme }) => theme.radii.default};
  left: 0;
  padding-bottom: 8px;
  padding-top: 16px;
  position: absolute;
  top: 30px;
  transition: transform 0.15s, opacity 0.15s;
  transform: scaleY(0);
  transform-origin: top;
  width: 100%;
  z-index: 0;

  ${({ isOpen }) =>
    isOpen &&
    `
    height: auto;
    opacity: 1;
    overflow-y: auto;
    max-height: 200px;
    transform: scaleY(1);
  `}
`
const ArticleList = styled(Text)`
  cursor: pointer;
  overflow-wrap: break-word;
  font-weight: bold;
  padding: 8px 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  &:hover {
    background: ${({ theme }) => theme.colors.inputSecondary};
  }
`

const SearchBar = () => {
  const { t } = useTranslation()
  const router = useRouter()
  const [searchKey, setSearchKey] = useState('')
  const { articlesData, isFetching } = useSearchBarArticle(searchKey)

  const handleClick = (value: string) => {
    router.push(`/blog/article?search=${value}`)
  }

  return (
    <Box position="relative" zIndex={1} ml={['0', '0', '0', 'auto']} mb={['24px', '24px', '24px', '0']}>
      <Box position="relative" zIndex={1}>
        <InputGroup startIcon={<SearchIcon style={{ zIndex: 1 }} color="textSubtle" width="18px" />}>
          <SearchInput placeholder="Search" initialValue={searchKey} onChange={(e) => setSearchKey(e.target.value)} />
        </InputGroup>
      </Box>
      {searchKey !== '' && (
        <SubMenu isOpen={!isFetching}>
          {articlesData.length > 0 ? (
            <Box>
              {articlesData.map((article) => (
                <ArticleList key={article.id} onClick={() => handleClick(article.title)}>
                  {article.title}
                </ArticleList>
              ))}
            </Box>
          ) : (
            <Text px="16px" fontWeight="bold">
              {t('No results found.')}
            </Text>
          )}
        </SubMenu>
      )}
    </Box>
  )
}

export default SearchBar
