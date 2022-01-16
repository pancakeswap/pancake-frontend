import React, { useEffect, useState } from 'react'
import { Box, Breadcrumbs, Card, Flex, Heading, Text } from '@pancakeswap/uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import { useAppDispatch } from 'state'
import { fetchProposals } from 'state/voting'
import { useGetProposalLoadingStatus, useGetProposals } from 'state/voting/hooks'
import { ProposalState, ProposalType } from 'state/types'
import { FetchStatus } from 'config/constants/types'
import { filterProposalsByState, filterProposalsByType } from '../../helpers'
import ProposalsLoading from './ProposalsLoading'
import TabMenu from './TabMenu'
import ProposalRow from './ProposalRow'
import Filters from './Filters'

interface State {
  proposalType: ProposalType
  filterState: ProposalState
}

const Proposals = () => {
  const { t } = useTranslation()
  const [state, setState] = useState<State>({
    proposalType: ProposalType.CORE,
    filterState: ProposalState.ACTIVE,
  })
  const proposalStatus = useGetProposalLoadingStatus()
  const proposals = useGetProposals()
  const dispatch = useAppDispatch()

  const { proposalType, filterState } = state
  const isLoading = proposalStatus === FetchStatus.Fetching
  const isFetched = proposalStatus === FetchStatus.Fetched

  useEffect(() => {
    dispatch(fetchProposals({ first: 1000, state: filterState }))
  }, [filterState, dispatch])

  const handleProposalTypeChange = (newProposalType: ProposalType) => {
    setState((prevState) => ({
      ...prevState,
      proposalType: newProposalType,
    }))
  }

  const handleFilterChange = (newFilterState: ProposalState) => {
    setState((prevState) => ({
      ...prevState,
      filterState: newFilterState,
    }))
  }

  const filteredProposals = filterProposalsByState(filterProposalsByType(proposals, proposalType), filterState)

  return (
    <Container py="40px">
      <Box mb="48px">
        <Breadcrumbs>
          <Link to="/">{t('Home')}</Link>
          <Text>{t('Voting')}</Text>
        </Breadcrumbs>
      </Box>
      <Heading as="h2" scale="xl" mb="32px" id="voting-proposals">
        {t('Proposals')}
      </Heading>
      <Card>
        <TabMenu proposalType={proposalType} onTypeChange={handleProposalTypeChange} />
        <Filters filterState={filterState} onFilterChange={handleFilterChange} isLoading={isLoading} />
        {isLoading && <ProposalsLoading />}
        {isFetched &&
          filteredProposals.length > 0 &&
          filteredProposals.map((proposal) => {
            return <ProposalRow key={proposal.id} proposal={proposal} />
          })}
        {isFetched && filteredProposals.length === 0 && (
          <Flex alignItems="center" justifyContent="center" p="32px">
            <Heading as="h5">{t('No proposals found')}</Heading>
          </Flex>
        )}
      </Card>
    </Container>
  )
}

export default Proposals
