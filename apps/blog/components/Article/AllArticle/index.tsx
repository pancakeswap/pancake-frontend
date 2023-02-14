import styled from 'styled-components'
import useSWR from 'swr'
import { useState, useEffect } from 'react'
import { Box, Text, Flex, PaginationButton, SearchInput, InputGroup, SearchIcon } from '@pancakeswap/uikit'
import CardArticle from 'components/Article/CardArticle'
import { useTranslation } from '@pancakeswap/localization'
import { useRouter } from 'next/router'
import ArticleSortSelect from 'components/Article/ArticleSortSelect'
import { Categories } from 'types'
import CategoriesSelector from 'components/Article/CategoriesSelector'
import useAllArticle from 'hooks/useAllArticle'
import useLanguage from 'hooks/useLanguage'
import SkeletonArticle from 'components/SkeletonArticle'

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
  min-width: 194px;
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
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategories, setSelectCategoriesSelected] = useState(0)
  const [sortBy, setSortBy] = useState('createAt:desc')
  const [languageOption, setLanguageOption] = useState('all')
  const languageItems = useLanguage()
  const sortByItems = [
    { label: t('Newest First'), value: 'createAt:desc' },
    { label: t('Oldest First'), value: 'createAt:asc' },
    { label: t('Sort Title A-Z'), value: 'title:asc' },
    { label: t('Sort Title Z-A'), value: 'title:desc' },
  ]
  const { data: categoriesData } = useSWR<Categories[]>('/categories')

  useEffect(() => {
    setCurrentPage(1)
  }, [query, selectedCategories, sortBy, languageOption])

  useEffect(() => {
    if (router.isReady && router.query.category) {
      const searchedTopic = categoriesData?.find(
        (category) => category.name.toLowerCase() === (router.query.category as string).toLowerCase(),
      )
      if (searchedTopic) {
        setSelectCategoriesSelected(searchedTopic.id)
      }
    }
  }, [categoriesData, router.isReady, router.query.category])

  const { articlesData, isFetching } = useAllArticle({
    query,
    sortBy,
    currentPage,
    languageOption,
    selectedCategories,
  })
  const articles = articlesData?.data

  const handlePagination = (value: number) => {
    setCurrentPage(1)
    setCurrentPage(value)
  }

  return (
    <StyledArticleContainer id="all">
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
        <Flex width={['100%', '100%', '100%', '100%', '100%', '100%', '907px']} flexDirection="column">
          <Flex
            mb={['18px', '18px', '18px', '24px']}
            flexDirection={['column-reverse', 'column-reverse', 'column-reverse', 'row']}
            alignItems={['flexStart', 'flexStart', 'flexStart', 'center']}
            p={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}
          >
            <Flex flexDirection={['column', 'row']}>
              {languageItems.length > 0 && (
                <Box width="100%">
                  <ArticleSortSelect title={t('Languages')} options={languageItems} setOption={setLanguageOption} />
                </Box>
              )}
              <Box width="100%" m={['10px 0 0 0', '0 0 0 16px', '0 0 0 16px', '0 16px']}>
                <ArticleSortSelect title={t('Sort By')} options={sortByItems} setOption={setSortBy} />
              </Box>
            </Flex>
            <Box width="100%" m={['0 0 12px 0', '0 0 12px 0', '0 0 12px 0', '22px 0 0 0']}>
              <InputGroup startIcon={<SearchIcon style={{ zIndex: 1 }} color="textSubtle" width="18px" />}>
                <SearchInput placeholder="Search" initialValue={query} onChange={(e) => setQuery(e.target.value)} />
              </InputGroup>
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
          {!isFetching && articles.length === 0 ? (
            <Text bold fontSize={20} padding={['0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0 16px', '0']}>
              {t('No results found.')}
            </Text>
          ) : (
            <StyledCard>
              {isFetching && articles.length === 0 ? (
                <SkeletonArticle />
              ) : (
                <>
                  <Box>
                    {articles.map((article) => (
                      <CardArticle key={article.id} article={article} />
                    ))}
                  </Box>
                  <PaginationButton
                    showMaxPageText
                    currentPage={articlesData.pagination.page}
                    maxPage={articlesData.pagination.pageCount}
                    setCurrentPage={handlePagination}
                  />
                </>
              )}
            </StyledCard>
          )}
        </Flex>
      </Flex>
    </StyledArticleContainer>
  )
}

export default AllArticle
