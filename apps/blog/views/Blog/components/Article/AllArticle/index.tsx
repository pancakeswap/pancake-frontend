import styled from 'styled-components'
import useSWR from 'swr'
import { useDebounce } from '@pancakeswap/hooks'
import { useState, useMemo } from 'react'
import { Box, Text, Flex, PaginationButton, SearchInput } from '@pancakeswap/uikit'
import CardArticle from 'views/Blog/components/Article/CardArticle'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import ArticleSortSelect from 'views/Blog/components/Article/ArticleSortSelect'
import { Categories } from 'views/Blog/types'
import CategoriesSelector from 'views/Blog/components/Article/CategoriesSelector'

const StyledArticleContainer = styled(Box)`
  width: 100%;
  margin: 45px auto 80px auto;
  z-index: 0;

  ${({ theme }) => theme.mediaQueries.md} {
    margin: 80px auto;
  }

  @media screen and (min-width: 1440px) {
    width: 1160px;
  }
`

const StyledTagContainer = styled(Box)`
  display: none;
  width: 194px;
  margin-right: 25px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    display: flex;
    flex-direction: column;
  }
`

const StyledMobileTagContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  margin-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.xxl} {
    display: none;
  }
`

const StyledCard = styled(Flex)`
  width: 100%;
  border-radius: 0;
  overflow: hidden;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.xxl} {
    border: ${({ theme }) => `1px solid ${theme.colors.cardBorder}`};
    border-bottom: ${({ theme }) => `3px solid ${theme.colors.cardBorder}`};
    border-radius: ${({ theme }) => theme.radii.card};
  }
`

const AllArticle = () => {
  const { t } = useTranslation()
  const [query, setQuery] = useState<string>('')
  const [currentPage, setCurrentPage] = useState(1)
  const [maxPage, setMaxPages] = useState(1)
  const [selectedCategories, setSelectCategoriesSelected] = useState(0)
  const [sortBy, setSortBy] = useState('createAt:desc')
  const [languageOption, setLanguageOption] = useState('all')

  const { data: categoriesData } = useSWR<Categories[]>('/categories')

  const languageItems = [
    { label: t('All'), value: 'all' },
    { label: 'English', value: 'en' },
    { label: '简体中文', value: 'zh-CN' },
    { label: '日本語', value: 'ja' },
    { label: 'Español', value: 'es' },
    { label: 'Bahasa Indonesia', value: 'id' },
    { label: 'Português', value: 'pt' },
    { label: 'Georgian', value: 'ka' },
    { label: 'Türkçe', value: 'tr' },
    { label: 'हिंदी', value: 'hi' },
  ]

  const sortByItems = [
    { label: t('Date'), value: 'createAt:desc' },
    { label: t('Sort Title A-Z'), value: 'title:asc' },
    { label: t('Sort Title Z-A'), value: 'title:desc' },
  ]

  // const { data: articlesData, isValidating } = useSWR(
  //   [`/articles`, query, currentPage, selectedCategories, sortBy, languageOption],
  //   async () => {
  //     // pagination: { page: searchPage, pageSize: 10 },
  //   }, {
  //     revalidateOnFocus: false,
  //     revalidateIfStale: false,
  //     revalidateOnReconnect: false,
  //     revalidateOnMount: true,
  //   }
  // )

  // const loading = useDebounce(isValidating, 400)
  // const articles = articlesData?.data

  return (
    <StyledArticleContainer>
      <Text
        bold
        color="secondary"
        mb={['12px', '12px', '12px', '35px']}
        pl={['16px']}
        fontSize={['24px', '24px', '24px', '40px']}
      >
        {t('All articles')}
      </Text>
      <Flex p={['0', '0', '0', '0', '0', '0', '0 16px']}>
        <StyledTagContainer>
          <CategoriesSelector
            selected={selectedCategories}
            categoriesData={categoriesData ?? []}
            setSelected={setSelectCategoriesSelected}
            childMargin="0 0 28px 0"
          />
        </StyledTagContainer>
        <Flex width="100%" flexDirection="column">
          <Flex
            mb={['18px', '18px', '18px', '24px']}
            flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
            alignItems={['flexStart', 'flexStart', 'flexStart', 'center']}
            p={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}
          >
            <Flex flexDirection={['column', 'row']}>
              <Box width="100%">
                <ArticleSortSelect title={t('Languages')} options={languageItems} setOption={setLanguageOption} />
              </Box>
              <Box width="100%" m={['10px 0 0 0', '0 0 0 16px', '0 0 0 16px', '0 16px']}>
                <ArticleSortSelect title={t('Sort By')} options={sortByItems} setOption={setSortBy} />
              </Box>
            </Flex>
            <Box width="100%" m={['0 0 12px 0', '0 0 12px 0', '0 0 12px 0', '22px 0 0 0']}>
              <SearchInput placeholder="Search" initialValue={query} onChange={(e) => setQuery(e.target.value)} />
            </Box>
          </Flex>
          <StyledMobileTagContainer>
            <Text fontSize="12px" textTransform="uppercase" color="textSubtle" fontWeight={600} mb="4px">
              {t('Filter by')}
            </Text>
            <Flex overflowY="auto">
              <CategoriesSelector
                selected={selectedCategories}
                categoriesData={categoriesData ?? []}
                setSelected={setSelectCategoriesSelected}
                childMargin="0 4px 4px 0"
              />
            </Flex>
          </StyledMobileTagContainer>
          {/* {!loading && maxPage === 0 && query !== '' && (
            <Flex
              mb="24px"
              padding={['0 16px', '0 16px', '0 16px', '0 16px', '0']}
            >
              <Text>{t('%total% Results for', { total: maxPage })}</Text>
              <Text ml="4px" bold>“mul”</Text>
            </Flex>
          )} */}
          {/* <StyledCard>
            {loading ? (
              <></>
            ): (
              <>
                <Box>
                  <CardArticle />
                  <CardArticle />
                </Box>
                <PaginationButton
                  showMaxPageText
                  currentPage={currentPage}
                  maxPage={maxPage}
                  setCurrentPage={setCurrentPage}
                />
              </>
            )}
          </StyledCard> */}
        </Flex>
      </Flex>
    </StyledArticleContainer>
  )
}

export default AllArticle
