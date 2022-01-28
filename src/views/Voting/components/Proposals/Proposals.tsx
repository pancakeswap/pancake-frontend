import React, { useState } from 'react'
import { Box, Breadcrumbs, Card, Flex, Heading, Text } from '@pancakeswap/uikit'
import Link from 'next/link'
import { useTranslation } from 'contexts/Localization'
import Container from 'components/Layout/Container'
import useSWR from 'swr'
import { ProposalState, ProposalType } from 'state/types'
import { getProposals } from 'state/voting/helpers'
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

  const { proposalType, filterState } = state

  const { status, data } = useSWR(['proposals', filterState], async () => getProposals(1000, 0, filterState))

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

  const filteredProposals = filterProposalsByState(filterProposalsByType(data, proposalType), filterState)

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
        <Filters
          filterState={filterState}
          onFilterChange={handleFilterChange}
          isLoading={status !== FetchStatus.Fetched}
        />
        {status !== FetchStatus.Fetched && <ProposalsLoading />}
        {status === FetchStatus.Fetched &&
          filteredProposals.length > 0 &&
          filteredProposals.map((proposal) => {
            return <ProposalRow key={proposal.id} proposal={proposal} />
          })}
        {status === FetchStatus.Fetched && filteredProposals.length === 0 && (
          <Flex alignItems="center" justifyContent="center" p="32px">
            <Heading as="h5">{t('No proposals found')}</Heading>
          </Flex>
        )}
      </Card>
    </Container>
  )
}

export default Proposals
