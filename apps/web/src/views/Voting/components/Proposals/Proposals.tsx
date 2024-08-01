import { useTranslation } from '@pancakeswap/localization'
import { Box, Breadcrumbs, Card, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useQuery } from '@tanstack/react-query'
import Container from 'components/Layout/Container'
import { useSessionStorage } from 'hooks/useSessionStorage'
import Link from 'next/link'
import { ProposalState, ProposalType } from 'state/types'
import { getProposals } from 'state/voting/helpers'
import { useCallback, useMemo } from 'react'
import { filterProposalsByState, filterProposalsByType } from '../../helpers'
import Filters from './Filters'
import ProposalRow from './ProposalRow'
import ProposalsLoading from './ProposalsLoading'
import TabMenu from './TabMenu'

interface State {
  proposalType: ProposalType
  filterState: ProposalState
}

const Proposals = () => {
  const { t } = useTranslation()
  const [{ proposalType, filterState }, setState] = useSessionStorage<State>('proposals-filter', {
    proposalType: ProposalType.CORE,
    filterState: ProposalState.ACTIVE,
  })

  const { data, status } = useQuery({
    queryKey: ['voting', 'proposals', filterState],

    queryFn: async () => getProposals(1000, 0, filterState),
  })

  const handleProposalTypeChange = useCallback(
    (newProposalType: ProposalType) => {
      setState((prevState) => ({
        ...prevState,
        proposalType: newProposalType,
      }))
    },
    [setState],
  )

  const handleFilterChange = useCallback(
    (newFilterState: ProposalState) => {
      setState((prevState) => ({
        ...prevState,
        filterState: newFilterState,
      }))
    },
    [setState],
  )

  const filteredProposals = useMemo(
    () => filterProposalsByState(filterProposalsByType(data || [], proposalType), filterState),
    [data, proposalType, filterState],
  )

  return (
    <Container py="40px">
      <Box mb="48px">
        <Breadcrumbs>
          <Link href="/">{t('Home')}</Link>
          <Text>{t('Voting')}</Text>
        </Breadcrumbs>
      </Box>
      <Heading as="h2" scale="xl" mb="32px" id="voting-proposals">
        {t('Proposals')}
      </Heading>
      <Card>
        <TabMenu proposalType={proposalType} onTypeChange={handleProposalTypeChange} />
        <Filters filterState={filterState} onFilterChange={handleFilterChange} isLoading={status !== 'success'} />
        {status !== 'success' && <ProposalsLoading />}
        {status === 'success' &&
          filteredProposals.length > 0 &&
          filteredProposals.map((proposal) => {
            return <ProposalRow key={proposal.id} proposal={proposal} />
          })}
        {status === 'success' && filteredProposals.length === 0 && (
          <Flex alignItems="center" justifyContent="center" p="32px">
            <Heading as="h5">{t('No proposals found')}</Heading>
          </Flex>
        )}
      </Card>
    </Container>
  )
}

export default Proposals
